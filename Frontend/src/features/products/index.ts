export { default as ProductsPage } from "./pages/ProductsPage";

export { ProductoList } from "./components/ProductoList";
export { ProductoModal } from "./components/ProductoModal";

export { useProducts } from "./hooks/useProducts";

export type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  ProductoStockUpdate,
  ProductoPaginatedResponse,
} from "./types/producto.types";