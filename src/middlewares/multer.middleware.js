import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

/*
  Summary:
  - Ye setup multer ko configure karta hai taaki files local system pe store ho sakein.
  - 'public/temp' folder me file temporarily save hoti hai.
  - Yeh utility mostly tab use hoti hai jab hume Cloudinary ya kisi aur cloud service me file upload karni hoti hai.
  - Local me temporarily save karke baad me cloud pe bhejna better practice hoti hai.
*/
