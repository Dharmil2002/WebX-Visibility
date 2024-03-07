import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "src/app/config/config.service";
import { AuthService } from "src/app/core/service/auth.service";
import { WINDOW } from "src/app/core/service/window.service";
import { LanguageService } from "src/app/core/service/language.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import * as moment from 'moment-timezone';
import { searchbilling } from "src/app/dashboard/docket-dashboard/dashboard-utlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { MatDialog } from "@angular/material/dialog";
import { VirtualLoginComponent } from "../virtual-login/virtual-login.component";
import { StorageService } from "src/app/core/service/storage.service";
import { SearchComponent } from "./search/search.component";
const document: any = window.document;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.sass"],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, AfterViewInit {
  public config: any = {};
  isNavbarCollapsed = true;
  isDropdownOpen: boolean = false;
  isNavbarShow = true;
  flagvalue;
  BaseTimeZone;
  CurrentMode = localStorage.getItem('Mode');
  FinancialYear: string;
  countryName;
  langStoreValue: string;
  defaultFlag: string;
  isOpenSidebar: boolean;
  Mode: string;
  searchQuery: string = '';
  // autocompleteOptions: any;
  showAutocomplete: boolean = false;
  menuItems = ['LTL', 'FTL', 'Import', 'Export', 'Billing​', 'Accounts'];
  // Replace this with your actual data source or API call
  allOptions: any;
  searchData: any;
  logo: string;
  companyCd: string;

  constructor(
    private dialogModel: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private masterService: MasterService,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    private storage: StorageService,
    public languageService: LanguageService,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
    this.breakpointObserver
      .observe(["(max-width: 768px)"])
      .subscribe((result: BreakpointState) => {
        if (!result.matches) {
          this.callSidemenuCollapse();
        }
      });
    this.bindMenu();
  }

  listLang = [
    { text: "English", flag: "assets/images/flags/us.jpg", lang: "en" },
    { text: "Spanish", flag: "assets/images/flags/spain.jpg", lang: "es" },
    { text: "German", flag: "assets/images/flags/germany.jpg", lang: "de" },
  ];

  notifications: any[] = [];
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offset =
      this.window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;
    // if (offset > 50) {
    //   this.isNavbarShow = true;
    // } else {
    //   this.isNavbarShow = false;
    // }
  }
  ngOnInit() {
    this.config = this.configService.configData;
    this.logo = this.storage.companyLogo;
    this.companyCd = this.storage.companyCd;
    this.Mode = localStorage.getItem("Import");
    this.convertTimeFromUtc(new Date(), 'Asia/Kolkata');
    this.getCurrentFinancialYear();
  }
  ngAfterViewInit() {
    // set theme on startup
    if (localStorage.getItem("theme")) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem("theme"));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }

    if (localStorage.getItem("menuOption")) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem("menuOption")
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        "menu_" + this.config.layout.sidebar.backgroundColor
      );
    }

    if (localStorage.getItem("choose_logoheader")) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem("choose_logoheader")
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        "logo-" + this.config.layout.logo_bg_color
      );
    }

    if (localStorage.getItem("sidebar_status")) {
      if (localStorage.getItem("sidebar_status") === "close") {
        this.renderer.addClass(this.document.body, "side-closed");
        this.renderer.addClass(this.document.body, "submenu-closed");
      } else {
        this.renderer.removeClass(this.document.body, "side-closed");
        this.renderer.removeClass(this.document.body, "submenu-closed");
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, "side-closed");
        this.renderer.addClass(this.document.body, "submenu-closed");
      }
    }
  }


  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    } else {
      this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }

  logout() {
    this.subs.sink = this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(["/authentication/signin"]);
      }
    });
  }
  get CurrentLocation(): any {
    return localStorage.getItem('Branch');
  }
  get CompanyLogo(): any {
    return localStorage.getItem('company_Logo');
  }

  convertTimeFromUtc(utcDate: Date, timeZone: string = ''): Date {
    const indianTimeZone = 'Asia/Kolkata';
    const convertedDate = moment.utc(utcDate).tz(timeZone || indianTimeZone).toDate();
    this.BaseTimeZone = convertedDate;
    return convertedDate;
  }
  getCurrentFinancialYear() {
    const thisYear = (new Date()).getFullYear();
    const lastYear = thisYear + 1;
    this.FinancialYear = `${thisYear}-${lastYear}`;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  menuModeDetail(option: string) {
    localStorage.setItem("Mode", option);
    //location.reload();
    this.router.navigate(['/']);
    this.isDropdownOpen = false; // Close the dropdown when an option is selected
    // Add any other logic you need here when a menu item is selected
  }

  openSearchPopup(): void {
    const dialogRef = this.dialogModel.open(SearchComponent, {
      width: '500px',
      position: { top: '70px' },
      data: { allOptions: this.allOptions, searchQuery: this.searchQuery }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // fetchData(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       const data = this.allOptions.filter((option) => 
  //       option.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
  //       resolve(data);
  //     }, 1000);
  //   });
  // }

  // onSearchInput() {
  //   this.showAutocomplete = true;
  //   if (this.searchQuery.length > 0) {
  //     this.autocompleteOptions = this.allOptions.filter((option) =>
  //       option.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  //     )
  //   }
  //   else {
  //     this.showAutocomplete = false;
  //   }
  // }

  // selectOption(option: any) {
  //   this.searchQuery = option.name;
  //   this.router.navigateByUrl(option.value);
  //   this.searchQuery = "";
  //   this.showAutocomplete = false;
  // }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Click occurred outside of the component, so hide autocomplete
      this.showAutocomplete = false;
    }
  }
  navigateToPage() {
    this.goBack('0');
  }
  async bindMenu() {
    this.searchData = await searchbilling(this.masterService);
    const searchDetail = this.searchData.map((x) => { return { name: x.title, value: x.router } })
    this.allOptions = searchDetail;
  }
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }

  VirtualLogin() {
    const dialogRef = this.dialogModel.open(VirtualLoginComponent, {
      width: "30%",
      position: {
        top: "20px",
      },
      disableClose: true,
    });

  }
}
