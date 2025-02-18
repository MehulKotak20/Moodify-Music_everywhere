import cloudinary from "cloudinary";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";
import { Readable } from "stream";

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Converts a buffer to a readable stream for Cloudinary.
 * @param {Buffer} buffer - The file buffer.
 * @returns {Readable} - A readable stream.
 */
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

/**
 * Compresses audio using FFmpeg.
 * @param {Buffer} buffer - The audio file buffer.
 * @returns {Promise<Buffer>} - The compressed audio buffer.
 */
const compressAudio = async (buffer) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-i",
      "pipe:0", // Read from stdin
      "-vn", // Ignore video
      "-acodec",
      "libmp3lame", // MP3 codec
      "-ab",
      "96k", // 96kbps bitrate
      "-ac",
      "1", // Mono audio
      "-f",
      "mp3", // Output format
      "pipe:1", // Write to stdout
    ]);

    let outputBuffer = Buffer.alloc(0);

    ffmpeg.stdout.on("data", (chunk) => {
      outputBuffer = Buffer.concat([outputBuffer, chunk]);
    });

    ffmpeg.stderr.on("data", (data) => {
      console.error("FFmpeg error:", data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputBuffer);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.stdin.write(buffer);
    ffmpeg.stdin.end();
  });
};

/**
 * Uploads a file to Cloudinary after processing.
 * @param {Object} file - The file object with buffer and mimetype.
 * @param {string} folder - The Cloudinary folder to upload to.
 * @returns {Promise<string>} - The secure URL of the uploaded file.
 */
export const uploadToCloudinary = async (file, folder) => {
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new Error("No file or empty file buffer provided");
  }

  const isAudio = file.mimetype.startsWith("audio");
  const resourceType = isAudio ? "video" : "image"; // Cloudinary uses "video" for audio files
  let processedBuffer;

  try {
    if (resourceType === "image") {
      // ✅ Optimize image using Sharp
      processedBuffer = await sharp(file.buffer)
        .resize({ width: 1000, withoutEnlargement: true })
        .jpeg({ quality: 50, mozjpeg: true })
        .toBuffer();
    } else if (isAudio) {
      // ✅ Compress audio using FFmpeg
      try {
        processedBuffer = await compressAudio(file.buffer);
      } catch (ffmpegError) {
        console.error(
          "FFmpeg compression failed, using original file:",
          ffmpegError.message
        );
        processedBuffer = file.buffer; // Fallback to original buffer
      }
    }
  } catch (error) {
    throw new Error(`File processing failed: ${error.message}`);
  }

  // ✅ Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    bufferToStream(processedBuffer).pipe(uploadStream);
  });
};
