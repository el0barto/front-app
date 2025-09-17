import axios from "axios";
import type { Puesto } from "../types";

const API_URL = "http://127.0.0.1:8000/api/puestos";

export const getPuestos = async (): Promise<Puesto[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createPuesto = async (
  data: Omit<Puesto, "id" | "created_at" | "updated_at" | "deleted_at">
): Promise<Puesto> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updatePuesto = async (
  id: number,
  data: Partial<Puesto>
): Promise<Puesto> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};
