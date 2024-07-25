import axios from "axios";
import { MAIN_API } from "../constants/path";

export const axiosInstance = axios.create({
  baseURL: MAIN_API,
});

const token = window.localStorage.getItem("token");

axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
