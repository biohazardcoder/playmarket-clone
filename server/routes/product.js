import express from "express";
import {
  CreateNewProduct,
  DeleteProduct,
  GetAllProducts,
  GetOneProduct,
  GetProductsByIds,
  HandleComment,
  UpdateProduct,
} from "../controllers/product.js";
import isExisted from "../middlewares/isExisted.js";
import IsAdmin from "../middlewares/IsAdmin.js";

const router = express.Router();

router.get("/", GetAllProducts);
router.get("/:id", GetOneProduct);
router.post("/create", isExisted, IsAdmin, CreateNewProduct);
router.post("/comment", HandleComment);
router.delete("/:id", isExisted, IsAdmin, DeleteProduct);
router.put("/:id", isExisted, UpdateProduct);
router.post("/get-products-by-ids", GetProductsByIds);


export default router;
