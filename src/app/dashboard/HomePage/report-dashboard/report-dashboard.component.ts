import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ReportData, menuData } from "./ReportData";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { CustomFilterPipe } from "src/app/Utility/Custom Pipe/FilterPipe";

@Component({
  selector: "app-report-dashboard",
  templateUrl: "./report-dashboard.component.html",
})
export class ReportDashboardComponent implements OnInit, OnDestroy {
  value = "";
  searchTerm = "";
  menuData = menuData;
  // ReportData = ReportData;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(ReportData);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }
  ngOnDestroy() {
    // Disconnect the data source when the component is destroyed.
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  OpenReports(event) {
    console.log("event", event);
  }

  SearchData(SearchText) {
    const filterPipe = new CustomFilterPipe();
    const filteredArr = filterPipe.transform(ReportData, SearchText);
    this.dataSource = new MatTableDataSource<any>(filteredArr);
    this.obs = this.dataSource.connect();
    this.dataSource.paginator = this.paginator;
  }
}
