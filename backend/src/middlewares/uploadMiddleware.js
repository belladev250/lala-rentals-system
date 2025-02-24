import multer from "multer";
import path from "path";

// Get the absolute path of the uploads folder
const uploadPath = path.resolve("src", "uploads");

console.log("Uploads directory path: ", uploadPath); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    console.log("Saving file to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

export const upload = multer({ storage, fileFilter });
