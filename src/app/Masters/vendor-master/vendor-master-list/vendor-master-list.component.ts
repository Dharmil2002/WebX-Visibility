import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import moment from "moment";
import { firstValueFrom } from "rxjs";
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
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/VendorMaster/AddVendorMaster";//setting Path to add data
  }
  ngOnInit(): void {
    this.getVendorDetails();
    this.csvFileName = "Vendor Details"  //setting csv file Name so file will be saved as per this name
  }
  //#region to get vendor list
  async getVendorDetails() {
    try {
      const req = {
        "companyCode": this.companyCode,
        "collectionName": "vendor_detail",
        "filter": {}
      };

      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
      const vendorTypeData = await this.fetchData();

      // Generate srno for each object in the array
      const dataWithSrno = res.data
        .map((obj) => {
          const vendorType = vendorTypeData.find(x => parseInt(x.value) === obj.vendorType);

          return {
            ...obj,
            vendorName: obj.vendorName.toUpperCase(),
            vendorType: vendorType ? vendorType.name.toUpperCase() : '',
            eNTDT: moment(obj.eNTDT).format('DD-MM-YYYY HH:mm')
          };
        })
        .sort((a, b) => b._id.localeCompare(a._id));

      this.csv = dataWithSrno;
      this.tableLoad = false;

    } catch (error) {
      console.error("Error in getVendorDetails:", error);
    }
  }
  async fetchData() {
    const { vendorTypeDropdown }: any = await this.masterService.getJsonFileDetails('dropDownUrl').toPromise();
    // Use vendorTypeDropdown here or return it
    return vendorTypeDropdown;
  }
  //#endregion
  //#region to manage active flag
  async isActiveFuntion(det) {
    let id = det._id;
    // Remove the "_id" field from the form controls
    delete det._id;
    delete det.srNo;
    det['mODDT'] = new Date()
    det['mODBY'] = localStorage.getItem("UserName")
    det['mODLOC'] = localStorage.getItem("Branch")
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "vendor_detail",
      filter: { _id: id },
      update: det
    };
    const res = await firstValueFrom(this.masterService.masterPut("generic/update", req));
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
  //#endregion
}