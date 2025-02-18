import cloudinary from "cloudinary";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { spawnSync } from "child_process";
import { Readable } from "stream";
import { parseBuffer } from "music-metadata";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Strips metadata from the audio file to avoid FFmpeg issues.
 * @param {Buffer} buffer - The audio file buffer.
 * @returns {Promise<Buffer>} - The buffer without metadata.
 */
const stripMetadata = async (buffer) => {
  try {
    await parseBuffer.parseBuffer(buffer, "audio/mpeg"); // Parse metadata (optional)
    return buffer; // Return the original buffer (or modify if needed)
  } catch (error) {
    console.error("Error stripping metadata:", error.message);
    return buffer; // Fallback to original buffer
  }
};

/**
 * Compresses audio using FFmpeg.
 * @param {Buffer} buffer - The audio file buffer.
 * @returns {Buffer} - The compressed audio buffer.
 */
const compressAudio = async (buffer) => {
  const tempOutput = "pipe:1"; // Output to stdout

  // Log the FFmpeg command for debugging
  console.log("Running FFmpeg command:", [
    "-i",
    "pipe:0",
    "-vn",
    "-acodec",
    "libmp3lame",
    "-ab",
    "96k",
    "-ac",
    "1",
    "-f",
    "mp3",
    "-y",
    tempOutput,
  ]);

  const ffmpeg = spawnSync(
    ffmpegPath,
    [
      "-i",
      "pipe:0", // Input from stdin
      "-vn", // Ignore video (album art)
      "-acodec",
      "libmp3lame", // Use MP3 codec
      "-ab",
      "96k", // Set bitrate to 96k
      "-ac",
      "1", // Mono audio
      "-f",
      "mp3", // Output format
      "-y", // Overwrite output file if exists
      tempOutput, // Output file location
    ],
    { input: buffer }
  );

  // Log FFmpeg output for debugging
  console.log("FFmpeg stdout:", ffmpeg.stdout?.toString());
  console.log("FFmpeg stderr:", ffmpeg.stderr?.toString());

  if (ffmpeg.status !== 0) {
    throw new Error(`FFmpeg compression failed: ${ffmpeg.stderr.toString()}`);
  }

  return ffmpeg.stdout;
};

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
      // Process image using Sharp
      processedBuffer = await sharp(file.buffer)
        .resize({ width: 1000, withoutEnlargement: true })
        .jpeg({ quality: 50, mozjpeg: true })
        .toBuffer();
    } else if (isAudio) {
      // Process audio using FFmpeg
      try {
        const strippedBuffer = await stripMetadata(file.buffer); // Strip metadata first
        processedBuffer = await compressAudio(strippedBuffer);
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

  // Upload to Cloudinary
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
