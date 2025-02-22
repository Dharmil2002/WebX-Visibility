import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { debug } from "console";
import { ThcCostUpdateService } from "src/app/Utility/module/operation/thc/thc-cost-update.service";
import { StoreKeys } from "src/app/config/myconstants";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { MenuService } from "src/app/core/service/menu-access/menu.serrvice";
import { StorageService } from "src/app/core/service/storage.service";
import { searchbilling } from "src/app/dashboard/docket-dashboard/dashboard-utlity";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
})
export class HomePageComponent implements OnInit {
  showAutocomplete: boolean = false;
  searchQuery: string = "";
  autocompleteOptions: any;
  allOptions: any;
  searchData: any;
  isNavbarCollapsed = true;
  punchLine: string = "";
  token: string = "";

  cardList = [
    {
      title:"Full Truck Operations",
      iconName:"local_shipping",
      mode: "FTL",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "rgb(153, 19, 19)",
      color: "#ffffff"
    },
    {
      title:"Express Movement",
      iconName:"airport_shuttle",
      mode: "LTL",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#e6a838",
      color: "#ffffff"
    },
    {
      title:"Export Operations",
      iconName:"flight_takeoff",
      mode: "Export",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#b61865",
      color: "#ffffff"
    },
    {
      title:"Import Operations",
      iconName:"flight_land",
      mode: "Import",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#b61865",
      color: "#ffffff"
    },
    {
      title:"Billing",
      iconName:"receipt_long",
      mode: "Billing​",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#8C6A5D",
      color: "#ffffff"
    },
    {
      title:"Payments",
      iconName:"payments",
      mode: "",
      route: "/Finance/VendorPayment/Dashboard",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#5F374B",
      color: "#ffffff"
    },
    {
      title:"Accounts",
      iconName:"account_balance_wallet",
      mode: "Accounts",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#5C8374",
      color: "#ffffff"
    },
    {
      title:"Purchase",
      iconName:"shop_two",
      mode: "",
     // route: "https://webx-tms-po.azurewebsites.net/#/dashboard/Index",
      route: "",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#fd7e14",
      color: "#ffffff"
    },
    {
      title:"Analytics",
      iconName:"analytics",
      mode: "",
      route: "/dashboard/ReportDashboard",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#1a3e84",
      color: "#ffffff"
    },
    {
      title:"Admin Portal",
      iconName:"settings",
      mode: "",
      route: "/ControlPanel/gps-rule",
      class: "fa fa-shipping-fast card-icon",
      bgColor: "#222222",
      color: "#ffffff"
    },
    
  ];

  constructor(private router: Router, private masterService: MasterService, private menuService: MenuService, private storage: StorageService
    , private controlPanel: ControlPanelService, private thcCostUpdateService: ThcCostUpdateService,
  ) {       
    this.punchLine = this.storage.getItem(StoreKeys.PunchLine) || "";
    this.bindMenu();
    this.token = this.storage.getItem('token') || '';
    this.setCardRoutes();
  }

  ngOnInit(): void {}
  async bindMenu() {
    
    this.searchData = JSON.parse(this.storage.getItem(StoreKeys.SearchData) || "[]");   
    const searchDetail = this.searchData.map((x) => { return { name: x.title, value: x.router } })
    this.allOptions = searchDetail;
  }


  setCardRoutes() {
    this.cardList.forEach(card => {
      if (card.title === "Purchase") {
        card.route = `https://webx-tms-po.azurewebsites.net/#/authentication/signin?token=${this.token}`;
      }
    });
  }

  // async onAddAppClick() {
  //   if(this.storage.branch == "BLH") {
  //     const filter = {
  //       cID: this.storage.companyCode,
  //       mODULE: "THC",
  //       aCTIVE: true,
  //       rULEID: { D$in: ["THCIBC", "THCCB"] }
  //     }
  //     const res: any = await this.controlPanel.getModuleRules(filter);
  //     if (res.length > 0) {
  //       let request = {
  //         isInterBranchControl: res.find(x => x.rULEID === "THCIBC").vAL,
  //         thcNo: "TH/NDA_/2425/000001",
  //         thc: {
  //           collation: "thc_summary_ltl",
  //           docNoField: "docNo"
  //         },
  //         mfheader: {
  //           collation: "mf_headers_ltl",
  //           docNoField: "mFNO",
  //           thcField: "tHC"
  //         },
  //         mfdetails: {
  //           collation: "mf_details_ltl",
  //           docNoField: "mFNO",
  //           dktField: "dKTNO"
  //         },
  //         docket: {
  //           collation: "dockets_ltl",
  //           docNoField: "dKTNO"
  //         }
  //       };

  //       try {
  //         this.thcCostUpdateService.updateTHCCostForDockets(request);
  //       } catch (error) {
  //         console.log("Error in updateTHCCostForDockets", error);
  //       }
  //     }
  //   }
  // }

  onSearchInput() {
    this.showAutocomplete = true;
    if (this.searchQuery.length > 0) {
      this.autocompleteOptions = this.allOptions.filter((option) =>
        option.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.showAutocomplete = false;
    }
  }

  selectOption(option: any) {
    this.searchQuery = option.name;
    this.router.navigateByUrl(option.value);
    this.searchQuery = "";
    this.showAutocomplete = false;
  }

  onAppClick(event: MouseEvent, data: any){
    
    if(data.mode) {
      //this.setMenuToBind(data.mode);      
      this.storage.setItem(StoreKeys.Mode, data.mode);
      this.bindMenu();
      this.router.navigate(['/dashboard/Index']);
    }
    else if(data.title=="Purchase"){
      window.open(data.route)
      
    }
    else if(data.route) {
      this.router.navigate([data.route]);
    }
  }
}