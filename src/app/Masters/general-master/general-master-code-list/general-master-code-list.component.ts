import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { GeneralMasterAddComponent } from '../general-master-add/general-master-add.component';

@Component({
  selector: 'app-general-master-code-list',
  templateUrl: './general-master-code-list.component.html',
})
export class GeneralMasterCodeListComponent {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = [];
  addAndEditPath: string;
  headerCode: string;
  columnHeader = {
    "srNo": "Sr No",
    "codeId": "Code ID",
    "codeDesc": "Description",
    "activeFlag": "Active Status",
    "View": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    "general": "Code ID",
    "description": "Description",
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: this.route.getCurrentNavigation()?.extras?.state?.data.headerDesc + " General Master",
      items: ["Home"],
      active: this.route.getCurrentNavigation()?.extras?.state?.data.headerDesc + " General Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
  viewComponent: any;
  height = '300px';
  width = '600px';
  backPath: string;
  constructor(private masterService: MasterService, private route: Router) {
    if (this.route.getCurrentNavigation()?.extras?.state?.data != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
    }
  }
  public onDialogClosed(result: any): void {
    if (typeof result === 'string') {
      this.data.headerCode = result;
    } else {
      this.data.headerCode = result.value.codeType;
    }
    this.getGeneralDetails();
  }
  ngOnInit(): void {
    this.getGeneralDetails();
    this.addAndEditPath = "/Masters/GeneralMaster/AddGeneralMaster";
    this.backPath = "/Masters/GeneralMaster/GeneralMasterList";
    this.headerCode = this.data?.headerCode;
    this.viewComponent = GeneralMasterAddComponent;
  }
  getGeneralDetails() {
    // Assuming tableData contains the array of objects
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "collectionName": "General_master",
      "filter": {
        "codeType": this.data?.headerCode
      }
    };
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          this.masterService.setValueheaderCode(this.data?.headerCode);
          // Generate srno for each object in the array
          const dataWithSrno = res.data?.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          this.csv = dataWithSrno;
          this.tableLoad = false;
        }
      }
    });
  }

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      type: "masters",
      collectionName: "General_master",
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
          this.getGeneralDetails();
        }
      }
    });
  }
}
