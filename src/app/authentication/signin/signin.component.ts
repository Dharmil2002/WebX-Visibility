import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/service/auth.service";
import { MainMenu } from "./../../Models/Menu/MenuModel";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  loginForm: UntypedFormGroup;
  submitted = false;
  MenuDetails:any;
  error = "";
  IsRegister=true;
  Menudetailarray:any;
  hide = true;
  Menulist: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
     CompanyAlias:['',Validators.required],
      email: [
        "",
        [Validators.required],
      ],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  companyCode(){

    var CompanyAlias = {
      CompanyAlias: this.f.CompanyAlias.value,
    };
     this.authService.GetCompany(CompanyAlias).subscribe(
      (res) => {
        if (res) {
          this.IsRegister=false;
             localStorage.setItem("CompanyCode",res.companyDetails.companyCode);
        } else {
          this.error = "Invalid Login";
        }
      },
      (error) => {
        this.error = error;
        this.submitted = false;
      }
    );
  
  }
  onSubmit() {
    this.submitted = true;
    this.error = "";
    if (this.loginForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
      var LoginData = {
        UserName: this.f.email.value,
        Password: this.f.password.value,
        CompanyCode:localStorage.getItem("CompanyCode"),
        CompanyAlias:this.f.CompanyAlias.value,
        AuthType:"USER",
        FCMToken:""
      };
      this.subs.sink = this.authService.login(LoginData).subscribe(
        (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              this.GetDmsMenuList()
            }
          } else {
            this.error = "Invalid Login";
          }
        },
        (error) => {
          this.error = error;
          this.submitted = false;
        }
      );
    }
  }
  GetDmsMenuList(){
    this.MenuDetails = {
      CompanyCode: parseInt(localStorage.getItem('CompanyCode')),
      UserId:localStorage.getItem('UserName'),
      IsMvc:1
    }
    this.authService.GetDmsMenu(this.MenuDetails).subscribe(
      (res: any) => {
        if (res) {
          if (res) {
           this.Menulist = res.menuList;
            localStorage.setItem("MenuList", JSON.stringify(this.Menulist));
            this.router.navigate(["/dashboard/LoadPlanning"]);
          }
        } else {
          this.error = "Error While Getting Menu List";
        }
      },
      (error) => {
        this.error = error;
        this.submitted = false;
      }
    );
  }
  
}
