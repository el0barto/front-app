import { useEffect, useState } from "react";
import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
} from "../api/departamentoService";
import type { Departamento } from "../types";

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [subcuenta, setSubcuenta] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchData = async () => {
    const data = await getDepartamentos();
    setDepartamentos(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateDepartamento(editId, { nombre, descripcion, subcuenta });
      setEditId(null);
    } else {
      await createDepartamento({ nombre, descripcion, subcuenta });
    }
    setNombre("");
    setDescripcion("");
    setSubcuenta("");
    fetchData();
  };

  return (
    <div>
      <h2>Departamentos</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          placeholder="Subcuenta"
          value={subcuenta}
          onChange={(e) => setSubcuenta(e.target.value)}
        />
        <button type="submit">
          {editId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <ul>
        {departamentos.map((d) => (
          <li key={d.id}>
            {d.nombre} - {d.subcuenta}{" "}
            <button
              onClick={() => {
                setEditId(d.id);
                setNombre(d.nombre);
                setDescripcion(d.descripcion ?? "");
                setSubcuenta(d.subcuenta);
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
