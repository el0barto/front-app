import { useEffect, useState } from "react";
import {
  getPuestos,
  createPuesto,
  updatePuesto,
  deletePuesto,
} from "../../api/puestoService";
import type { Puesto } from "../../types";
import styles from "./Puestos.module.css";

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

  const handleDelete = async (id: number) => {
    await deletePuesto(id);
    fetchData();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Puestos</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Nombre del puesto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      <ul className={styles.list}>
        {puestos.map((p) => (
          <li key={p.id} className={styles.listItem}>
            {p.nombre}
            <div>
              <button
                onClick={() => {
                  setEditId(p.id);
                  setNombre(p.nombre);
                }}
              >
                Editar
              </button>
              <button onClick={() => handleDelete(p.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
