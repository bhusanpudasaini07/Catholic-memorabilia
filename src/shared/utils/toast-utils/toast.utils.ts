import { toast, ToastPosition } from 'react-toastify'

export enum TOAST_TYPES {
  info,
  success,
  error,
  warning,
}

export const showToast = (type: TOAST_TYPES, message: string) => {
  const placement: ToastPosition = 'top-right'
  switch (type) {
    case TOAST_TYPES.info:
        toast.info(
          message = message,
          {
            position: placement,
          }
        )

      break;
    case TOAST_TYPES.error:
      toast.error(
        message = message,
      )
      break;
    case TOAST_TYPES.success:
      toast.success(
        message = message,
        
      )

      break;
    default:
      toast.success(
        message = message,
      )
  }
};
