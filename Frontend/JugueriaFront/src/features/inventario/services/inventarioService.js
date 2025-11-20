import axios from "axios";

const API_URL = "http://localhost:8080/api/inventario";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Obtener stock actual por insumo
export const getStockPorInsumo = async () => {
  const response = await axios.get(`${API_URL}/stock`, authHeader());
  return response.data;
};

// Obtener valor total del inventario
export const getValorTotalInventario = async () => {
  const response = await axios.get(`${API_URL}/valor-total`, authHeader());
  return response.data;
};

// Obtener lista completa de insumos
export const getInsumos = async () => {
  const response = await axios.get(`${API_URL}`, authHeader());
  return response.data;
};

// Agregar un nuevo insumo
export const addInsumo = async (data) => {
  const response = await axios.post(`${API_URL}`, data, authHeader());
  return response.data;
};

// Modificar un insumo existente (por ID)
export const updateInsumo = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, authHeader());
  return response.data;
};

// Eliminar un insumo
export const deleteInsumo = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader());
  return response.data;
};
