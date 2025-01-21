import express from "express";
import {
  ClientRegisterOrLogin,
  DeleteClient,
  GetAllClients,
  GetMe,
  UpdateClient,
} from "../controllers/client.js";
import isExisted from "../middlewares/isExisted.js";
import IsAdmin from "../middlewares/IsAdmin.js";

const router = express.Router();

router.get("/", isExisted, IsAdmin, GetAllClients);
router.get("/me", isExisted, GetMe);
router.post("/login", ClientRegisterOrLogin);
router.put("/:id", isExisted, UpdateClient);
router.delete("/:id", isExisted, DeleteClient);

export default router;
