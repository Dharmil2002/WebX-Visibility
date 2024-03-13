import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
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
  cardList = [
    {
      title:"Procurement",
      iconName:"event_note",
    },
    {
      title:"Export Operations",
      iconName:"flight_takeoff",
    },
    {
      title:"Express Operations",
      iconName:"local_shipping",
    },
    {
      title:"Import Operations",
      iconName:"flight_land",
    },
    {
      title:"Billing",
      iconName:"receipt_long",
    },
    {
      title:"Payments",
      iconName:"payments",
    },
    {
      title:"Purchase",
      iconName:"shop_two",
    },
    {
      title:"Masters",
      iconName:"info",
    },
  ];
  constructor(private router: Router, private masterService: MasterService) {
    this.bindMenu();
  }

  ngOnInit(): void {}
  async bindMenu() {
    this.searchData = await searchbilling(this.masterService);
    const searchDetail = this.searchData.map((x) => {
      return { name: x.title, value: x.router };
    });
    this.allOptions = searchDetail;
  }

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
}
