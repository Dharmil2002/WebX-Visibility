import { IDropdownSettings } from "./../../../../node_modules/ng-multiselect-dropdown/multiselect.model.d";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  AfterViewInit,
  Renderer2,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { RightSidebarService } from "src/app/core/service/rightsidebar.service";
import { ConfigService } from "src/app/config/config.service";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { CustomeDatePickerComponent } from "src/app/shared/components/custome-date-picker/custome-date-picker.component";
import { ReplaySubject, Subject, take, takeUntil } from "rxjs";
import { MatSelect } from "@angular/material/select";
import { StorageService } from "src/app/core/service/storage.service";
import { StoreKeys } from "src/app/config/myconstants";

@Component({
  selector: "app-right-sidebar",
  templateUrl: "./right-sidebar.component.html",
  styleUrls: ["./right-sidebar.component.sass"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, AfterViewInit {
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  isTouchUIActivated = false;
  selectedBgColor = "white";
  maxHeight: string;
  maxWidth: string;
  showpanel = false;
  isOpenSidebar: boolean;
  isDarkSidebar = false;
  isDarTheme = false;
  isRtl = false;
  public config: any = {};
  @Input() newitem = "";
  jsonobj: {} = {};
  DashboardFilter: FormGroup;
  vehicleTypeDropdownSettings: IDropdownSettings = {};
  FromStateDropdownSettings: IDropdownSettings = {};
  modelDropdownSettings: IDropdownSettings = {};
  vehicleNoDropdownSettings: IDropdownSettings = {};
  vendorDropdownSettings: IDropdownSettings = {};
  dropdownSettings: IDropdownSettings = {};
  jsonData: [{}] = [{}];
  VehicleNoList: any;
  VendorList: any;
  FromStateList: any;
  vehicleList: any;
  VehicleModellist: any;
  error: string;
  // vehicleTypesList: Array<vehicleTypeDetails> = [];
  vehicleTypesList: any = [];
  //Region Below Class oBj for Dropdown
  //below the code of date picker ----
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    super();
  }

  SetFormData() {
    this.DashboardFilter = this.fb.group({
      CompanyCode: [this.storageService.companyCode],
      Fromdt: [new Date(), Validators.required],
      Todt: [new Date(), Validators.required],
      CityId: [],
      FromCity: [],
      FromState: [],
      VehicleTypeId: [],
      VehicleModel: [],
      VehicleNumbers: [],
      VehicleId: [],
      StateId: [],
      vendorId: [],
      Vendors: [],
    });
  }
  ngOnInit() {
    this.SetFormData();
    this.config = this.configService.configData;
    this.subs.sink = this.rightSidebarService.sidebarState.subscribe(
      (isRunning) => {
        this.isOpenSidebar = isRunning;
      }
    );
    this.setRightSidebarWindowHeight();
  }

  ngAfterViewInit() {
    // set header color on startup
    if (this.storageService.getItem(StoreKeys.Choose_Skin)) {
      this.renderer.addClass(
        this.document.body,
        this.storageService.getItem(StoreKeys.Choose_Skin)
      );
      this.selectedBgColor = this.storageService.getItem(StoreKeys.Choose_Skin_Active);
    } else {
      this.renderer.addClass(
        this.document.body,
        "theme-" + this.config.layout.theme_color
      );
      this.selectedBgColor = this.config.layout.theme_color;
    }

    if (this.storageService.getItem(StoreKeys.MenuOption)) {
      if (this.storageService.getItem(StoreKeys.MenuOption) === "menu_dark") {
        this.isDarkSidebar = true;
      } else if (this.storageService.getItem(StoreKeys.MenuOption) === "menu_light") {
        this.isDarkSidebar = false;
      } else {
        this.isDarkSidebar =
          this.config.layout.sidebar.backgroundColor === "dark" ? true : false;
      }
    } else {
      this.isDarkSidebar =
        this.config.layout.sidebar.backgroundColor === "dark" ? true : false;
    }

    if (this.storageService.getItem(StoreKeys.Theme)) {
      if (this.storageService.getItem(StoreKeys.Theme) === "dark") {
        this.isDarTheme = true;
      } else if (this.storageService.getItem(StoreKeys.Theme) === "light") {
        this.isDarTheme = false;
      } else {
        this.isDarTheme = this.config.layout.variant === "dark" ? true : false;
      }
    } else {
      this.isDarTheme = this.config.layout.variant === "dark" ? true : false;
    }

    if (this.storageService.getItem(StoreKeys.IsRtl)) {
      if (this.storageService.getItem(StoreKeys.IsRtl) === "true") {
        this.setRTLSettings();
      } else if (this.storageService.getItem(StoreKeys.IsRtl) === "false") {
        this.setLTRSettings();
      }
    } else {
      if (this.config.layout.rtl == true) {
        this.setRTLSettings();
      } else {
        this.setLTRSettings();
      }
    }
  }

  ngOnDestroy() {
  }
  
  selectTheme(e) {
    this.selectedBgColor = e;
    const prevTheme = this.elementRef.nativeElement
      .querySelector(".settingSidebar .choose-theme li.active")
      .getAttribute("data-theme");
    this.renderer.removeClass(this.document.body, "theme-" + prevTheme);
    this.renderer.addClass(this.document.body, "theme-" + this.selectedBgColor);
    this.storageService.setItem(StoreKeys.Choose_Skin, "theme-" + this.selectedBgColor);
    this.storageService.setItem(StoreKeys.Choose_Skin_Active, this.selectedBgColor);
  }
  lightSidebarBtnClick() {
    this.renderer.removeClass(this.document.body, "menu_dark");
    this.renderer.removeClass(this.document.body, "logo-black");
    this.renderer.addClass(this.document.body, "menu_light");
    this.renderer.addClass(this.document.body, "logo-white");
    const menuOption = "menu_light";
    this.storageService.setItem(StoreKeys.Choose_LogoHeader, "logo-white");
    this.storageService.setItem(StoreKeys.MenuOption, menuOption);
  }
  darkSidebarBtnClick() {
    this.renderer.removeClass(this.document.body, "menu_light");
    this.renderer.removeClass(this.document.body, "logo-white");
    this.renderer.addClass(this.document.body, "menu_dark");
    this.renderer.addClass(this.document.body, "logo-black");
    const menuOption = "menu_dark";
    this.storageService.setItem(StoreKeys.Choose_LogoHeader, "logo-black");
    this.storageService.setItem(StoreKeys.MenuOption, menuOption);
  }
  lightThemeBtnClick() {
    this.renderer.removeClass(this.document.body, "dark");
    this.renderer.removeClass(this.document.body, "submenu-closed");
    this.renderer.removeClass(this.document.body, "menu_dark");
    this.renderer.removeClass(this.document.body, "logo-black");

    if (this.storageService.getItem(StoreKeys.Choose_Skin)) {
      this.renderer.removeClass(
        this.document.body,
        this.storageService.getItem(StoreKeys.Choose_Skin)
      );
    } else {
      this.renderer.removeClass(
        this.document.body,
        "theme-" + this.config.layout.theme_color
      );
    }

    this.renderer.addClass(this.document.body, "light");
    this.renderer.addClass(this.document.body, "submenu-closed");
    this.renderer.addClass(this.document.body, "menu_light");
    this.renderer.addClass(this.document.body, "logo-white");
    this.renderer.addClass(this.document.body, "theme-white");
    const theme = "light";
    const menuOption = "menu_light";
    this.selectedBgColor = "white";
    this.isDarkSidebar = false;
    this.storageService.setItem(StoreKeys.Choose_LogoHeader, "logo-white");
    this.storageService.setItem(StoreKeys.Choose_Skin, "theme-white");
    this.storageService.setItem(StoreKeys.Theme, theme);
    this.storageService.setItem(StoreKeys.MenuOption, menuOption);
  }
  darkThemeBtnClick() {
    this.renderer.removeClass(this.document.body, "light");
    this.renderer.removeClass(this.document.body, "submenu-closed");
    this.renderer.removeClass(this.document.body, "menu_light");
    this.renderer.removeClass(this.document.body, "logo-white");
    if (this.storageService.getItem(StoreKeys.Choose_Skin)) {
      this.renderer.removeClass(
        this.document.body,
        this.storageService.getItem(StoreKeys.Choose_Skin)
      );
    } else {
      this.renderer.removeClass(
        this.document.body,
        "theme-" + this.config.layout.theme_color
      );
    }
    this.renderer.addClass(this.document.body, "dark");
    this.renderer.addClass(this.document.body, "submenu-closed");
    this.renderer.addClass(this.document.body, "menu_dark");
    this.renderer.addClass(this.document.body, "logo-black");
    this.renderer.addClass(this.document.body, "theme-black");
    const theme = "dark";
    const menuOption = "menu_dark";
    this.selectedBgColor = "black";
    this.isDarkSidebar = true;
    this.storageService.setItem(StoreKeys.Choose_LogoHeader, "logo-black");
    this.storageService.setItem(StoreKeys.Choose_Skin, "theme-black");
    this.storageService.setItem(StoreKeys.Theme, theme);
    this.storageService.setItem(StoreKeys.MenuOption, menuOption);
  }

  setRightSidebarWindowHeight() {
    const height = window.innerHeight - 137;
    this.maxHeight = height + "";
    this.maxWidth = "500px";
  }
  onClickedOutside(event: Event) {
    const button = event.target as HTMLButtonElement;
    if (button.id !== "settingBtn") {
      if (this.isOpenSidebar === true) {
        this.toggleRightSidebar();
      }
    }
  }
  toggleRightSidebar(): void {
    this.rightSidebarService.setRightSidebar(
      (this.isOpenSidebar = !this.isOpenSidebar)
    );
  }

  switchDirection(event: MatSlideToggleChange) {
    var isrtl: string = String(event.checked);
    if (
      isrtl === "false" &&
      document.getElementsByTagName("html")[0].hasAttribute("dir")
    ) {
      document.getElementsByTagName("html")[0].removeAttribute("dir");
      this.renderer.removeClass(this.document.body, "rtl");
    } else if (
      isrtl === "true" &&
      !document.getElementsByTagName("html")[0].hasAttribute("dir")
    ) {
      document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
      this.renderer.addClass(this.document.body, "rtl");
    }
    this.storageService.setItem(StoreKeys.IsRtl, isrtl);
    this.isRtl = event.checked;
  }
  setRTLSettings() {
    document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    this.renderer.addClass(this.document.body, "rtl");
    this.isRtl = true;
    this.storageService.setItem(StoreKeys.IsRtl, "true");
  }
  setLTRSettings() {
    document.getElementsByTagName("html")[0].removeAttribute("dir");
    this.renderer.removeClass(this.document.body, "rtl");
    this.isRtl = false;
    this.storageService.setItem(StoreKeys.IsRtl, "false");
  }


  sendfilterdata() {
    this.toggleRightSidebar();
    var fromdate = this.range.controls.start.value;
    var todate = this.range.controls.end.value;
    this.DashboardFilter.controls['Fromdt'].setValue(fromdate);
    this.DashboardFilter.controls['Todt'].setValue(todate);
    this.authService.setFilterObs(this.DashboardFilter.value);
  }
  reset() {
    this.DashboardFilter.reset();
    this.authService.setFilterObs("");
    this.SetFormData();
    this.toggleRightSidebar();
  }
}
