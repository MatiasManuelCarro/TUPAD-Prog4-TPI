import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Producto } from "@/features/products";

export type CartItem = {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
};

type CartState = {
  items: CartItem[];
  total: number;

  agregar: (producto: Producto) => void;

  quitar: (productoId: number) => void;

  cambiarCantidad: (
    productoId: number,
    cantidad: number,
  ) => void;

  vaciar: () => void;
};

const calcularTotal = (
  items: CartItem[],
): number => {
  return items.reduce(
    (acumulador, item) =>
      acumulador +
      item.precio_unitario * item.cantidad,
    0,
  );
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,

      agregar: (producto) =>
        set((state) => {
          const itemExistente = state.items.find(
            (item) =>
              item.producto_id === producto.id,
          );

          const items = itemExistente
            ? state.items.map((item) =>
                item.producto_id === producto.id
                  ? {
                      ...item,
                      cantidad: item.cantidad + 1,
                    }
                  : item,
              )
            : [
                ...state.items,
                {
                  producto_id: producto.id,
                  nombre: producto.nombre,
                  precio_unitario:
                    producto.precio_base,
                  cantidad: 1,
                },
              ];

          return {
            items,
            total: calcularTotal(items),
          };
        }),

      quitar: (productoId) =>
        set((state) => {
          const items = state.items.filter(
            (item) =>
              item.producto_id !== productoId,
          );

          return {
            items,
            total: calcularTotal(items),
          };
        }),

      cambiarCantidad: (
        productoId,
        cantidad,
      ) =>
        set((state) => {
          const nuevaCantidad = Math.max(
            cantidad,
            1,
          );

          const items = state.items.map(
            (item) =>
              item.producto_id === productoId
                ? {
                    ...item,
                    cantidad: nuevaCantidad,
                  }
                : item,
          );

          return {
            items,
            total: calcularTotal(items),
          };
        }),

      vaciar: () =>
        set({
          items: [],
          total: 0,
        }),
    }),
    {
      name: "food-store-cart-v2",
    },
  ),
);