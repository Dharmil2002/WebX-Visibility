import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/service/auth.service";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  loginForm: UntypedFormGroup;
  submitted = false;
  MenuDetails: any;
  error = "";
  Islogin = false;
  IsRegister = true;
  Menudetailarray: any;
  CompanyLogo;
  hide = true;
  Menulist: any;
  logingLogo: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private storageService: StorageService
  ) {
    super();
  }
  ngOnInit() {
    this.logingLogo="https://webxblob.blob.core.windows.net/newtms/logo/webxpress-logo.png";
    this.loginForm = this.formBuilder.group({
      username: [
        "",
        [Validators.required],
      ],
      password: ["", Validators.required],
    });

    //Redirect if user already logged in
    if (this.authService.currentUserValue) {
      this.Islogin = true;
      this.router.navigate(["/dashboard/Index"]);
    }
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
    this.Islogin = true;
    this.submitted = true;
    this.error = "";
    if (this.loginForm.invalid) {
      this.error = "Username and Password not valid !";
      this.Islogin = false;
      return;
    } else {
     
      this.subs.sink = this.authService.login(this.loginForm.value).subscribe(
        async (res) => {
          if (res) {
            const token = this.authService.currentUserValue.tokens.access.token;
            if (token) {
            this.Islogin = true;
            const companyDetail=await this.authService.getCompanyDetail();
            this.storageService.setItem("companyLogo",companyDetail.company_Image);
            this.storageService.setItem("company_Code",companyDetail.company_Code);
            this.storageService.setItem("timeZone",companyDetail?.timeZone||"");
            this.router.navigate(["/dashboard/Index"]);
            }
            else{
              this.Islogin = false;
              this.error = "Something Is Wrong Please Try Again Later";
            }
          } else {
            this.error = "Something Is Wrong";
            this.Islogin = false;
          }
        },
        (error) => {
          this.error = "Invalid username or password. Please check your credentials and try again.";
          this.Islogin = false;
          this.submitted = false;
        }
      );
    }
    // 
    // this.submitted=true;
    // if (this.loginForm.invalid) {
    //   this.error = "Username and Password not valid !";
    //   return;
    // }
    // else{
    // localStorage.setItem("companyCode", this.loginForm.value.companyCode)
    // localStorage.setItem("Username", this.loginForm.value.Username);
    // localStorage.setItem("Branch", this.loginForm.value.Branch);
    // localStorage.setItem("Mode","Export");
    // this.router.navigate(["/dashboard/Index"]);
    // }
  }

}
