import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Producto } from "@/features/products";

export type CartItem = {
  producto: Producto;
  cantidad: number;
};

type CartState = {
  items: CartItem[];

  addItem: (producto: Producto) => void;

  removeItem: (productoId: number) => void;

  updateQuantity: (
    productoId: number,
    cantidad: number,
  ) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (producto) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.producto.id === producto.id,
          );

          if (existingItem) {
            if (
              existingItem.cantidad >=
              producto.stock
            ) {
              return state;
            }

            return {
              items: state.items.map((item) =>
                item.producto.id ===
                producto.id
                  ? {
                      ...item,
                      cantidad:
                        item.cantidad + 1,
                    }
                  : item,
              ),
            };
          }

          if (
            producto.stock <= 0 ||
            !producto.disponible
          ) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                producto,
                cantidad: 1,
              },
            ],
          };
        }),

      removeItem: (productoId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.producto.id !==
              productoId,
          ),
        })),

      updateQuantity: (
        productoId,
        cantidad,
      ) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.producto.id !==
              productoId
            ) {
              return item;
            }

            const nuevaCantidad = Math.min(
              Math.max(cantidad, 1),
              item.producto.stock,
            );

            return {
              ...item,
              cantidad: nuevaCantidad,
            };
          }),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "food-store-cart",
    },
  ),
);