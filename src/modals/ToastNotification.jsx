import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return <ToastContainer />;
};

export const showToast = (message, type = "success") => {
  const options = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    theme: "colored",
  };

  if (type === "error") {
    toast.error(message, options);
  } else {
    toast.success(message, options);
  }
};


export default ToastNotification;
