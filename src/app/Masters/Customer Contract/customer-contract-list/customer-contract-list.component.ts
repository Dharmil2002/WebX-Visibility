import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { fromEvent } from "rxjs";
//import { TableData } from "./StaticData";
import { Route, Router } from "@angular/router";
import { EncryptionService } from "src/app/core/service/encryptionService.service";
import { GetContractListFromApi } from "../CustomerContractAPIUtitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import moment from "moment";
@Component({
  selector: 'app-customer-contract-list',
  templateUrl: './customer-contract-list.component.html',
})
export class CustomerContractListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  breadscrums = [
    {
      title: "Customer Contract",
      items: ["Home"],
      active: "Customer Contract",
    },
  ];
  displayedColumns = [
    { Key: "cUSTNM", title: "Customer", width: "180", className: "matcolumnfirst", show: true },
    { Key: "cONID", title: "Contract Id", width: "180", className: "matcolumncenter", show: true },
    { Key: "pNM", title: "Product", width: "70", className: "matcolumncenter", show: true },
    { Key: "pBAS", title: "PayBasis", width: "70", className: "matcolumncenter", show: true },
    { Key: "cSTARTDT", title: "Start Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "cENDDT", title: "End Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "expiringin", title: "Expiring In", width: "150", className: "matcolumncenter", show: true },
  ];
  columnKeys = this.displayedColumns.map((column) => column.Key);
  boxData: { count: number; title: string; class: string; }[];
  tableData: any;
  public ModeldataSource = new MatTableDataSource<any>();
  error;
  remarks;
  geoJsonData = '';
  isTouchUIActivated = false;
  isTblLoading = false;
  constructor(private router: Router, private masterService: MasterService, private encryptionService: EncryptionService) {
    super();
    this.columnKeys.push('status')
    this.columnKeys.push('actions')

  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  async ngOnInit() {
    this.SearchData();
  }
  async SearchData() {
    this.tableData = await GetContractListFromApi(this.masterService)
    this.tableData.forEach((item: any) => {
      const startDate: Date = new Date(item.cSTARTDT);
      const endDate: Date = new Date(item.cENDDT);

      item.cSTARTDT = moment(startDate).format('DD-MM-YYYY');
      item.cENDDT = moment(endDate).format('DD-MM-YYYY');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const timeDiff: number = endDate.getTime() - today.getTime();
      const daysDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      if (endDate.toDateString() === today.toDateString()) {
        item.expiringin = `Expiring Today`;
      }
      else if (endDate < today) {
        const ExpiredDiff: number = today.getTime() - endDate.getTime();
        const ExpireddaysDiff: number = Math.floor(ExpiredDiff / (1000 * 60 * 60 * 24));
        item.status = "Expired";
        item.expiringin = `Expired ${ExpireddaysDiff} Days Ago`;
      }
      else {
        item.expiringin = `${daysDiff} Days Left`;
      }
    });

    this.ModeldataSource = new MatTableDataSource(
      this.tableData
    );
    this.ModeldataSource.paginator = this.paginator;
    this.ModeldataSource.sort = this.sort;

    this.subs.sink = fromEvent(
      this.filter.nativeElement,
      "keyup"
    ).subscribe(() => {
      if (!this.ModeldataSource) {
        return;
      }
      this.ModeldataSource.filter = this.filter.nativeElement.value;
    });
    this.getContractKpiCount()
  }
  getContractKpiCount() {
    const createContractsDataObject = (
      count: number,
      title: string,
      className: string,
      icon: string
    ) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
      icon
    });
    const ActiveContract = this.tableData.filter((x) => x.status == "Active");
    const ExpiredContract = this.tableData.filter((x) => x.status == "Expired");
    const shipData = [
      createContractsDataObject(ActiveContract.length, "Active Contracts", "bg-c-Bottle-light", 'fas fa-check-circle float-start'),
      createContractsDataObject(ExpiredContract.length, "Expired Contracts", "bg-c-Grape-light", 'fas fa-times-circle float-start'),
    ];
    this.boxData = shipData
  }
  Edit(events) {
    const EncriptedData = this.encryptionService.encrypt(JSON.stringify(events));
    this.router.navigate(['/Masters/CustomerContract/CustomerIndex'], {
      queryParams: { data: EncriptedData },
    });
  }
  AddNewContract() {
    this.router.navigate(['/Masters/CustomerContract/AddNewCustomerContract']);
  }
}
