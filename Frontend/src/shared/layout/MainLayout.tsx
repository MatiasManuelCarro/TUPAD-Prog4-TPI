import type { ReactNode } from "react";
import { Navbar } from "./Navbar";



type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({
  children,
}: MainLayoutProps) => {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
};