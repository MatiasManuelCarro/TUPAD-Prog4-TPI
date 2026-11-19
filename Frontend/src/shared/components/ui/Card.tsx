import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({
  children,
  className = "",
}: CardProps) => {
  return (
    <div
      className={`
        rounded-xl
        border
        border-app-border
        bg-app-surface
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
};