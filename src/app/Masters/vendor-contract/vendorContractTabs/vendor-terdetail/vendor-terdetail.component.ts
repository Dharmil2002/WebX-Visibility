import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RouteBasedTableData } from '../../vendor-contract-list/VendorStaticData';
import { VendorTERModalComponent } from './vendor-termodal/vendor-termodal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-terdetail',
  templateUrl: './vendor-terdetail.component.html' 
})
export class VendorTERDetailComponent implements OnInit {
  @Input() contractData: any;

  TErouteBasedTableData=RouteBasedTableData
  columnHeaderTErouteBased={
    route: {
      Title: "Route",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    capacity: {
      Title: "Capacity",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rate: {
      Title: "Rate",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    min: {
      Title: "Min",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    max: {
      Title: "Max",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
  }
  tableLoad: boolean=true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  staticFieldTErouteBased=['min','rate','capacity','route','rateType','max']

  constructor( private dialog: MatDialog,) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    const data = changes.contractData?.currentValue
    //this.initializeFormControl(data);
  }
    //#region  to fill or remove data form table to controls
    handleMenuItemClick(data) {
      if (data.label.label === 'Remove') {
        this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== data.data.id);
      } else {
         const beneficiaryDetails = this.TErouteBasedTableData.find(x => x.id == data.data.id);
        this.addDetails(beneficiaryDetails)
      }
    }
    //#endregion 
      //#region to Add a new item to the table or edit
  addDetails(event) {
    const EditableId = event?.id
    const request = {
      beneficiaryList: this.TErouteBasedTableData,
      Details: event,
      //url: this.url
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(VendorTERModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);

      if (result != undefined) {
        if (EditableId) {
          this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.TErouteBasedTableData.length + 1,
          // accountCode: result.accountCode,
          // IFSCcode: result.IFSCcode,
          // bankName: result.bankName,
          // branchName: result.branchName,
          // city: result.city,
          // UPIId: result.UPIId,
          // uploadKYC: "Done",
          // contactPerson: result.contactPerson,
          // mobileNo: result.mobileNo,
          // emailId: result.emailId,
          actions: ['Edit', 'Remove']
        }
       // this.TErouteBasedTableData.push(json);
        this.tableLoad = true
       
      }
      this.tableLoad = true;
    });
  }
  //#endregion
}
