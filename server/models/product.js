import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  device: { type: String, required: true },
  trailer: { type: String, required: true },
  company: { type: String, required: true },
  sale: { type: Number },
  photos: [{ type: String, required: true }],
  like: { type: Number, default: 0 },
  file: { type: String, required: true },
  download: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  description: { type: String, required: true },
  comments: [
    {
      user: { type: Object, },
      text: { type: String, required: true },
      like: { type: Number, default: 0, min: 0, max: 5 },
    }]
});


export default mongoose.model("Product", ProductSchema);
