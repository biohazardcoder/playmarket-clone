import generateAvatar from "../middlewares/generateAvatar.js";
import generateToken from "../middlewares/generateToken.js";
import Admin from "../models/admin.js";
import bcrypt from "bcrypt";

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

export const GetAllAdmins = async (_, res) => {
  try {
    const admins = await Admin.find();
    return res.json({ data: admins });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const GetOneAdmin = async (req, res) => {
  const adminId = req.params.id;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return sendErrorResponse(res, 409, "Admin topilmadi.");
    }
    return res.status(201).json({ data: admin });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const CreateNewAdmin = async (req, res) => {
  const { phoneNumber, password, firstName, lastName, avatar } = req.body;
  try {
    const admin = await Admin.findOne({ phoneNumber });
    if (admin) {
      return sendErrorResponse(
        res,
        409,
        "Bu telefon raqamiga ega administrator allaqachon mavjud. Iltimos, boshqa raqamdan foydalaning."
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarPhoto = avatar ? avatar : generateAvatar(firstName, lastName);
    const newAdmin = new Admin({
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      avatar: avatarPhoto,
    });

    newAdmin.save();

    const token = generateToken({ _id: newAdmin._id, role: "admin" });

    return res.status(201).json({
      message: "Yangi admin yaratildi!",
      data: newAdmin,
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const UpdateAdmin = async (req, res) => {
  const userId = req.params.id;
  const { phoneNumber, firstName, lastName, password } = req.body;

  try {
    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = {
      phoneNumber,
      lastName,
      firstName,
      avatar: generateAvatar(firstName, lastName),
    };

    if (password) {
      updatedAdmin.password = hashedPassword;
    }

    const admin = await Admin.findByIdAndUpdate(userId, updatedAdmin, {
      new: true,
    });

    if (!admin) {
      return res.status(409).json({ message: "Admin topilmadi." });
    }

    return res.status(201).json({ data: admin });
  } catch (error) {
    return res.status(500).json({ message: "Serverdagi ichki xatolik." });
  }
};

export const AdminLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const admin = await Admin.findOne({ phoneNumber });

    if (!admin) {
      return sendErrorResponse(
        res,
        401,
        "Bu telefon raqamiga ega admin mavjud emas."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Telefon raqami yoki parol noto'g'ri.");
    }

    const token = generateToken({ _id: admin._id, role: "admin" });

    return res.status(200).json({
      message: "Muvaqqiyatli!",
      data: admin,
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const DeleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return sendErrorResponse(res, 404, "Admin topilmadi.");
    }
    return res
      .status(201)
      .json({ message: "Admin muvaffaqiyatli o'chirildi." });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const GetMe = async (req, res) => {
  try {
    const foundAdmin = await Admin.findById(req.userInfo.userId);
    if (!foundAdmin)
      return res.status(404).json({ message: "Admin topilmadi." });
    return res.status(200).json({ data: foundAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
