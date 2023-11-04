import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosLogin = axios.create({
    baseURL: "https://techhivebe.onrender.com",
    headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Accept": "application/json",
  },
  timeout: 20000,
});

axiosLogin.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

axiosLogin.interceptors.response.use(
  (res) => {
    console.log(res.headers.authentication)
    AsyncStorage.setItem("Authentication", res.headers.authentication);
    return res;
  },
  (err) => Promise.reject(err)
);