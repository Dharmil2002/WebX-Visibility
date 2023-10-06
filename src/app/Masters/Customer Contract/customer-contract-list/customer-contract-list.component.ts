import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableData } from './StaticData';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer-contract-list',
  templateUrl: './customer-contract-list.component.html',
})
export class CustomerContractListComponent implements AfterViewInit {
  breadscrums = [
    {
      title: "Customer Contract",
      items: ["Home"],
      active: "Customer Contract",
    },
  ];

  tableload = true;
  tabledata = TableData
  ActionObject = {
    AddRow: false,
    Submit: false,
    Search: false,
  };
  objectKeys = Object.keys;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  columnHeader = {
    srno: {
      Title: "Sr.No",
      class: "matcolumncenter",
      Style: "max-width: 15%",
      Key: "static",
    },
    ContractID: {
      Title: "Contract ID",
      class: "matcolumncenter",
      Style: "max-width: 15%",
      Key: "static",
    },
    contractStartDate: {
      Title: "Contract StartDate",
      class: "matcolumncenter",
      Style: "max-width: 15%",
      Key: "static",
    },
    contractEndDate: {
      Title: "Contract EndDate",
      class: "matcolumncenter",
      Style: "max-width: 15%",
      Key: "static",
    },
    ContractType: {
      Title: "Contract Type",
      class: "matcolumncenter",
      Style: "max-width: 20%",
      Key: "static",
    },
    IsActive: {
      Title: "IsActive",
      class: "matcolumncenter",
      Style: "max-width: 10%",
      Key: "status",
    },
    view: {
      Title: "View",
      class: "matcolumncenter",
      Style: "max-width: 10%",
      Key: "view",
    },
    edit: {
      Title: "Edit",
      class: "matcolumncenter",
      Style: "max-width: 10%",
      Key: "edit",
    },

  };
  dataSource: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  AddNewContract() {
    this.router.navigateByUrl('/Masters/CustomerContract/AddContractProfile')
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<any>(this.tabledata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ActionEdit() {
    this.router.navigateByUrl('/Masters/CustomerContract/CustomerIndex')
  }
}
