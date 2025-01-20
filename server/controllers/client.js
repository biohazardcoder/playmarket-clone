import Client from "../models/client.js";
import bcrypt from "bcrypt";
import generateAvatar from "../middlewares/generateAvatar.js";
import generateToken from "../middlewares/generateToken.js";

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

export const ClientRegister = async (req, res) => {
  const { phoneNumber, firstName, lastName, avatar, address, password } = req.body;

  try {
    const existingClient = await Client.findOne({ phoneNumber });

    if (existingClient) {
      return sendErrorResponse(
        res,
        409,
        "Bu telefon raqamiga ega foydalanuvchi allaqachon mavjud. Iltimos, boshqa raqamdan foydalaning."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarPhoto = avatar ? avatar : generateAvatar(firstName, lastName);
    const newClient = new Client({
      phoneNumber,
      firstName,
      lastName,
      address,
      avatar: avatarPhoto,
      password: hashedPassword,
    });

    await newClient.save();

    const token = generateToken({ _id: newClient._id, role: "client" });

    return res.status(201).json({
      message: "Yangi foydalanuvchi muvaffaqiyatli yaratildi!",
      data: newClient,
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, error);
  }
};

export const ClientLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const client = await Client.findOne({ phoneNumber });

    if (!client) {
      return sendErrorResponse(
        res,
        401,
        "Bu telefon raqamiga ega foydalanuvchi mavjud emas."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Telefon raqami yoki parol noto'g'ri.");
    }

    const token = generateToken({ _id: client._id, role: "client" });

    return res.status(200).json({
      message: "Muvaffaqiyatli ro'yxatdan o'tildi!",
      client,
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const GetAllClients = async (_, res) => {
  try {
    const clients = await Client.find();
    return res.json(clients);
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const UpdateClient = async (req, res) => {
  const userId = req.params.id;
  const { phoneNumber, firstName, lastName, avatar, password } = req.body;
  try {
    let updatedClient = { phoneNumber, firstName, lastName, avatar };
    if (password) {
      updatedClient.password = await bcrypt.hash(password, 10);
    }

    const client = await Client.findByIdAndUpdate(userId, updatedClient, {
      new: true,
    });
    if (!client) {
      return sendErrorResponse(res, 409, "Mijoz topilmadi.");
    }
    return res.status(200).json({ data: client });
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};


export const DeleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return sendErrorResponse(res, 404, "Mijoz topilmadi.");
    }
    return res
      .status(201)
      .json({ message: "Mijoz muvaffaqiyatli o'chirildi." });
  } catch (error) {
    return sendErrorResponse(res, 500, "Serverdagi ichki xatolik.");
  }
};

export const GetMe = async (req, res) => {
  try {
    const foundClient = await Client.findById(req.userInfo.userId)
      .populate({
        path: "orders",
        populate: {
          path: "products.productId",
          model: "Product",
        },
      });

    if (!foundClient) {
      return res.status(404).json({ message: "Mijoz topilmadi." });
    }

    return res.status(200).json({ data: foundClient });
  } catch (error) {
    console.error("Mijoz tafsilotlarini olishda xatolik yuz berdi:", error.message);
    res.status(500).json({ error: error.message });
  }
};
