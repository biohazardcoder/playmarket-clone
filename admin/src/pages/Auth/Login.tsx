import React, { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Axios from "../../Axios";

export const Login: React.FC = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { isAuth } = useSelector((state: { user: { isAuth: boolean } }) => state.user);

    if (isAuth) {
        window.location.href = "/";
    }

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data } = await Axios.post("admin/login", {
                password,
                phoneNumber: +phone,
            });

            Cookies.set("admin", data.token, { secure: true, expires: 7 });
            window.location.href = "/";
        } catch (err: any) {
            setError(err.response?.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="h-screen w-screen flex bg-theme items-center justify-center">
            <div className="bg-primary shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <h1 className="text-2xl text-mainly font-semibold text-accent tracking-wide hover:text-highlight transition-colors duration-300 ease-in-out">
                        Login as an Admin
                    </h1>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <div className="flex items-center  border border-mainText rounded-lg overflow-hidden">
                        <input
                            type="text"
                            className="p-3 outline-none w-full bg-secondary text-mainly   text-mainText "
                            placeholder="Enter Your Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            className="border  p-3 w-full rounded-lg bg-secondary  text-mainly  "
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? (
                                <EyeSlash size={24} color="#fff" />
                            ) : (
                                <Eye size={24} color="#fff" />
                            )}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        type="submit"
                        className={`bg-config py-2  rounded-lg font-semibold shadow-md  ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </section>
    );
};
