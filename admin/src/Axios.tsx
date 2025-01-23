import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("admin");

const instance = axios.create({
    baseURL: "https://server-playmarket-bo.onrender.com",
    headers: {
        Authorization: token,
    },
});

export default instance;
