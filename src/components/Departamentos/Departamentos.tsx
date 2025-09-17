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
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !subcuenta.trim()) return;

    try {
      setLoading(true);
      if (editId) {
        await updateDepartamento(editId, { nombre, descripcion, subcuenta });
        setEditId(null);
      } else {
        await createDepartamento({ nombre, descripcion, subcuenta });
      }
      setNombre("");
      setDescripcion("");
      setSubcuenta("");
      await fetchData();
    } catch (error) {
      console.error("Error al guardar departamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (d: Departamento) => {
    setEditId(d.id);
    setNombre(d.nombre);
    setDescripcion(d.descripcion ?? "");
    setSubcuenta(d.subcuenta);
  };

  const handleCancel = () => {
    setEditId(null);
    setNombre("");
    setDescripcion("");
    setSubcuenta("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        🏢 Departamentos
        {loading && <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '1rem' }}>Cargando...</span>}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Nombre del departamento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={loading}
        />
        <input
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Subcuenta"
          value={subcuenta}
          onChange={(e) => setSubcuenta(e.target.value)}
          required
          disabled={loading}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={loading || !nombre.trim() || !subcuenta.trim()}>
            {loading ? '⏳' : editId ? '✏️ Actualizar' : '➕ Crear'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} disabled={loading}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {departamentos.length === 0 ? (
        <div className={styles.emptyState}>
          {loading ? 'Cargando departamentos...' : 'No hay departamentos registrados'}
        </div>
      ) : (
        <ul className={styles.list}>
          {departamentos.map((d, index) => (
            <li 
              key={d.id} 
              className={styles.listItem}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div>
                <div className={styles.itemContent}>
                  📂 {d.nombre}
                </div>
                <div className={styles.itemMeta}>
                  {d.descripcion && `${d.descripcion} • `}
                  Subcuenta: {d.subcuenta}
                </div>
              </div>
              <button
                onClick={() => handleEdit(d)}
                disabled={loading}
                className={styles.editButton}
              >
                ✏️ Editar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}