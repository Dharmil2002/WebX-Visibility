import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorTableData } from './VendorStaticData';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getContractList } from '../vendorContractApiUtility';
import moment from 'moment';

@Component({
  selector: 'app-vendor-contract-list',
  templateUrl: './vendor-contract-list.component.html'
})
export class VendorContractListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Vendor Contract",
    },
  ];
  tableData: any[]
  boxData: { count: number; title: string; class: string; icon: string; }[];
  displayedColumns = [
    { Key: "vNNM", title: "Vendor", width: "250", className: "matcolumnfirst", show: true },
    { Key: "cNID", title: "ContractID", width: "100", className: "matcolumncenter", show: true },
    { Key: "pDTNM", title: "Product", width: "70", className: "matcolumncenter", show: true },
    { Key: "cNSDT", title: "Effective Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "eNDDT", title: "End Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "expiringin", title: "Expiring In", width: "170", className: "matcolumncenter", show: true },
  ];
  columnKeys = this.displayedColumns.map((column) => column.Key);
  isTouchUIActivated = false;
  isTblLoading = false;
  public ModeldataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  constructor(private router: Router, private encryptionService: EncryptionService,
    private masterService: MasterService,
  ) {
    super();
    this.columnKeys.push('status')
    this.columnKeys.push('actions')
  }

  ngOnInit() {
    this.SearchData();
  }
  async SearchData() {
    this.tableData = await getContractList(this.masterService);
    // console.log(this.tableData);
    this.tableData.forEach((item: any) => {
      const startDate: Date = new Date(item.cNSDT);
      const endDate: Date = new Date(item.eNDDT);
      item.cNSDT = moment(startDate).format('DD-MM-YYYY');
      item.eNDDT = moment(endDate).format('DD-MM-YYYY');
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
    this.getContractKpiCount();
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
    this.router.navigate(['/Masters/VendorContract/VendorContractIndex'], {
      queryParams: { data: EncriptedData },
    });
  }
  AddNewContract() {
    this.router.navigate(['/Masters/VendorContract/AddNewVendorContract']);
  }
}