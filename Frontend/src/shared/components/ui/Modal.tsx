import type { ReactNode } from "react";

type ModalProps = {
    title: string;
    children: ReactNode;
    onClose: () => void;
};

export const Modal = ({
    title,
    children,
    onClose,
}: ModalProps) => {
    const handleOverlayClick = () => {
        onClose();
    };

    const handleModalClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        event.stopPropagation();
    };

    return (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
            onClick={handleOverlayClick}
        >
            <div
                className="
          w-full
          max-w-lg
          rounded-xl
          border
          border-app-border
          bg-app-surface
          p-6
          text-app-text
          shadow-xl
        "
                onClick={handleModalClick}
            >
                <div
                    className="
            mb-5
            flex
            items-center
            justify-between
            gap-4
          "
                >
                    <h2 className="text-xl font-bold">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="
              cursor-pointer
              rounded-lg
              px-2
              py-1
              text-xl
              font-semibold
              text-app-text
              transition
              hover:bg-app-background
            "
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
};