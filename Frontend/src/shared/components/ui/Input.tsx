import type {
  InputHTMLAttributes,
} from "react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  className = "",
  ...props
}: InputProps) => {
  return (
    <input
      {...props}
      className={`
        w-full
        rounded-lg
        border
        border-app-border
        bg-app-background
        p-2
        text-app-text
        ${className}
      `}
    />
  );
};