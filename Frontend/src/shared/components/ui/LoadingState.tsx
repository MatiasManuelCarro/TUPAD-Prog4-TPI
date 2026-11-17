type LoadingStateProps = {
  message?: string;
};


export const LoadingState = ({
  message = "Cargando...",
}: LoadingStateProps) => {
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