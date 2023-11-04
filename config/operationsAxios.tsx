import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosOperations = axios.create({
  baseURL: "https://techhivebe.onrender.com",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
  timeout: 20000,
});

axiosOperations.interceptors.request.use(
  async (req) => {
    if (!req.auth) {
      const loggedData = await AsyncStorage.getItem("Authentication");
      if (loggedData) {
        const userData:any = await AsyncStorage.getItem("userdata");
        let data = await JSON.parse(userData);
        req.headers.token = loggedData
        req.headers.email = data.email
        req.headers.id = data.id
      }
    }
    return req;
  },
  (err) => Promise.reject(err)
);

axiosOperations.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);