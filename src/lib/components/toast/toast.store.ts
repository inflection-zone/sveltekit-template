import { writable } from "svelte/store";

export const toasts = writable([]);

export const addToast = (toast: { message?: string; type?: "info" | "error" | "success"; dismissible?: boolean; timeout: any; }) => {
  const id = Math.floor(Math.random() * 10000);
  const defaults = {
    id,
    type: "info",
    dismissible: true,
    timeout: 3000,
  };

  toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const dismissToast = (id) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
