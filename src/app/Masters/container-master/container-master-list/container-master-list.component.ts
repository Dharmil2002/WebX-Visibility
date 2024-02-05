import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-container-master-list',
  templateUrl: './container-master-list.component.html',
})
export class ContainerMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = []
  columnHeader =
    {
      // "srNo": "Sr No.",
      "entryDate": "Created Date",
      "containerCode": "Container Code",
      // "containerName": "Container Name",
      "activeFlag": "Active Status",
      "actions": "Actions"
    }
  headerForCsv = {
    // "srNo": "Sr No.",
    "entryDate": "Created Date",
    "containerCode": "Container Code",
    // "containerName": "Container Name",
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "Container Master",
      items: ["Home"],
      active: "Container Master",
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
    this.addAndEditPath = "/Masters/ContainerMaster/AddContainerTypeMaster";
  }
  ngOnInit(): void {
    this.csvFileName = "Container Master";
    this.getContainerDetails();
  }
  getContainerDetails() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "collectionName": "container_detail",
      "filter": {}
    };

    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {

        if (res && res.data && res.data.length > 0) {
          // Sort the data based on entryDate in descending order
          const sortedData = res.data.sort((a, b) => {
            return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
          });

          // Display the latest record
          const latestRecord = sortedData[0];
          const latestEntryDate = latestRecord.entryDate;

          // You can use the latestRecord object or latestEntryDate as needed for display.

          // If you want to add srNo to each object in the array, you can still do that
          const dataWithSrno = sortedData.map((obj, index) => {
            return {
              ...obj,
              // srNo: index + 1
            };
          });

          this.csv = dataWithSrno;
          this.tableLoad = false;
        }
      }
    });
  }

  isActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "container_detail",
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
          this.getContainerDetails();
        }
      }
    });
  }
}
