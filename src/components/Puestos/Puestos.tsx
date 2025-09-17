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
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPuestos();
      setPuestos(data);
    } catch (error) {
      console.error("Error al cargar puestos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      setLoading(true);
      if (editId) {
        await updatePuesto(editId, { nombre });
        setEditId(null);
      } else {
        await createPuesto({ nombre });
      }
      setNombre("");
      await fetchData();
    } catch (error) {
      console.error("Error al guardar puesto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Puesto) => {
    setEditId(p.id);
    setNombre(p.nombre);
  };

  const handleCancel = () => {
    setEditId(null);
    setNombre("");
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm(id);
    // Auto-cancel after 3 seconds
    setTimeout(() => {
      setDeleteConfirm(null);
    }, 3000);
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      setLoading(true);
      await deletePuesto(id);
      setDeleteConfirm(null);
      await fetchData();
    } catch (error) {
      console.error("Error al eliminar puesto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        👥 Puestos de Trabajo
        {loading && <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '1rem' }}>Cargando...</span>}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Nombre del puesto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={loading}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={loading || !nombre.trim()}>
            {loading ? '⏳' : editId ? '✏️ Actualizar' : '➕ Crear'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} disabled={loading}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {puestos.length === 0 ? (
        <div className={styles.emptyState}>
          {loading ? 'Cargando puestos...' : 'No hay puestos registrados'}
        </div>
      ) : (
        <ul className={styles.list}>
          {puestos.map((p, index) => (
            <li 
              key={p.id} 
              className={styles.listItem}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.itemContent}>
                🎯 {p.nombre}
              </div>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleEdit(p)}
                  disabled={loading}
                  className={styles.editButton}
                >
                  ✏️ Editar
                </button>
                {deleteConfirm === p.id ? (
                  <button
                    onClick={() => handleDeleteConfirm(p.id)}
                    disabled={loading}
                    className={styles.deleteButton}
                    style={{ 
                      background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                      animation: 'pulse 1s infinite'
                    }}
                  >
                    ⚠️ Confirmar
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(p.id)}
                    disabled={loading}
                    className={styles.deleteButton}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}