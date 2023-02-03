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
 
  onSubmit() {
  }
  
}
