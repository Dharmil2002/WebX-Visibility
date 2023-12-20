import Swal from "sweetalert2";

export async function showSuccessMessage(title: string) {
    await Swal.fire({
      title,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK',
    });
  }
  export async function  handleError(error: any, errorMessage: string) {
    console.error(`${errorMessage}:`, error);
    Swal.fire({
      title: 'Error',
      text: `An error occurred while updating shipment. Please try again.`,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }