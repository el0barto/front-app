import type { Puesto } from "../types";
import api from "./axiosClient";

const ENDPOINT = "/puestos";

export async function getPuestos(): Promise<Puesto[]> {
  const res = await api.get(ENDPOINT);
  return res.data;
}

export async function createPuesto(data: Omit<Puesto, "id">): Promise<Puesto> {
  const res = await api.post(ENDPOINT, data);
  return res.data;
}

export async function updatePuesto(id: number, data: Partial<Puesto>): Promise<Puesto> {
  const res = await api.put(`${ENDPOINT}/${id}`, data);
  return res.data;
}

export async function deletePuesto(id: number): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
