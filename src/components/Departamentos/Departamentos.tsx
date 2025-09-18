import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
} from "../../api/departamentoService";
import type { Departamento } from "../../types";
import styles from "./Departamentos.module.css";

export default function Departamentos() {
  const queryClient = useQueryClient();

  // Form state
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [subcuenta, setSubcuenta] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ✅ Query con caché de 1 minuto agregado + debugging
  const { data: departamentos = [], isLoading, error } = useQuery<Departamento[]>({
    queryKey: ["departamentos"],
    queryFn: getDepartamentos,
    staleTime: 60_000, // 1 minuto de caché
    refetchOnWindowFocus: false, // evita refetch al volver a la pestaña
  });

  // 🐛 Debug: verificar qué está devolviendo la API
  console.log("Departamentos data:", departamentos);
  console.log("Is array?", Array.isArray(departamentos));
  console.log("Error:", error);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Departamento> }) =>
      updateDepartamento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
    },
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !subcuenta.trim()) return;

    if (editId) {
      updateMutation.mutate({ id: editId, data: { nombre, descripcion, subcuenta } });
      setEditId(null);
    } else {
      createMutation.mutate({ nombre, descripcion, subcuenta });
    }

    setNombre("");
    setDescripcion("");
    setSubcuenta("");
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

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm(id);
    setTimeout(() => setDeleteConfirm(null), 3000); // auto-cancel
  };

  const handleDeleteConfirm = (id: number) => {
    deleteMutation.mutate(id);
    setDeleteConfirm(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        🏢 Departamentos
        {(isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) && (
          <span style={{ fontSize: "0.8rem", opacity: 0.7, marginLeft: "1rem" }}>
            Cargando...
          </span>
        )}
      </h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Nombre del departamento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={isLoading}
        />
        <input
          placeholder="Subcuenta"
          value={subcuenta}
          onChange={(e) => setSubcuenta(e.target.value)}
          required
          disabled={isLoading}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" disabled={isLoading || !nombre.trim() || !subcuenta.trim()}>
            {editId ? "✏️ Actualizar" : "➕ Crear"}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} disabled={isLoading}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista */}
      {!Array.isArray(departamentos) ? (
        <div className={styles.emptyState}>
          Error: La respuesta de la API no es válida. Revisa la consola.
        </div>
      ) : departamentos.length === 0 ? (
        <div className={styles.emptyState}>
          {isLoading ? "Cargando departamentos..." : "No hay departamentos registrados"}
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
                <div className={styles.itemContent}>📂 {d.nombre}</div>
                <div className={styles.itemMeta}>
                  {d.descripcion && `${d.descripcion} • `}
                  Subcuenta: {d.subcuenta}
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleEdit(d)}
                  disabled={isLoading}
                  className={styles.editButton}
                >
                  ✏️ Editar
                </button>
                {deleteConfirm === d.id ? (
                  <button
                    onClick={() => handleDeleteConfirm(d.id)}
                    disabled={isLoading}
                    className={styles.deleteButton}
                  >
                    ⚠️ Confirmar
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(d.id)}
                    disabled={isLoading}
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