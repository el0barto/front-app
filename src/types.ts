export interface Departamento {
  id: number;
  nombre: string;
  descripcion?: string;
  subcuenta: string;
  created_at?: string;
  updated_at?: string;
}

export interface Puesto {
  id: number;
  nombre: string;
  departamento?: {
    id: number;
    nombre: string;
  created_at?: string;
  updated_at?: string;
   };
}
