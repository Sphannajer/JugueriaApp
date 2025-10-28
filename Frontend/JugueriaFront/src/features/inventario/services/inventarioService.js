import axios from "axios";

const API_URL = "http://localhost:8080/api/inventario";


const getToken = () => localStorage.getItem("token");


const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});


export const getInventarioStock = async () => {
  const response = await axios.get(`${API_URL}/stock`, authHeader());
  return response.data;
};


export const getInventarioTotal = async () => {
  const response = await axios.get(`${API_URL}/total`, authHeader());
  return response.data;
};


export const getMovimientos = async () => {
  const response = await axios.get(`${API_URL}/movimientos`, authHeader());
  return response.data;
};


export const addInsumo = async (data) => {
  const response = await axios.post(`${API_URL}/agregar`, data, authHeader());
  return response.data;
};


export const updateInsumo = async (id, nuevoStock) => {
  const response = await axios.put(`${API_URL}/modificar-stock/${id}?nuevoStock=${nuevoStock}`, {}, authHeader());
  return response.data;
};


export const deleteInsumo = async (id) => {
  const response = await axios.delete(`${API_URL}/eliminar/${id}`, authHeader());
  return response.data;
};
