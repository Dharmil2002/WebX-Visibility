import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BeneficiaryDetailComponent } from 'src/app/finance/Vendor Bills/beneficiary-detail/beneficiary-detail.component';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';

@Component({
  selector: 'app-vendors-vehicle-detail',
  templateUrl: './vendors-vehicle-detail.component.html',
})
export class VendorsVehicleDetailComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still loaded or not , used to show loading animation
  METADATA = {
    checkBoxRequired: false,
  };
  tableData: any[]
  columnHeader = {
    vehicleNo: {
      Title: "Vehicle No",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    vehicleType: {
      Title: "Vehicle Type",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    vendorName: {
      Title: "Vendor Name",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    vendorType: {
      Title: "Vendor Type",
      class: "matcolumncenter",
      Style: "min-width:10%",
    }, route: {
      Title: "Route",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },


  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;

  staticField = ['vehicleNo', 'vehicleType', 'vendorType', 'vendorName', 'route']
  constructor(public dialogRef: MatDialogRef<BeneficiaryDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setTableData()
  }

  Close() {
    this.dialogRef.close()
  }
  setTableData() {
    this.tableLoad = true;

    this.tableData = this.objResult.Details.map(x => ({
      ...x,
    }));

    this.tableLoad = false;
  }
}