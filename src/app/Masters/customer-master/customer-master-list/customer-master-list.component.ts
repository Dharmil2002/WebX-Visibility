import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-customer-master-list',
  templateUrl: './customer-master-list.component.html',
})
export class CustomerMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = []
  columnHeader = {
    "updatedDate": "Created Date",
    "customerGroup": "Customer Group",
    "customerCode": "Customer Code",
    "customerName": "Customer Name",
    "activeFlag": "Active Status",
    "actions": "Actions"
  };

  headerForCsv = {
  "companyCode": "companyCode",
  "updatedDate": "Created Date",
  "customerCode": "Customer Code",
  "customerGroup": "Customer Group",
  "customerName": "Customer Name",
  "CustomerCategory": "Customer Category",
  "customerLocations": "Customer Locations",
  "Customer_Emails": "Customer E-mails",
  "ERPcode": "ERP code",
  "PANnumber": "PAN No",
  "CINnumber": "CIN number",
  "RegisteredAddress":"Registered Address",
  "PinCode": "Pin Code",
  "city": "City",
  "state": "State",
  "Country": "Country",
  "MSMENumber":"MSME Number",
  "gstNo": "GST Number",
  "gstState":"GST State",
  "gstPinCode":"GST Pin Code",
  "gstCity":"GST City",
  "gstAddres": "GST Address",
  "BlackListed": "Black Listed",
  "activeFlag":"Active Status",
  }

  breadScrums = [
    {
      title: "Customer Master",
      items: ["Home"],
      active: "Customer Master",
    },
  ];

  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }

  addAndEditPath: string;
  tableData: any;
  csvFileName: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/CustomerMaster/AddCustomerMaster";
  }

  ngOnInit(): void {
    this.csvFileName = "Customer Details";
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "customer_detail"
    };

    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Sort the data based on updatedDate in descending order
          const sortedData = res.data.sort((a, b) => {
            return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
          });

          // Generate srno for each object in the array
          const dataWithDate = sortedData.map((obj, index) => {
            return {
              ...obj,
              customerGroup: obj.customerGroup,
              customerCode: obj.customerCode,
              customerName: obj.customerName.toUpperCase()
            };
          });

          // Extract the updatedDate from the first element (latest record)
          const latestUpdatedDate = sortedData.length > 0 ? sortedData[0].updatedDate : null;

          // Use latestUpdatedDate as needed

          this.csv = dataWithDate;
          this.tableData = dataWithDate;
          this.tableLoad = false;
        }
      }
    });
  }

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    // delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customer_detail",
      filter: { _id: id },
      update: det
    };
    this.masterService.masterPut('generic/update', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.getCustomerDetails();
        }
      }
    });
  }
}
