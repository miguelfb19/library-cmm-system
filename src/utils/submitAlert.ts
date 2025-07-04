import Swal from "sweetalert2";

type SweetAlertIcon = "success" | "error" | "warning" | "info" | "question";

interface AlertOptions {
  html?: string;
  text?: string | undefined;
  title: string;
  icon: SweetAlertIcon;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const submitAlert = (options: AlertOptions) => {
  const Toast = Swal.mixin({
    showConfirmButton: true,
    confirmButtonColor: "#0050b3",
    confirmButtonText: options.confirmButtonText ?? "Aceptar",
    cancelButtonText: options.cancelButtonText ?? "Cancelar",
    cancelButtonColor: "#fb2c36",
    showCancelButton: options.showCancelButton ?? false,
    showCloseButton: true,
    html: options.html,
    text: options.text,
  });

  return Toast.fire({
    ...options,
  });
};
