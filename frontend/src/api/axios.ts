import axios from "axios";
import { API_URL } from "../lib/constants";

const api = axios.create({
  baseURL: API_URL,
});

const apiPrivate = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export { api, apiPrivate };
