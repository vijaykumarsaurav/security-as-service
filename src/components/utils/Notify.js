import { toast } from 'react-toastify';

class Notify {

    showError(msg) {
        toast.error(msg, this.options());
    }

    showSuccess(msg) {
        console.log(msg); 
        toast.success(msg , this.options());
    }

    showWarning(msg) {
        toast.warn(msg , this.options());
    }

    options() {
        return {
            position: "top-right",
            autoClose: 1 * 30000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        }
    }

}

export default new Notify();