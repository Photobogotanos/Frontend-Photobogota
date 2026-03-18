import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const clienteApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});