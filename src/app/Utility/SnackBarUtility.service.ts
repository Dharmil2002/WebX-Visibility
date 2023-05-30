import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class SnackBarUtilityService {
  constructor(private snackBar: MatSnackBar) {}
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  getDiffDays(startDate, endDate) {
    return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
  }
  ShowCommonSwal(IconName, TitleMsg) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: IconName,
      title: TitleMsg,
    });
  }
  ShowCommonSwalSuccess(TitleMsg) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: TitleMsg,
    });
  }
  ShowCommonSwal1(
    IconName,
    TitleMsg,
    showConfirmButton,
    timerProgressBar,
    showCloseButton
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: showConfirmButton,
      timer: 3000,
      timerProgressBar: timerProgressBar,
      showCloseButton: showCloseButton,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: IconName,
      title: TitleMsg,
    });
  }

  commonToast(callback: any, title): void {
    Swal.fire({
      position: "top-end",
      icon: "success",
      toast: true,
      title: title,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
        callback();
      },
    });
  }
}
