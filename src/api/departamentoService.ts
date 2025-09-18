import type { Departamento } from "../types";
import api from "./axiosClient";

const ENDPOINT = "/departamentos"; 

export async function getDepartamentos(): Promise<Departamento[]> {
  try {
    const res = await api.get(ENDPOINT);
    console.log("API Response:", res.data); // Debug
    
    // Si la respuesta es un objeto con una propiedad 'data' (como Laravel Resources)
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    
    // Si la respuesta es directamente un array
    if (Array.isArray(res.data)) {
      return res.data;
    }
    
    // Si no es ninguno de los anteriores, log error y devolver array vacío
    console.error("Unexpected API response format:", res.data);
    return [];
    
  } catch (error) {
    console.error("Error fetching departamentos:", error);
    throw error;
  }
}

export async function createDepartamento(data: Omit<Departamento, "id">): Promise<Departamento> {
  try {
    const res = await api.post(ENDPOINT, data);
    
    // Manejar tanto respuestas directas como wrapped en 'data'
    return res.data.data ? res.data.data : res.data;
  } catch (error) {
    console.error("Error creating departamento:", error);
    throw error;
  }
}

export async function updateDepartamento(id: number, data: Partial<Departamento>): Promise<Departamento> {
  try {
    const res = await api.put(`${ENDPOINT}/${id}`, data);
    
    // Manejar tanto respuestas directas como wrapped en 'data'
    return res.data.data ? res.data.data : res.data;
  } catch (error) {
    console.error("Error updating departamento:", error);
    throw error;
  }
}

export async function deleteDepartamento(id: number): Promise<void> {
  try {
    await api.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error("Error deleting departamento:", error);
    throw error;
  }
}