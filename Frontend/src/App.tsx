import { useEffect } from "react";

import { useAuth } from "@/features/auth";
import { AppRouter } from "@/routes/AppRouter";
import { useThemeStore } from "@/shared/store/themeStore";

export const App = () => {
  const { checkSession } = useAuth();

  const darkMode = useThemeStore(
    (state) => state.darkMode,
  );

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode,
    );
  }, [darkMode]);

  return <AppRouter />;
};

export default App;