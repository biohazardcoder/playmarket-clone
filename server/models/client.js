import mongoose from "mongoose";

const Client = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, },
  lastName: { type: String, },
  password: { type: String, },
  address: { type: String, },
  avatar: { type: String },
});

export default mongoose.model("Client", Client);
