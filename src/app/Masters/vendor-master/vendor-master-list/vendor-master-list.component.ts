import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { VendorMasterViewComponent } from "../vendor-master-view/vendor-master-view.component";
@Component({
  selector: 'app-vendor-master-list',
  templateUrl: './vendor-master-list.component.html',
})
export class VendorMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  csvFileName: string;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader =
    {
      "srNo": "Sr No.",
      "vendorCode": "Vendor Code",
      "vendorName": "Vendor Name",
      "vendorType": "Vendor Type",
      "isActive": "Active",
      "actions": "Actions",
      "view": "View"
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
          "sys21Code": "Sys 21 Code",
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
          "entryBy": "Entry By",
          "entryDate": "Entry Date",
          "tdsDocument": "TDS Document",
          "cancelCheque": "Cancel Cheque",
          "msme": "MSME",
          "isMsmeApplicable": "IsMSMEApplicable",
          "editedBy": "Edited By",
          "editedDate": "Edited Date",
          "isGstCharged": "IsGSTCharged",
          "franchise": "Franchise",
          "sapCode": "SAPCode",
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
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/VendorMaster/AddVendorMaster";//setting Path to add data
  }
  ngOnInit(): void {
    this.getVendorDetails();
    this.viewComponent = VendorMasterViewComponent
    this.csvFileName = "Vendor Details"  //setting csv file Name so file will be saved as per this name
  }
  getVendorDetails() {
    // Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.data = res;
      this.csv = this.data['vendorMasterData']
      this.tableLoad = false;
    }
    );
  }
} 
