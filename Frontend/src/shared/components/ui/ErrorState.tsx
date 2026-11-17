type ErrorStateProps = {
  message?: string;
};


export const ErrorState = ({
  message = "Ocurrió un error.",
}: ErrorStateProps) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-app-danger
        bg-app-surface
        p-6
        text-center
        text-app-danger
      "
    >
      {message}
    </div>
  );
};