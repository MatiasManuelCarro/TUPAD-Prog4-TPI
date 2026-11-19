import type { Categoria } from "@/features/categorias";

export type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  categoria_id: number;
  activo: boolean;
  categoria: Categoria;
};

export type ProductoCreate = {
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  categoria_id: number;
};

export type ProductoUpdate = {
  nombre?: string;
  descripcion?: string | null;
  precio_base?: number;
  imagen_url?: string | null;
  stock?: number;
  disponible?: boolean;
  categoria_id?: number;
};

export type ProductoStockUpdate = {
  stock: number;
  disponible: boolean;
};

export type ProductoPaginatedResponse = {
  total: number;
  items: Producto[];
};