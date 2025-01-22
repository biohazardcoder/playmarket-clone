import Product from "../models/product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

export const CreateNewProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Serverdagi ichki xatolik.", product: newProduct });
  } catch (error) {
    return sendErrorResponse(res, 500, error);
  }
};

export const GetAllProducts = async (req, res) => {
  try {
    let { title = "", category = "", pageNum = 1, pageSize = 10 } = req.query;

    pageNum = parseInt(pageNum, 10);
    pageSize = parseInt(pageSize, 10);

    if (isNaN(pageNum) || pageNum <= 0) pageNum = 1;
    if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;

    const titleRegExp = new RegExp(title, "i");
    const categoryRegExp = new RegExp(category, "i");

    const total = await Product.countDocuments({
      title: titleRegExp,
      category: categoryRegExp,
    });

    const products = await Product.find({
      title: titleRegExp,
      category: categoryRegExp,
    })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({ data: products, total });
  } catch (error) {
    console.error("Error in GetAllProducts:", error);
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};


export const DeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return sendErrorResponse(res, 404, "Mahsulot topilmadi.");
    }

    if (product.photos && product.photos.length > 0) {
      product.photos.forEach((photo) => {
        const slicedPhoto = photo.slice(29);
        const filePath = path.join(__dirname, "..", "uploads", slicedPhoto);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.warn(`Mahsulot topilmadi.: ${filePath}`);
          }
        } catch (err) {
          console.error(`Rasmni oʻchirib boʻlmadi: ${filePath}`, err);
        }
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log("Mahsulot va tegishli rasmlar muvaffaqiyatli oʻchirildi.")

    return res.status(201).json({
      message: "Mahsulot va tegishli rasmlar muvaffaqiyatli oʻchirildi.",
      deletedProduct,
    });
  } catch (error) {
    console.error("Mahsulotni oʻchirishda xatolik yuz berdi:", error);
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const UpdateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });
    if (!product) {
      return sendErrorResponse(res, 409, "Mahsulot topilmadi.");
    }
    return res.status(201).json({ data: product });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const GetOneProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const oneProduct = await Product.findById(productId);
    if (!oneProduct) {
      return sendErrorResponse(res, 409, "Mahsulot topilmadi.");
    }
    return res.status(201).json({ data: oneProduct });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};
export const GetProductsByIds = async (req, res) => {
  const productIds = req.body.ids;
  try {
    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (!products || products.length === 0) {
      return sendErrorResponse(res, 404, "Mahsulotlar topilmadi.");
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const HandleComment = async (req, res) => {
  try {
    const { productId, user, text, like } = req.body

    if (!productId || !user || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Not Found" });

    }
    const newComment = {
      user,
      text,
      like: like >= 0 && like <= 5 ? like : 0
    }
    product.comments.push(newComment)
    await product.save()

    res.status(200).json({ message: "Comment added successfully", product });
  } catch (error) {
    return sendErrorResponse(res, 500, error);
  }
}