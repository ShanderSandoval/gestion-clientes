import axios from "axios";

// Obtener la URL del backend
const getBackendUrl = () => {
  let host = window.location.hostname;
  return host === "localhost" ? "http://localhost:8080/cm-app/direcciones" : `http://${host}:8080/cm-app/direcciones`;
};

const API_URL = getBackendUrl();

// Obtener todas las direcciones de un cliente específico
export const getDireccionesByCliente = async (idCliente) => {
  const response = await axios.get(API_URL);
  return response.data.filter(dir => dir.idCliente === idCliente);
};

// Agregar una dirección
export const addDireccion = async (direccion) => {
  return await axios.post(API_URL, direccion);
};

// Eliminar una dirección
export const deleteDireccion = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
