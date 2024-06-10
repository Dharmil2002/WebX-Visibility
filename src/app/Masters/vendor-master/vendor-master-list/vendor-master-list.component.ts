import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { GetGeneralMasterData } from "../../Customer Contract/CustomerContractAPIUtitlity";
import { StorageService } from "src/app/core/service/storage.service";
import { MatDialog } from "@angular/material/dialog";
import { VendorMasterUploadComponent } from "../vendor-master-upload/vendor-master-upload.component";
@Component({
  selector: 'app-vendor-master-list',
  templateUrl: './vendor-master-list.component.html',
})
export class VendorMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  companyCode: any = 0;
  csvFileName: string;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader = {
    eNTDT: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:15%",
      datatype: "datetime"
    },
    vendorCode: {
      Title: "Vendor Code",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    vendorName: {
      Title: "Vendor Name",
      class: "matcolumnleft",
      Style: "min-width:15%",
      datatype: "string"
    },
    vendorType: {
      Title: "Vendor Type",
      class: "matcolumnleft",
      Style: "min-width:15%",
      datatype: "string"
    },
    isActive: {
      type: "Activetoggle",
      Title: "Active Flag",
      class: "matcolumncenter",
      Style: "min-width:15%",
      functionName: "isActiveFuntion"
    },
    actions: {
      Title: "Actions",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    //"view": "View"
  }

  staticField = ["eNTDT", "vendorCode", "vendorName", "vendorType"]

  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "vendorCode": "Vendor Code",
    "vendorName": "Vendor Name",
    "vendorType": "Vendor Type",
    "vendorAddress": "Vendor Address",
    "vendorLocation": "Vendor Location",
    "vendorCity": "Vendor City",
    "vendorPinCode": "Vendor Pin Code",
    "vendorPhoneNo": "Vendor Phone No",
    "emailId": "Email ID",
    "isActive": "Active Flag",
    "blackListed": "Black Listed",
    "panNo": "PAN NO",
    "serviceTaxNo": "Service Tax No",
    "remarks": "Remarks",
    "paymentEmail": "Payment Email",
    "tdsApplicable": "TDS Applicable",
    "tdsType": "TDS Type",
    "tdsRate": "TDS Rate",
    "bankName": "Bank Name",
    "accountNumber": "Account Number",
    "ifscNumber": "IFSC Number",
    "panDocument": "Pan Document",
    "audited": "Audited",
    "auditedBy": "Audited By",
    "auditedDate": "Audited Date",
    "tdsDocument": "TDS Document",
    "cancelCheque": "Cancel Cheque",
    "msme": "MSME",
    "isMsmeApplicable": "IsMSMEApplicable",
    "isGstCharged": "IsGSTCharged",
    "franchise": "Franchise",
    "integrateWithFinSystem": "Integrate With Fin System"
  }
  //#endregion 
  breadScrums = [
    {
      title: "Vendor Master",
      items: ["Master"],
      active: "Vendor Master",
    }
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  toggleArray = ["isActive"]
  linkArray = []
  addAndEditPath: string;
  viewComponent: any;
  uploadComponent = VendorMasterUploadComponent
  constructor(
    private masterService: MasterService,
    private storage: StorageService,
    private dialog: MatDialog
  ) {
    this.companyCode = this.storage.companyCode;
    this.addAndEditPath = "/Masters/VendorMaster/AddVendorMaster";//setting Path to add data
  }
  ngOnInit(): void {
    this.getVendorDetails();
    // this.viewComponent = VendorMasterViewComponent
    this.csvFileName = "Vendor Details"  //setting csv file Name so file will be saved as per this name
  }
  //#region to get Vendor details
  async getVendorDetails() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "vendor_detail",
      "filter": { companyCode: this.storage.companyCode }
    }
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
    if (res) {
      // Generate srno for each object in the array
      const dataWithSrno = res.data
        .map((obj) => {
          return {
            ...obj,
            // srNo: index + 1,
            vendorName: obj.vendorName.toUpperCase(),
            vendorType: obj.vendorTypeName ? obj.vendorTypeName.toUpperCase() : '',
            eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : ''
          };
        })
        .sort((a, b) => b.vendorCode.localeCompare(a.vendorCode));

      this.csv = dataWithSrno;
      this.tableLoad = false;
    }

  }
  //#endregion

  async isActiveFuntion(det) {
    let vendorCode = det.data.vendorCode;
    // Remove the "_id" field from the form controls
    delete det.data._id;
    delete det.data.srNo;
    delete det.data.eNTDT;
    delete det.data.vendorType;
    det.data['mODDT'] = new Date()
    det.data['mODBY'] = this.storage.userName
    det.data['mODLOC'] = this.storage.branch
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "vendor_detail",
      filter: { vendorCode: vendorCode },
      update: det.data
    };
    const res = await this.masterService.masterPut("generic/update", req).toPromise()
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.getVendorDetails();
    }
  }
  //#region to call upload function
  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getVendorDetails();
    });
  }
  //#endregion

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}