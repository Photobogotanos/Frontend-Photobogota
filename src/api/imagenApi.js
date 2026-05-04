import { clienteApi } from "./axiosConfig";

export const postSubirImagenSpot = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return clienteApi.post("/imagenes/spot", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
};

export const postSubirAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return clienteApi.post("/imagenes/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
};