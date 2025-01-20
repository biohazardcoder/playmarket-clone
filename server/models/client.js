import mongoose from "mongoose";

const Client = new mongoose.Schema({
  phoneNumber: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  avatar: { type: String },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

export default mongoose.model("Client", Client);
