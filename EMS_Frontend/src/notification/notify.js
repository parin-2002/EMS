import { toast } from "react-toastify";

const notifySuccess = (msg) => toast.success(msg);
const notifyError = (msg) => toast.error(msg);
const notifyWarn = (msg) => toast.warn(msg);
const notifyInfo = (msg) => toast.info(msg);

export { notifyError, notifyWarn, notifySuccess, notifyInfo };
