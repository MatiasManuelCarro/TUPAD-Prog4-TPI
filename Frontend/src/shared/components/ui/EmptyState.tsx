type EmptyStateProps = {
  message?: string;
};


export const EmptyState = ({
  message = "No hay datos para mostrar.",
}: EmptyStateProps) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-app-border
        bg-app-surface
        p-6
        text-center
        text-app-text
      "
    >
      {message}
    </div>
  );
};