import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  LoginPage,
  RegisterPage,
} from "@/features/auth";

import { CategoriasPage } from "@/features/categorias";

import {
  AdminPedidosPage,
  AdminResumenPage,
  CarritoPage,
  CheckoutPage,
  MisPedidosPage,
} from "@/features/pedidos";

import {
  CatalogPage,
  ProductsPage,
} from "@/features/productos";

import { AdminUsuariosPage } from "@/features/usuarios";

import { MainLayout } from "@/shared/layout/MainLayout";
import { Toast } from "@/shared/components/Toast";
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage";

import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>

      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/"
          element={<CatalogPage />}
        />

        <Route
          path="/carrito"
          element={<CarritoPage />}
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/mis-pedidos"
            element={<MisPedidosPage />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >
          <Route
            path="/admin/resumen"
            element={<AdminResumenPage />}
          />

          <Route
            path="/admin/categorias"
            element={<CategoriasPage />}
          />

          <Route
            path="/admin/productos"
            element={<ProductsPage />}
          />

          <Route
            path="/admin/pedidos"
            element={<AdminPedidosPage />}
          />

          <Route
            path="/admin/usuarios"
            element={<AdminUsuariosPage />}
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
      </MainLayout>
      <Toast />

    </BrowserRouter>
  );
};