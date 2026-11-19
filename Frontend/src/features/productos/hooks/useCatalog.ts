import { useQuery } from "@tanstack/react-query";

import { getCategorias } from "@/features/categorias";

import {
  getProducts,
  type ProductoFilters,
} from "../services/productService";

export const useCatalog = (
  filters: ProductoFilters,
) => {
  const productosQuery = useQuery({
    queryKey: [
      "productos",
      "catalogo",
      filters,
    ],
    queryFn: () => getProducts(filters),
  });

  const categoriasQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  return {
    productosQuery,
    categoriasQuery,
  };
};