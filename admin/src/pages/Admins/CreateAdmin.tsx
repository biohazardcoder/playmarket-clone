import { useState } from "react";
import Axios from "../../Axios";
import { toast, ToastContainer } from "react-toastify";

export const CreateAdmin = () => {

  const [createAdminData, setcreateAdminData] = useState({
    phoneNumber: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setcreateAdminData((adminData: any) => ({ ...adminData, [name]: value }));
  };



  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/admin/create", {
        phoneNumber: createAdminData.phoneNumber,
        password: createAdminData.password,
        firstName: createAdminData.firstName,
        lastName: createAdminData.lastName,
      });
      toast.success("Admin Added!")
      setTimeout(() => {
        window.location.href = "/admins";
      }, 1000);
      console.log(response);

    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };
  const FormInput = "border border-gray-300 rounded-md p-2 w-full"
  return (
    <section className="bg-theme  flex flex-col justify-center items-center col-span-12 row-span-10 md:col-span-10 md:row-span-11  p-4">
      <ToastContainer />
      <form
        onSubmit={handleFormSubmit}
        className="w-full  max-w-md bg-primary p-8 rounded-lg shadow-lg flex flex-col gap-6"
      >
        <h1 className="text-center text-2xl font-bold text-mainly">Create New Admin:</h1>
        <input
          type="text"
          name="firstName"
          className={FormInput}
          onChange={handleInputChange}
          placeholder="Firstname"
        />
        <input
          type="text"
          name="lastName"
          className={FormInput}
          onChange={handleInputChange}
          placeholder="Lastname"
        />
        <input
          type="number"
          name="phoneNumber"
          className={FormInput}
          onChange={handleInputChange}
          placeholder="Phone number"
        />
        <input
          type="text"
          name="password"
          className={FormInput}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <button
          type="submit"
          className="bg-config text-theme w-full text-xl py-2 rounded-md "
        >
          Yaratish
        </button>
      </form>
    </section>
  );
};
