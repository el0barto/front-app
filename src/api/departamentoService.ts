import axios from "axios";
import type { Departamento } from "../types";

const API_URL = "http://127.0.0.1:8000/api/departamentos";

export const getDepartamentos = async (): Promise<Departamento[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createDepartamento = async (
  data: Omit<Departamento, "id" | "created_at" | "updated_at">
): Promise<Departamento> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateDepartamento = async (
  id: number,
  data: Partial<Departamento>
): Promise<Departamento> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};
