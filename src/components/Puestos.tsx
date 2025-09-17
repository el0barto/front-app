import { useEffect, useState } from "react";
import {
  getPuestos,
  createPuesto,
  updatePuesto,
} from "../api/puestoService";
import type { Puesto } from "../types";

export default function Puestos() {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchData = async () => {
    const data = await getPuestos();
    setPuestos(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updatePuesto(editId, { nombre });
      setEditId(null);
    } else {
      await createPuesto({ nombre });
    }
    setNombre("");
    fetchData();
  };

  return (
    <div>
      <h2>Puestos</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      <ul>
        {puestos.map((p) => (
          <li key={p.id}>
            {p.nombre}{" "}
            <button
              onClick={() => {
                setEditId(p.id);
                setNombre(p.nombre);
              }}
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
