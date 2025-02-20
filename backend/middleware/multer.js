import multer from "multer";

// Use memoryStorage to store files in memory (not disk)
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
