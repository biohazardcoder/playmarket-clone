import React, { useState } from "react";
import Axios from "../../Axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export const AddProduct: React.FC = () => {
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    category: "",
    company: "",
    traler: "",
    sale: 0,
    photos: [],
    file: "",
    like: 0,
    download: 0,
    age: 0,
    description: "",
    comments: [],
    device: "windows",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [filePreview, setFilePreview] = useState("");

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

      formImageData.append("file", files[0]);

      const { data } = await Axios.post("/upload", formImageData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProductData((prevData: any) => ({
        ...prevData,
        photos: [...prevData.photos, ...data.photos],
        file: data.file || "",
      }));

      setImagePreview(data.photos[0]);
      setFilePreview(data.file);
    } catch (err) {
      console.log("Fayl yuklashda xatolik:", err);
    }
  };




  const handleFileUpload = async (e: any) => {
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const { data } = await Axios.post("upload", formData);
      setProductData((prevData) => ({
        ...prevData,
        file: data.file,
      }));
      setFilePreview(data.file);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setProductData((prevData) => ({ ...prevData, photos: [] }));
  };

  const handleRemoveFile = () => {
    setFilePreview("");
    setProductData((prevData) => ({ ...prevData, file: "" }));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await Axios.post("/product/create", productData);
      toast.success("Yangi mahsulot qo'shildi!");
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
          Yangi Mahsulot Qo'shish
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 text-theme gap-4">
          <div>
            <input
              type="text"
              name="title"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Sarlavha"
              required
            />
            <input
              type="text"
              name="description"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="price"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Narxi"
              required
            />
            <input
              type="number"
              name="sale"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Sale"
              required
            />
            <input
              type="text"
              name="category"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Kategoriya"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="company"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Kompaniya"
              required
            />
            <input
              type="text"
              name="trailer"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Trailer"
              required
            />
            <input
              type="number"
              name="age"
              className="border border-gray-300 rounded-md p-2 w-full mt-2"
              onChange={handleInputChange}
              placeholder="Age"
              required
            />
          </div>
        </div>
        <div className="text-mainly">
          <h1>
            Device
          </h1>
          <select name="device" className="border p-2 rounded-md text-theme" onChange={handleInputChange}>
            <option value="windows">windows</option>
            <option value="phone">phone</option>
            <option value="tablet">tablet</option>
            <option value="tv">tv</option>
            <option value="chromebook">chromebook</option>
            <option value="watch">watch</option>
          </select>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-mainText mb-1">
            Rasmni yuklash:
          </label>
          <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-2 cursor-pointer">
            <FaCloudUploadAlt className="text-4xl text-gray-500 mb-2" />
            <input
              type="file"
              name="photos"
              className="hidden"
              onChange={handleFileChange}
            />
            <span>Yuklash uchun bosing</span>
          </label>
          {imagePreview && (
            <div className="relative mt-2">
              <img src={imagePreview} alt="Tanlangan" className="w-full h-32" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white p-1"
                onClick={handleRemoveImage}
              >
                X
              </button>
            </div>
          )}
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-mainText mb-1">
            Fayl yuklash:
          </label>
          <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-2 cursor-pointer">
            <FaCloudUploadAlt className="text-4xl text-gray-500 mb-2" />
            <input
              type="file"
              name="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span>Fayl yuklash uchun bosing</span>
          </label>
          {filePreview && (
            <div className="relative mt-2">
              <p>{filePreview}</p>
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white p-1"
                onClick={handleRemoveFile}
              >
                X
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="bg-slate-800 w-full text-xl py-2">
          Yuborish
        </button>
      </form>
    </section>
  );
};
