import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { VendorTERModalComponent } from './vendor-termodal/vendor-termodal.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { removeData } from '../../vendorContractApiUtility';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { ExpressRouteBulkUploadComponent } from './express-route-bulk-upload/express-route-bulk-upload.component';

@Component({
  selector: 'app-vendor-terdetail',
  templateUrl: './vendor-terdetail.component.html'
})
export class VendorTERDetailComponent implements OnInit {
  @Input() contractData: any;

  TErouteBasedTableData: any[]

  // = RouteBasedTableData
  columnHeaderTErouteBased = {
    rTNM: {
      Title: "Route",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    rTTNM: {
      Title: "Rate Type",
      class: "matcolumnleft",
      Style: "max-width:115px",
    },
    cPCTNM: {
      Title: "Capacity(Ton)",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rT: {
      Title: "Rate (₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mIN: {
      Title: "Min (₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mAX: {
      Title: "Max (₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    }
  }
  tableLoad: boolean = true;
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
  staticFieldTErouteBased = ['mIN', 'rT', 'cPCTNM', 'rTNM', 'rTTNM', 'mAX']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  CurrentContractDetails: any;
  isLoad: boolean;
  excelDataList: any;
  previewResult: any;
  uploadComponent = ExpressRouteBulkUploadComponent;
  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private dialog: MatDialog,
    private masterService: MasterService,
    public xlsxUtils: xlsxutilityService,

  ) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)

      //console.log(this.CurrentContractDetails);
    });
  }

  ngOnInit(): void {
    this.getXpressDetail()
  }

  //#region  to fill or remove data form table to controls
  handleMenuItemClick(data) {
    const terDetails = this.TErouteBasedTableData.find(x => x._id == data.data._id);
    data.label.label === 'Remove' ? this.removeTableData(terDetails._id) :
      this.addDetails(terDetails)
  }
  //#endregion 
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const request = {
      TERList: this.TErouteBasedTableData,
      Details: event,
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
    dialogRef.afterClosed().subscribe(() => {
      this.getXpressDetail();
      this.tableLoad = true;
    });
  }
  //#endregion
  //#region to get tableData
  async getXpressDetail() {
    try {
      const collectionName = "vendor_contract_xprs_rt";

      const request = {
        companyCode: this.companyCode,
        collectionName: collectionName,
        filter: {}
      };

      const response = await this.masterService.masterPost("generic/get", request).toPromise();
      // Sort the filtered data based on the 'eDT' property in descending order
      this.TErouteBasedTableData = response.data
        .filter(x => x.cNID === this.CurrentContractDetails.cNID)
        .sort((a, b) => b._id.localeCompare(a._id));

      this.TErouteBasedTableData.forEach(item => {
        item.actions = ['Edit', 'Remove'];
      });

    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);

    }
  }
  //#endregion
  //#region to remove Data from table
  async removeTableData(id) {
    await removeData(this.masterService, id, 'vendor_contract_xprs_rt');
    this.getXpressDetail()
  }
  //#endregion 
  //#region to call upload function
  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getXpressDetail();
    });
  }
  //#endregion
}