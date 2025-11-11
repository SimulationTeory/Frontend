import axios from "axios";


const API_URL = "http://localhost:8000/api/simulacion";

export const correrSimulacion = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error al ejecutar la simulación:", error);
        throw error;
    }
};
