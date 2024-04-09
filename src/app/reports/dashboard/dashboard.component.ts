import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  // styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  breadScrums = [
    {
      title: "Dashboard",
      items: ["Home"],
      active: "Dashboard",
    },
  ];
  companyCode: any = 0;
  branchCode = "";
  boxData: any = [];
  constructor(private masterService: MasterService, private router: Router, private storage: StorageService) {
    this.companyCode = this.storage.companyCode;
    this.branchCode = this.storage.branch;
    this.getConfig();
  }

  ngOnInit(): void {}
  async getConfig() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "dashboard_config",
      filter: { cID: this.companyCode, lTYP: "Login" },
    };
    let dashConfig = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (dashConfig?.data?.length > 0) {
      let LoginLink = dashConfig?.data?.find((f) => f?.lTYP == "Login");
      if (LoginLink?.link && LoginLink?.link != "") {
        let link = `${LoginLink.link}&CustomerId=${LoginLink.lCD}&VirtualLocation=${this.branchCode}`;
        const data = {
          link: link,
          icon: `/assets/images/dashboard/${LoginLink.icon}`,
          title: LoginLink.title,
        };
        this.boxData.push(data);
      }
    }
  }
  openLink(link) {
    const externalLink = encodeURIComponent(link);
    window.open(`#/Reports/ControlTower?externalLink=${externalLink}`, '_blank');
  }
}
