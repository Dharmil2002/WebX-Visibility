import Swal from "sweetalert2";
export function SwalerrorMessage(icon,title,html,showConfirmButton){
    Swal.fire({
        icon:icon,
        title:title,
        html: html,
        showConfirmButton: showConfirmButton,
      })
}