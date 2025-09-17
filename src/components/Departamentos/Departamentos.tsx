import { useEffect, useState } from "react";
import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
} from "../../api/departamentoService";
import type { Departamento } from "../../types";
import styles from "./Departamentos.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>Departamentos</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      <ul className={styles.list}>
        {departamentos.map((d) => (
          <li key={d.id} className={styles.listItem}>
            {d.nombre} - {d.subcuenta}
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
