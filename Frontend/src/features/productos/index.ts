export { default as CatalogPage } from "./pages/CatalogPage";
export { default as ProductsPage } from "./pages/ProductsPage";

export { ProductoCard } from "./components/ProductoCard";
export { ProductoList } from "./components/ProductoList";
export { ProductoModal } from "./components/ProductoModal";
export { StockModal } from "./components/StockModal";

export { useCatalog } from "./hooks/useCatalog";
export { useProducts } from "./hooks/useProducts";

export type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  ProductoStockUpdate,
  ProductoPaginatedResponse,
} from "./types/producto.types";