import type { Puesto } from "../types";
import api from "./axiosClient";

const ENDPOINT = "/puestos";

export async function getPuestos(): Promise<Puesto[]> {
  try {
    const res = await api.get(ENDPOINT);
    console.log("Puestos API Response:", res.data); // Debug
    
    // Si la respuesta es un objeto con una propiedad 'data' (como Laravel Resources)
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    
    // Si la respuesta es directamente un array
    if (Array.isArray(res.data)) {
      return res.data;
    }
    
    // Si no es ninguno de los anteriores, log error y devolver array vacío
    console.error("Unexpected API response format for puestos:", res.data);
    return [];
    
  } catch (error) {
    console.error("Error fetching puestos:", error);
    throw error;
  }
}

export async function createPuesto(data: Omit<Puesto, "id">): Promise<Puesto> {
  try {
    const res = await api.post(ENDPOINT, data);
    
    // Manejar tanto respuestas directas como wrapped en 'data'
    return res.data.data ? res.data.data : res.data;
  } catch (error) {
    console.error("Error creating puesto:", error);
    throw error;
  }
}

export async function updatePuesto(id: number, data: Partial<Puesto>): Promise<Puesto> {
  try {
    const res = await api.put(`${ENDPOINT}/${id}`, data);
    
    // Manejar tanto respuestas directas como wrapped en 'data'
    return res.data.data ? res.data.data : res.data;
  } catch (error) {
    console.error("Error updating puesto:", error);
    throw error;
  }
}

export async function deletePuesto(id: number): Promise<void> {
  try {
    await api.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error("Error deleting puesto:", error);
    throw error;
  }
}