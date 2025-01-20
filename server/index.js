import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";

import AdminRoutes from "./routes/admin.js";
import ProductRoutes from "./routes/product.js";
import ClientRoutes from "./routes/client.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.fields([{ name: "photos", maxCount: 10 }, { name: "file", maxCount: 1 }]), async (req, res) => {
  if (!req.files || (!req.files.photos && !req.files.file)) {
    return res.status(400).json({ message: "Fayllar yuklanmadi!" });
  }

  const uploadedPhotos = req.files.photos
    ? req.files.photos.map((file) => `http://localhost:4000/uploads/${file.filename}`)
    : [];

  const uploadedFile = req.files.file
    ? `http://localhost:4000/uploads/${req.files.file[0].filename}`
    : null;

  res.status(200).json({
    message: "Fayllar muvaffaqiyatli yuklandi!",
    photos: uploadedPhotos,
    file: uploadedFile,
  });

  console.log("Yuklangan rasmlar:", uploadedPhotos);
  console.log("Yuklangan fayl:", uploadedFile);
});

app.use("/uploads", express.static(uploadDir));

app.get("/", (_, res) => res.send("Hello world!"));
app.use("/admin", AdminRoutes);
app.use("/client", ClientRoutes);
app.use("/product", ProductRoutes);

const startApp = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT, () =>
      console.log(`server is running on http://localhost:${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startApp();
