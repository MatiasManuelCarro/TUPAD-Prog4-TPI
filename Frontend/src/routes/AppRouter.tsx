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

import { CatalogPage } from "@/features/products";

import { Navbar } from "@/shared/components/Navbar";
import { Toast } from "@/shared/components/Toast";
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<CatalogPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

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

      <Toast />
    </BrowserRouter>
  );
};