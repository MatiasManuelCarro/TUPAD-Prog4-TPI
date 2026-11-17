import { create } from "zustand";

type NotificationState = {
  message: string | null;
  show: boolean;
  showNotification: (message: string) => void;
  hideNotification: () => void;
};

export const useNotificationStore =
  create<NotificationState>((set) => ({
    message: null,
    show: false,

    showNotification: (message) =>
      set({
        message,
        show: true,
      }),

    hideNotification: () =>
      set({
        message: null,
        show: false,
      }),
  }));