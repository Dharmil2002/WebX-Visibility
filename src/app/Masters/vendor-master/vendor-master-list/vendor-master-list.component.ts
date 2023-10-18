import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { VendorMasterViewComponent } from "../vendor-master-view/vendor-master-view.component";
import Swal from "sweetalert2";
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
      'entryDate': 'Created Date',
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
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/VendorMaster/AddVendorMaster";//setting Path to add data
  }
  ngOnInit(): void {
    this.getVendorDetails();
   // this.viewComponent = VendorMasterViewComponent
    this.csvFileName = "Vendor Details"  //setting csv file Name so file will be saved as per this name
  }
  async getVendorDetails() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "vendor_detail",
      "filter": {}
    }
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    if (res) {
      // Generate srno for each object in the array
      const dataWithSrno = res.data.map((obj, index) => {
        return {
          ...obj,
         // srNo: index + 1,
          vendorName: obj.vendorName.toUpperCase(),
          vendorType: obj.vendorType.toUpperCase()
        };
      });
      const sortedData = dataWithSrno.sort((a, b) => {
        const dateA: Date | any = new Date(a.entryDate);
        const dateB: Date | any = new Date(b.entryDate);

        // Compare the date objects
        return dateB - dateA; // Sort in descending order
      });
      this.csv = sortedData;
      this.tableLoad = false;
    }
  }
  async isActiveFuntion(det) {
    let id = det._id;
    // Remove the "_id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "vendor_detail",
      filter: { _id: id },
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