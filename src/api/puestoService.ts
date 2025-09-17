import axios from "axios";
import type { Puesto } from "../types";

const API_URL = "http://localhost:8000/api/puestos"; // cambia a tu backend

export async function getPuestos(): Promise<Puesto[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function createPuesto(puesto: Omit<Puesto, "id">): Promise<Puesto> {
  const res = await axios.post(API_URL, puesto);
  return res.data;
}

export async function updatePuesto(
  id: number,
  puesto: Partial<Puesto>
): Promise<Puesto> {
  const res = await axios.put(`${API_URL}/${id}`, puesto);
  return res.data;
}

export async function deletePuesto(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
