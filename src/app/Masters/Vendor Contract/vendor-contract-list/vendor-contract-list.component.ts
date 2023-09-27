import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableData } from './StaticData';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vendor-contract-list',
  templateUrl: './vendor-contract-list.component.html'
})
export class VendorContractListComponent implements AfterViewInit {
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Vendor Contract",
    },
  ];

  tableload=true;
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
    contractCode: {
      Title: "Contract Code",
      class: "matcolumncenter",
      Style: "max-width: 15%",
      Key: "static",
    },
    vendorType: {
      Title: "Vendor Type",
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
    validUptoDate: {
      Title: "Valid Upto Date",
      class: "matcolumncenter",
      Style: "max-width: 15%",
      Key: "static",
    },
    contractDate: {
      Title: "Contract Date",
      class: "matcolumncenter",
      Style: "max-width: 20%",
      Key: "static",
    },
    status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width: 10%",
      Key: "status",
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

  AddNewContract(){
    this.router.navigateByUrl('/Masters/VendorContract/AddContractProfile')
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<any>(this.tabledata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ActionEdit(){
    this.router.navigateByUrl('/Masters/VendorContract/VendorIndex')
  }
}
