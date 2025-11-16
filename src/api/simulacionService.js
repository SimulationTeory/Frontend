import axios from "axios";

const API_URL = "http://localhost:8000/api/";

// Ejecutar simulación
export const correrSimulacion = async (data) => {
  try {
    const response = await axios.post(`${API_URL}simulacion`, data);
    return response.data;
  } catch (error) {
    console.error("Error al ejecutar la simulación:", error);
    throw error;
  }
};

// Guardar simulación
export const saveSimulacion = async (simulacionData) => {
  try {
    const response = await axios.post(`${API_URL}save`, simulacionData);
    return response.data;
  } catch (error) {
    console.error("Error al guardar la simulación:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener todas las simulaciones guardadas
export const getSimulaciones = async () => {
  try {
    const response = await axios.post(`${API_URL}comparar/getSimulaciones`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las simulaciones:", error);
    throw error;
  }
};

// Obtener los datos de dos simulaciones para comparar
export const dataSimulaciones = async (id_s1, id_s2) => {
  try {

    const response = await axios.post(`${API_URL}comparar/dataSimulaciones`, null, {
      params: { id_s1, id_s2 },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos de simulaciones:", error);
    throw error;
  }
};
