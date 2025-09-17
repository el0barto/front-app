import type { Departamento } from "../types";
import api from "./axiosClient";

const ENDPOINT = "/departamentos"; 

export async function getDepartamentos(): Promise<Departamento[]> {
  const res = await api.get(ENDPOINT);
  return res.data;
}

export async function createDepartamento(data: Omit<Departamento, "id">): Promise<Departamento> {
  const res = await api.post(ENDPOINT, data);
  return res.data;
}

export async function updateDepartamento(id: number, data: Partial<Departamento>): Promise<Departamento> {
  const res = await api.put(`${ENDPOINT}/${id}`, data);
  return res.data;
}

export async function deleteDepartamento(id: number): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
