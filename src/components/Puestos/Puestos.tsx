import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPuestos,
  createPuesto,
  updatePuesto,
  deletePuesto,
} from "../../api/puestoService";
import { getDepartamentos } from "../../api/departamentoService";
import type { Puesto, Departamento } from "../../types";
import styles from "./Puestos.module.css";

export default function Puestos() {
  const queryClient = useQueryClient();

  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [departamentoId, setDepartamentoId] = useState<number | undefined>(undefined);

  // ✅ Query para puestos con cacheo
  const { data: puestos = [], isLoading } = useQuery<Puesto[]>({
    queryKey: ["puestos"],
    queryFn: getPuestos,
    staleTime: 60_000, // 1 minuto
    refetchOnWindowFocus: false,
  });

  // ✅ Query para departamentos (para el select)
  const { data: departamentos = [] } = useQuery<Departamento[]>({
    queryKey: ["departamentos"],
    queryFn: getDepartamentos,
    staleTime: 60_000,
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
    setDepartamentoId(p.departamento_id);
  };

  const handleCancel = () => {
    setEditId(null);
    setNombre("");
    setDepartamentoId(undefined);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm(id);
    setTimeout(() => setDeleteConfirm(null), 3000);
  };

  const handleDeleteConfirm = (id: number) => {
    deleteMutation.mutate(id);
    setDeleteConfirm(null);
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
        <select
          value={departamentoId || ""}
          onChange={(e) => setDepartamentoId(Number(e.target.value) || undefined)}
          required
          disabled={isLoading}
          style={{
            padding: "0.75rem 1rem",
            border: "2px solid var(--border-color)",
            borderRadius: "12px",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontSize: "1rem",
            minWidth: "200px",
          }}
        >
          <option value="">Selecciona departamento</option>
          {departamentos.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.nombre}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            disabled={!nombre.trim() || !departamentoId || createMutation.isPending || updateMutation.isPending}
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