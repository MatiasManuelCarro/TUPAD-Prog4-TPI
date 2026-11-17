export { default as CategoriasPage } from "./pages/CategoriasPage";

export { CategoriaList } from "./components/CategoriaList";
export { CategoriaModal } from "./components/CategoriaModal";

export { useCategories } from "./hooks/useCategories";

export { getCategorias } from "./services/categoryService";

export type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "./types/categoria.types";