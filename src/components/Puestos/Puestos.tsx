import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPuestos,
  createPuesto,
  updatePuesto,
  deletePuesto,
} from "../../api/puestoService";
import type { Puesto } from "../../types";
import styles from "./Puestos.module.css";

export default function Puestos() {
  const queryClient = useQueryClient();

  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [departamentoId, setDepartamentoId] = useState<number | undefined>(undefined);


  // --- GET con cacheo por 1 minuto ---
  const { data: puestos = [], isLoading } = useQuery<Puesto[]>({
    queryKey: ["puestos"],
    queryFn: getPuestos,
    staleTime: 60_000, // 1 minuto
    refetchOnWindowFocus: false, // evita refetch al volver a la pestaña
  });

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createPuesto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Puesto> }) =>
      updatePuesto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePuesto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
    },
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!nombre.trim() || !departamentoId) return;

  const data = { nombre, departamento_id: departamentoId };

  if (editId) {
    updateMutation.mutate({ id: editId, data });
    setEditId(null);
  } else {
    createMutation.mutate(data);
  }

  setNombre("");
  setDepartamentoId(undefined);
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
    // Cancelar si no confirma en 3 segundos
    setTimeout(() => {
      setDeleteConfirm(null);
    }, 3000);
  };

  const handleDeleteConfirm = (id: number) => {
    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeleteConfirm(null);
      },
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        👥 Puestos de Trabajo
        {(isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) && (
          <span style={{ fontSize: "0.8rem", opacity: 0.7, marginLeft: "1rem" }}>
            Cargando...
          </span>
        )}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Nombre del puesto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={isLoading}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            disabled={!nombre.trim() || createMutation.isPending || updateMutation.isPending}
          >
            {editId ? "✏️ Actualizar" : "➕ Crear"}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {puestos.length === 0 ? (
        <div className={styles.emptyState}>
          {isLoading ? "Cargando puestos..." : "No hay puestos registrados"}
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
                <br />
                🏢 <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  {p.departamento?.nombre ?? "Sin departamento"}
                </span>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleEdit(p)}
                  disabled={updateMutation.isPending}
                  className={styles.editButton}
                >
                  ✏️ Editar
                </button>
                {deleteConfirm === p.id ? (
                  <button
                    onClick={() => handleDeleteConfirm(p.id)}
                    disabled={deleteMutation.isPending}
                    className={styles.deleteButton}
                    style={{
                      background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
                      animation: "pulse 1s infinite",
                    }}
                  >
                    ⚠️ Confirmar
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(p.id)}
                    disabled={deleteMutation.isPending}
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
