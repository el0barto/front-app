import axios from "axios";
import type { Departamento } from "../types";

const API_URL = "http://localhost:8000/api/departamentos";

export async function getDepartamentos(): Promise<Departamento[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function createDepartamento(data: Omit<Departamento, "id">): Promise<Departamento> {
  const res = await axios.post(API_URL, data);
  return res.data;
}

export async function updateDepartamento(id: number, data: Partial<Departamento>): Promise<Departamento> {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteDepartamento(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
