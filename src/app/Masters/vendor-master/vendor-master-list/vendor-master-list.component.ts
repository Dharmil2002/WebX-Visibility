import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { PayBasisdetailFromApi } from "../../Customer Contract/CustomerContractAPIUtitlity";
import { StorageService } from "src/app/core/service/storage.service";
@Component({
  selector: 'app-vendor-master-list',
  templateUrl: './vendor-master-list.component.html',
})
export class VendorMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  csvFileName: string;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader =
    {
      'eNTDT': 'Created Date',
      "vendorCode": "Vendor Code",
      "vendorName": "Vendor Name",
      "vendorType": "Vendor Type",
      "isActive": "Active",
      "actions": "Actions",
      //"view": "View"
    }
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
  constructor(
    private masterService: MasterService,
    private storage:StorageService
    ) {
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
      "filter": {companyCode:this.storage.companyCode}
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
    let vendorCode = det.vendorCode;
    // Remove the "_id" field from the form controls
    delete det._id;
    delete det.srNo;
    delete det.eNTDT;
    delete det.vendorType;
    det['mODDT'] = new Date()
    det['mODBY'] = localStorage.getItem("UserName")
    det['mODLOC'] = localStorage.getItem("Branch")
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "vendor_detail",
      filter: { vendorCode: vendorCode },
      update: det
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
}