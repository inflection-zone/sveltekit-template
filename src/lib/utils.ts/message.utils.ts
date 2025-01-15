import { addToast } from '$lib/components/toast/toast.store';

export const showMessage = (
    message: string,
    type: "success" | "error" | "info",
    dismissible = true,
    timeout = 3500) => {
    addToast({
        message: message,
        type: type,
        dismissible: dismissible,
        timeout: timeout
    });
}

export const show = (data) => {
    let messageType: "success" | "error" = null;
    let messageText = '';
    const flashMessage = data? data['flash'] : null;
    if (flashMessage) {
      messageType = flashMessage?.type;
      messageText = flashMessage?.message;
      console.log(`Layout svelte...${JSON.stringify(flashMessage, null, 2)}`);
      showMessage(messageText, messageType);
    }
};

export const successMessage = (message: string) => {
    const msg = {
        type: 'success' as "error" | "success",
        message: message as string,
    };
    return msg;
};

export const errorMessage = (message: string) => {
    const msg = {
        type: 'error' as "error" | "success",
        message: message as string,
    };
    return msg;
};
