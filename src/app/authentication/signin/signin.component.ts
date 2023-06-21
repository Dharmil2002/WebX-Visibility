import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/service/auth.service";
import { MainMenu } from "./../../Models/Menu/MenuModel";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  loginForm: UntypedFormGroup;
  submitted = false;
  MenuDetails: any;
  error = "";
  IsRegister = true;
  Menudetailarray: any;
  CompanyLogo;
  hide = true;
  Menulist: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
  ) {
    super();
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      companyCode: ['', Validators.required],
      Username: [
        "",
        [Validators.required],
      ],
      Branch: ["", Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  CompanyDataSet() {
    // this.CompanyLogo = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   "data:image/png;base64," + localStorage.getItem("company_Logo")
    // );
  }

  onSubmit() {
    localStorage.setItem("companyCode", this.loginForm.value.companyCode)
    localStorage.setItem("Username", this.loginForm.value.Username);
    localStorage.setItem("Branch", this.loginForm.value.Branch);
    this.router.navigate(["/dashboard/DocketDashboard"]);
  }
}
