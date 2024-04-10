import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/service/auth.service";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { StorageService } from "src/app/core/service/storage.service";
import { MenuService } from "src/app/core/service/menu-access/menu.serrvice";
import { firstValueFrom } from "rxjs";
import { sortArrayByFields } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { MenuData } from "src/app/layout/sidebar/sidebar.metadata";
import { DocCalledAsModel } from "src/app/shared/constants/docCalledAs";
import { mn } from "date-fns/locale";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { StoreKeys } from "src/app/config/myconstants";

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
  DocCalledAs: DocCalledAsModel;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private storage: StorageService,
    private menuService: MenuService,
    private controlPanel: ControlPanelService,
    private locationService: LocationService
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
    if (this.authService.currentUserValue && !this.authService.isTokenExpired) {
      this.Islogin = true;
      //this.router.navigate(["/dashboard/Index"]);
      this.router.navigate(["/dashboard/home"]);
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

  async onSubmit() {
    this.Islogin = true;
    this.submitted = true;
    this.error = "";
    if (this.loginForm.invalid) {
      this.error = "Username and Password not valid !";
      this.Islogin = false;
      return;
    } else {
     
      try {      
      const res = await firstValueFrom(this.authService.login(this.loginForm.value));
        if (res) {
          
            const token = this.authService.currentUserValue.tokens.access.token;
            if (token) {
             
              this.Islogin = true;
              const companyDetail = await this.authService.getCompanyDetail();
              
              await this.controlPanel.getDocumentNames(companyDetail.companyCode);
              this.DocCalledAs = this.controlPanel.DocCalledAs;
              await this.getMenuList();

              //userLocations
              this.storage.setItem(StoreKeys.CompanyLogo, companyDetail.company_Image);
              this.storage.setItem(StoreKeys.CompanyAlias, companyDetail.company_Code);
              this.storage.setItem(StoreKeys.TimeZone, companyDetail?.timeZone||"");
              //Need to be retrived from User Master
              this.storage.setItem(StoreKeys.Mode, "FTL");
              
              this.setMenuToBind("FTL");
              this.router.navigate(["/dashboard/home"]);
            }
            else{
              this.Islogin = false;
              this.error = "Something Is Wrong Please Try Again Later";
            }
          } else {
            this.error = "Something Is Wrong";
            this.Islogin = false;
          }
        } catch (error) {
          this.error = "Invalid username or password. Please check your credentials and try again.";
            this.Islogin = false;
            this.submitted = false;
        }
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

  setMenuToBind(mode) {
    let menu = JSON.parse( this.storage.menu);
    let menuItems = menu.filter((x) => !x.MenuGroup || x.MenuGroup == mode.toUpperCase() || x.MenuGroup == "" || x.MenuGroup == "ALL");

    let menuData = this.menuService.buildHierarchy(menuItems);
    let root = menuData.find((x) => x.MenuLevel == 1);
    this.storage.setItem(StoreKeys.MenuToBind, JSON.stringify(root.SubMenu || []));

    const searchData = menuItems.filter((x) => x.MenuLevel != 1 && x.HasLink).map((x) => {
      const p = menu.find((y) => y.MenuId == x.ParentId);      
      const d = {
        title: `${p?.MenuName}/${x.MenuName}`,  
        tag: x.MenuName.split(" "),
        router: x.MenuLink
      };

      return d;
    });

    this.storage.setItem(StoreKeys.SearchData, JSON.stringify(searchData || []));
  }
  
    //#region to get User Data
    async getMenuList() {
      var res: any = await firstValueFrom(this.menuService.getMenuData({
        IsActive: true,
        Type: { D$in: ["None", "Menu"] },
      }));
      if (res) {
        let menuData = res.data.map((x) => {
          x.MenuName = x.MenuName.replace(/{{Docket}}/g, this.DocCalledAs.Docket)
                                  .replace(/{{THC}}/g, this.DocCalledAs.THC)
                                  .replace(/{{MF}}/g, this.DocCalledAs.MF)
                                  .replace(/{{LS}}/g, this.DocCalledAs.LS)
                                  .replace(/{{DRS}}/g, this.DocCalledAs.DRS);
          return x;
        });
        this.storage.setItem(StoreKeys.Menu, JSON.stringify(menuData));
      }
    }
  
    
    //#endregion

}
