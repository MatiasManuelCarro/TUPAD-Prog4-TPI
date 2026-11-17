import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "edit" | "danger" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-app-primary text-white hover:opacity-90",

    edit: "bg-app-edit text-white hover:opacity-90",

    danger: "bg-app-danger text-white hover:opacity-90",

    secondary:
        "border border-app-border bg-app-surface text-app-text hover:bg-app-background",
};

export const Button = ({
    children,
    variant = "primary",
    className = "",
    type = "button",
    ...props
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`
        cursor-pointer
        rounded-lg
        px-4
        py-2
        font-semibold
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantClasses[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};
