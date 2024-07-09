import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
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
  csvFileName: string;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader = {
    eNTDT: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:15%",
      // datatype: "date"
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
    "eNTDT": "Created Date",
    "vendorCode": "Vendor Code",
    "vendorName": "Vendor Name",
    "vendorManager": "Vendor Manager",
    "vendorTypeName": "Vendor Type Name",
    "vendorAddress": "Vendor Address",
    "vendorLocation": "Vendor Location",
    "vendorPinCode": "Vendor Pin Code",
    "vendorCity": "Vendor City",
    "vendorState": "Vendor State",
    "vendorCountry": "Vendor Country",
    "vendorPhoneNo": "Vendor Phone No",
    "emailId": "Vendor Email ID",
    "panNo": "PAN No",
    "cinNumber": "Cin Number",
    "itrnumber": "ITR Number",
    "dateofFilling": "Date of Filling",
    "financialYear": "financialYear",
    "vendorAdvance": "Vendor Advance",
    "msmeRegistered": "MSME Registered",
    "isBlackListed": "Black Listed",
    "isLowRateApplicable": "Low TDS Rate Applicable",
    "hTDSRA": "High TDS Rate Applicable",
    "isGSTregistered": "GST Registered",
    "isBankregistered": "Bank Registered",
    "msmeNumber": "MSME Number",
    "msmeTypeName": "MSME Type Name",
    "effectiveFrom": "Effective From",
    "validUpto": "Valid Upto",
    "lowTDSLimit": "Low TDS Limit",
    "tdsSectionName": "TDS Section Name",
    "isTDSDeclaration": "TDS Declaration",
    "bankACNumber": "Bank Account No",
    "ifscCode": "IFSC Code",
    "bankName": "Bank Name",
    "bankBrachName": "Bank Branch Name",
    "city": "City",
    "upiId": "UPI Id",
    "contactPerson": "Contact Person",
    "mobileNumber": "Mobile Number",
    "emails": "E-mail id",
    "gstNumber0": "GST Number",
    "gstState0": "GST State",
    "gstPincode0": "GST Pincode",
    "gstCity0": "GST City",
    "gstAddress0": "GST Address",
    "isActive": "Active Flag"
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
  csvFileData: any;
  constructor(
    private masterService: MasterService,
    private storage: StorageService,
    private dialog: MatDialog
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
    try {
      // Prepare the request object
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "vendor_detail",
        filter: { companyCode: this.storage.companyCode }
      };

      // Make the API call using firstValueFrom for the first emitted value
      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));

      if (res && res.data) {
        // Map, transform, and sort data
        const dataWithSrno = res.data.map(item => {
          const transformedItem = {
            ...item,
            vendorName: item.vendorName.toUpperCase(),
            vendorType: item.vendorTypeName ? item.vendorTypeName.toUpperCase() : '',
            eNTDT: item.eNTDT ? formatDocketDate(item.eNTDT) : ''
          };

          // Extract details from otherdetails if available
          if (item.otherdetails && item.otherdetails.length > 0) {
            const detail = item.otherdetails[0]; // Take the first element
            transformedItem.gstNumber0 = detail.gstNumber || '';
            transformedItem.gstState0 = detail.gstState || '';
            transformedItem.gstAddress0 = detail.gstAddress || '';
            transformedItem.gstPincode0 = detail.gstPincode || '';
            transformedItem.gstCity0 = detail.gstCity || '';
          }

          return transformedItem;
        }).sort((a, b) => b.vendorCode.localeCompare(a.vendorCode));

        // Assign transformed data to this.csv excluding gst details
        this.csv = dataWithSrno.map(item => ({
          ...item,
          // Exclude gst details from csv
          gstNumber0: undefined,
          gstState0: undefined,
          gstAddress0: undefined,
          gstPincode0: undefined,
          gstCity0: undefined
        }));

        // Assign transformed data to this.modifiedData including gst details
        this.csvFileData = dataWithSrno;

      } else {
        console.error('Response or data is empty.');
        // If response or data is empty, you might handle this case accordingly.
        this.csv = []; // Set this.csv to an empty array or handle as per your application's logic
        this.csvFileData = []; // Set this.modifiedData to an empty array or handle as per your application's logic
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      throw error; // Propagate the error for higher-level handling
    } finally {
      // Perform any final actions here, such as updating flags or variables
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