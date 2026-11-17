import { useEffect } from "react";

import { useNotificationStore } from "@/shared/store/notificationStore";

export const Toast = () => {
  const message = useNotificationStore((state) => state.message);

  const show = useNotificationStore((state) => state.show);

  const hideNotification = useNotificationStore(
    (state) => state.hideNotification
  );

  useEffect(() => {
    if (!show) {
      return;
    }

    const timer = window.setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [show, hideNotification]);

  if (!show || !message) {
    return null;
  }

  return (
    <div
      role="status"
      className="
        fixed
        right-6
        bottom-6
        z-50
        max-w-sm
        rounded-lg
        bg-app-primary
        px-5
        py-4
        font-semibold
        text-white
        shadow-lg
      "
    >
      {message}
    </div>
  );
};
