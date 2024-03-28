import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { CustomFilterPipe } from "src/app/Utility/Custom Pipe/FilterPipe";
import { StorageService } from "src/app/core/service/storage.service";
import { MenuService } from "src/app/core/service/menu-access/menu.serrvice";
import { Router } from "@angular/router";
import { extractUniqueValues } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

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
  // ReportData = ReportData;

  reportObs: Observable<any>;
  reportDataSource: MatTableDataSource<any>;

  dashboardObs: Observable<any>;
  dashboardDataSource: MatTableDataSource<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private storage: StorageService,
    private menuService: MenuService,
    private router: Router) {}

  ngOnInit(): void {
    const res = this.GetReports();
    this.ReportData = res.reports;
    this.menuData = res.menu;
    this.DashboardData = res.dashboards;

    this.reportDataSource = new MatTableDataSource<any>(this.ReportData);
    this.dashboardDataSource = new MatTableDataSource<any>(this.DashboardData);

    this.changeDetectorRef.detectChanges();
    this.reportObs = this.reportDataSource.connect();
    this.dashboardObs = this.dashboardDataSource.connect();
  }

  GetReports() {
    let menu = JSON.parse( this.storage.menu);
    let menuItems = menu.filter((x) => x.MenuGroup == "ANALYTICS" && x.HasLink);

    let catData = menuItems.map((x) => {
      const d = {
          title: x.SubCategory,
          category: x.Category || "Report"
      };
      return d;
    });
    catData.unshift({ title: "All", category: "All" });
    
    let reportData = menuItems.filter(f => f.Category == "Reports").map((x) => {
      const d = {
          iconName: x.Icon || "sticky_note_2",
          title: x.MenuName,
          category: x.SubCategory || "",
          type: x.Category,
          route: x.MenuLink
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
          color: x.TextColor || "#ffffff"
      };
      return d;
    });

    let menuData = catData.reduce((acc, current) => {
      if (!acc.find(item => item.title === current.title)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return  { reports: reportData, menu: menuData, dashboards: dashboardData};
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
    //this.router.navigate([event.route]);
    window.open(`/#${event.route}`, '_blank');  
  }

  OpenDashboards(event) {
    //this.router.navigate([event.route]);
    window.open(`/#${event.route}`, '_blank');  
  }

  onCategoryChange(event) {
    const selectedChip = event.value;
    this.Category = selectedChip;
  }

  filterReports(subCategory) {
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
    if (subCategory === "All") {
      this[dataSource] = new MatTableDataSource<any>(data);
    } else {
      const filterPipe = new CustomFilterPipe();
      const filteredData = filterPipe.transform(data, subCategory);
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
