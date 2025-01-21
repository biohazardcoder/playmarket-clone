import Client from "../models/client.js";
import bcrypt from "bcrypt";
import generateToken from "../middlewares/generateToken.js";

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

export const ClientRegisterOrLogin = async (req, res) => {
  const { email, firstName, lastName, avatar, address, password } = req.body;

  try {
    let client = await Client.findOne({ email });

    if (!client) {
      const existingClient = await Client.findOne({ email });

      if (existingClient) {
        return sendErrorResponse(
          res,
          409,
          "Bu email manzili bilan foydalanuvchi allaqachon mavjud. Iltimos, boshqa emaildan foydalaning."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      client = new Client({
        email,
        firstName,
        lastName,
        address,
        avatar,
        password: hashedPassword,
      });

      await client.save();

      const token = generateToken({ _id: client._id, role: "client" });

      return res.status(201).json({
        message: "Yangi foydalanuvchi muvaffaqiyatli yaratildi!",
        data: client,
        token,
      });
    } else {
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
    }

  } catch (error) {
    return sendErrorResponse(res, 500, error);
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
