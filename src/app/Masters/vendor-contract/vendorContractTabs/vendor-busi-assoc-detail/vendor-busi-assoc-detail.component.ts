import { Component, OnInit } from '@angular/core';
import { VendorBusiAssocModalComponent } from './vendor-busi-assoc-modal/vendor-busi-assoc-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { removeData } from '../../vendorContractApiUtility';
import { BusinessAssociateBulkUploadComponent } from './business-associate-bulk-upload/business-associate-bulk-upload.component';

@Component({
  selector: 'app-vendor-busi-assoc-detail',
  templateUrl: './vendor-busi-assoc-detail.component.html'
})
export class VendorBusiAssocDetailComponent implements OnInit {
  // @Input() contractData: any;

  TErouteBasedTableData: any[]
  columnHeaderTErouteBased = {
    oPNM: {
      Title: "Operation",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    lOCNM: {
      Title: "Control Location",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    mDNM: {
      Title: "Transport Mode",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    pBSNM: {
      Title: "PayBasis",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rTNM: {
      Title: "Rate Type",
      class: "matcolumnleft",
      Style: "max-width:115px",
    },
    rT: {
      Title: "Rate(₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mIN: {
      Title: "Min(₹)",
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
  staticFieldTErouteBased = ['cT', 'oPNM', 'rTNM', 'mDNM', , 'rT', 'mIN', 'mAX', "pBSNM", "lOCNM"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  CurrentContractDetails: any;
  uploadComponent = BusinessAssociateBulkUploadComponent;

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,
    private dialog: MatDialog,
    private masterService: MasterService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
      //console.log(this.CurrentContractDetails);

    });
  }
  ngOnInit(): void {
    this.getTableDetail();
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
      List: this.TErouteBasedTableData,
      Details: event,
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(VendorBusiAssocModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTableDetail();
      this.tableLoad = true;
    });
  }
  //#endregion
  //#region to get tableData
  async getTableDetail() {
    try {

      const request = {
        companyCode: this.companyCode,
        collectionName: "vendor_contract_ba",
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
    await removeData(this.masterService, id, 'vendor_contract_ba');
    this.getTableDetail()
  }
  //#endregion 
  //#region to call upload function
  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTableDetail();
    });
  }
  //#endregion
}