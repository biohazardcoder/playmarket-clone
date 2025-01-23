import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import AdminRoutes from "./routes/admin.js";
import ProductRoutes from "./routes/product.js";
import ClientRoutes from "./routes/client.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json());


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const mimeType = file.mimetype;
    console.log("Fayl turi:", mimeType);

    let resourceType = "raw";

    if (mimeType.startsWith("image")) {
      resourceType = "image";
    } else if (mimeType === "application/vnd.android.package-archive") {
      resourceType = "raw";
    } else if (mimeType === "application/x-msdownload") {
      resourceType = "raw";
    }

    return {
      folder: "uploads",
      public_id: file.originalname.split(".")[0],
      resource_type: resourceType,
    };
  },
});



const upload = multer({ storage });

app.post(
  "/upload",
  upload.fields([{ name: "photos", maxCount: 10 }, { name: "file", maxCount: 1 }]),
  async (req, res) => {
    if (!req.files || (!req.files.photos && !req.files.file)) {
      return res.status(400).json({ message: "Fayllar yuklanmadi!" });
    }

    const uploadedPhotos = req.files.photos
      ? req.files.photos.map((file) => file.path)
      : [];

    const uploadedFile = req.files.file ? req.files.file[0].path : null;

    res.status(200).json({
      message: "Fayllar muvaffaqiyatli yuklandi!",
      photos: uploadedPhotos,
      file: uploadedFile,
    });

    console.log("Yuklangan rasmlar:", uploadedPhotos);
    console.log("Yuklangan fayl:", uploadedFile);
  }
);

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
