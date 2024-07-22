import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, firstValueFrom } from "rxjs";
import { CustomFilterPipe } from "src/app/Utility/Custom Pipe/FilterPipe";
import { StorageService } from "src/app/core/service/storage.service";
import { MenuService } from "src/app/core/service/menu-access/menu.serrvice";
import { Router } from "@angular/router";
import { extractUniqueValues } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
@Component({
  selector: "app-report-dashboard",
  templateUrl: "./report-dashboard.component.html",
})
export class ReportDashboardComponent implements OnInit, OnDestroy {
  value = "";
  searchTerm = "";
  Category = "Reports"; //Reports, Dashboards
  ReportData: any;
  DashboardData: any;
  menuData: any = [];
  selectedCategory: string = "All";
  // ReportData = ReportData;

  reportObs: Observable<any>;
  reportDataSource: MatTableDataSource<any>;

  dashboardObs: Observable<any>;
  dashboardDataSource: MatTableDataSource<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private storage: StorageService,
    private menuService: MenuService,
    private masterService: MasterService,
    // private ModuleCounterService: ModuleCounterService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    const res = await this.GetReports();
    this.ReportData = res.reports;
    this.menuData = res.menu;
    this.DashboardData = res.dashboards;
    this.selectedCategory = this.menuData[0].title;

    this.reportDataSource = new MatTableDataSource<any>(this.ReportData);
    this.dashboardDataSource = new MatTableDataSource<any>(this.DashboardData);

    this.changeDetectorRef.detectChanges();
    this.reportObs = this.reportDataSource.connect();
    this.dashboardObs = this.dashboardDataSource.connect();
  }

  async GetReports() {
    let menu = JSON.parse(this.storage.menu);
    let menuItems = menu.filter((x) => x.MenuGroup == "ANALYTICS" && x.HasLink);

    let catData = menuItems.map((x) => {
      const d = {
        title: x.SubCategory,
        category: x.Category || "Report",
        selected: false
      };
      return d;
    }).sort((a, b) => a.title.localeCompare(b.title));

    catData.unshift({ title: "All", category: "All", selected: true });

    let reportData = menuItems.filter(f => f.Category == "Reports").map((x) => {
      const d = {
        iconName: x.Icon || "sticky_note_2",
        title: x.MenuName,
        category: x.SubCategory || "",
        type: x.Category,
        route: x.MenuLink,
        bgColor: x.Color || "#1a3e84",
        color: x.TextColor || "#ffffff"
      };
      return d;
    });

    let dashboardData = menuItems.filter(f => f.Category == "Dashboards").map((x) => {
      const d = {
        iconName: x.Icon || "sticky_note_2",
        title: x.MenuName,
        category: x.SubCategory || "",
        type: x.Category,
        route: x.MenuLink,
        bgColor: x.Color || "#1a3e84",
        color: x.TextColor || "#ffffff",
        data: []
      };
      return d;
    });

    var ctData = await this.getConfig();
    console.log(ctData);
    if (ctData) {
      const c = {
        iconName: "map",
        title: ctData.title,
        category: "Operation",
        type: "Dashboards",
        route: ctData.link,
        bgColor: "#6bc0dd",
        color: "#3c414d",
        data: []
      };
      dashboardData.unshift(c);
    }

    let menuData = catData.reduce((acc, current) => {
      if (!acc.find(item => item.title === current.title)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return {
      reports: reportData.sort((a, b) => a.title.localeCompare(b.title)),
      menu: menuData,
      dashboards: dashboardData.sort((a, b) => a.title.localeCompare(b.title))
    };
  }

  async getConfig() {

    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "dashboard_config",
      filter: { cID: this.storage.companyCode, lTYP: "Login" },
    };

    let dashConfig = await firstValueFrom(this.masterService.masterPost("generic/get", req));
    if (dashConfig?.data?.length > 0) {
      let LoginLink = dashConfig?.data?.find((f) => f?.lTYP == "Login");
      if (LoginLink?.link && LoginLink?.link != "") {
        let link = `${LoginLink.link}&CustomerId=${LoginLink.lCD}&VirtualLocation=${this.storage.branch}`;
        const data = {
          link: link,
          icon: `/assets/images/dashboard/${LoginLink.icon}`,
          title: LoginLink.title,
        };
        return data;
      }
    }
    return null;
  }

  ngOnDestroy() {
    // Disconnect the data source when the component is destroyed.
    if (this.reportDataSource) {
      this.reportDataSource.disconnect();
    }
    if (this.dashboardDataSource) {
      this.dashboardDataSource.disconnect();
    }
  }

  OpenReports(event) {
    //console.log(this.ModuleCounterService.GetMenuInfo(event.route));
    //this.router.navigate([event.route]);
    window.open(`/#${event.route}`, '_blank');
  }

  OpenDashboards(event) {
    if (event.route.startsWith("http")) {
      window.open(event.route);
    } else {
      window.open(`/#${event.route}`, '_blank');
    }
  }

  onCategoryChange(event) {
    const selectedChip = event.value;
    this.Category = selectedChip;
    this.filterReports(null);
  }

  filterReports(event) {
    // Determine the data source and data based on the category
    let dataSource, data;
    if (this.Category === "Reports") {
      dataSource = 'reportDataSource';
      data = this.ReportData;
    } else if (this.Category === "Dashboards") {
      dataSource = 'dashboardDataSource';
      data = this.DashboardData;
    }

    // Filter the data if necessary
    if (this.selectedCategory === "All") {
      this[dataSource] = new MatTableDataSource<any>(data);
    } else {
      const filterPipe = new CustomFilterPipe();
      const filteredData = filterPipe.transform(data, this.selectedCategory);
      this[dataSource] = new MatTableDataSource<any>(filteredData);
    }

    // Connect the data source to the observable
    if (this.Category === "Reports") {
      this.reportObs = this.reportDataSource.connect();
    } else if (this.Category === "Dashboards") {
      this.dashboardObs = this.dashboardDataSource.connect();
    }
  }

  SearchReports(SearchText) {
    const filterPipe = new CustomFilterPipe();
    const filteredArr = filterPipe.transform(this.ReportData, SearchText);
    this.reportDataSource = new MatTableDataSource<any>(filteredArr);
    this.reportObs = this.reportDataSource.connect();
  }

  SearchDashboards(SearchText) {
    const filterPipe = new CustomFilterPipe();
    const filteredArr = filterPipe.transform(this.DashboardData, SearchText);
    this.dashboardDataSource = new MatTableDataSource<any>(filteredArr);
    this.dashboardObs = this.dashboardDataSource.connect();
  }
}
