import React, { useState } from "react";
import Axios from "../../Axios";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    category: "",
    company: "",
    sale: 0,
    photos: [],
    like: 0,
    download: 0,
    age: 0,
    description: "",
    comments: [],
  });

  const [isEditing, _] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e: any) => {
    try {
      const formImageData = new FormData();
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        formImageData.append("photos", files[i]);
      }
      const { data } = await Axios.post("upload", formImageData);
      setProductData((prevData: any) => ({
        ...prevData,
        photos: [...prevData.photos, ...data.photos],
      }));
      setImagePreview(data.photos[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setProductData((prevData) => ({ ...prevData, photos: [] }));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/product/create", {
        title: productData.title || "",
        price: productData.price || 0,
        category: productData.category || "",
        sale: productData.sale || 0,
        company: productData.company || "",
        photos: productData.photos || [],
        like: productData.like || 0,
        download: productData.download || 0,
        age: productData.age || 0,
        description: productData.description || "",
        comments: productData.comments || [],
      });
      toast.success("Yangi mahsulot qo'shildi!");
      console.log(response);
      setTimeout(() => {
        window.location.href = "/games";
      }, 1000);
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error("Mahsulotni qo'shishda xato!");
    }
  };

  return (
    <section className="p-4 sm:p-8 text-mainly overflow-y-auto col-span-12 row-span-10 md:col-span-10 md:row-span-11 bg-theme">
      <ToastContainer />
      <form
        onSubmit={handleFormSubmit}
        className="md:w-3/4 w-full m-auto  bg-primary p-4 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h1 className="text-center text-3xl font-semibold text-mainly mb-4">
          {isEditing ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 text-theme gap-4">
          <div>
            <input
              type="text"
              name="title"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Sarlavha"
              required
            />
            <input
              type="text"
              name="description"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="price"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Narxi"
              required
            />
            <input
              type="number"
              name="sale"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Sale"
              required
            />
            <input
              type="text"
              name="category"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Kategoriya"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="company"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Kompaniya"
              required
            />
            <input
              type="number"
              name="age"
              className={`border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition ease-in-out duration-200`}
              onChange={handleInputChange}
              placeholder="Age"
              required
            />

          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-mainText mb-1">
            Rasmni yuklash oldindan ko'rsatish:
          </label>
          <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-2 cursor-pointer hover:bg-gray-100 transition duration-200">
            <FaCloudUploadAlt className="text-4xl text-gray-500 mb-2" />
            <input
              type="file"
              name="photos"
              className="hidden"
              onChange={handleFileChange}
              required
            />
            <span className="text-gray-700">
              Yuklash uchun bosing yoki torting va tashlang
            </span>
          </label>
          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Tanlangan"
                className="w-full h-32 object-cover rounded mt-2"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                onClick={handleRemoveImage}
                title="Rasmni olib tashlash"
              >
                X
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-slate-800 w-full text-xl py-2 rounded-md text-white mt-4 hover:bg-slate-600 transition duration-200"
        >
          {isEditing ? "Yangilash" : "Yuborish"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="bg-red-500 w-full text-xl py-2 rounded-md text-white mt-2 hover:bg-red-400 transition duration-200"
        >
          Orqaga qaytish
        </button>
      </form>
    </section>
  );
};
