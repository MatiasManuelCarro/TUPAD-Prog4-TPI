export type Categoria = {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
};

export type CategoriaCreate = {
  nombre: string;
  descripcion: string | null;
};

export type CategoriaUpdate = {
  nombre?: string;
  descripcion?: string | null;
};