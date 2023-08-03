import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralMaster } from 'src/app/core/models/Masters/general-master';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-general-master-code-list',
  templateUrl: './general-master-code-list.component.html',
})
export class GeneralMasterCodeListComponent {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  generalTable: GeneralMaster
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = [];
  addAndEditPath: string;
  tableData: any[];
  headerCode: string;
  IsUpdate: any;
  action: string;
  res: any;
  GeneralTable: GeneralMaster;
  columnHeader = {
    "srNo": "Sr No",
    "codeId": "Code ID",
    "codeDesc": "Description",
    "activeFlag": "Active Status",
    "actions": "Actions"

  };
  headerForCsv = {
    "srNo": "Sr No",
    "general": "Code ID",
    "description": "Description",
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "General Master",
      items: ["Home"],
      active: "General Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
 
  constructor(private masterService: MasterService, private route: Router,
  ) {
    this.addAndEditPath = "/Masters/GeneralMaster/AddGeneralMaster";
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;

    }
  }
  ngOnInit(): void {
    this.getGeneralDetails();
  }
  getGeneralDetails() {
    // Assuming tableData contains the array of objects
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "General_master",
      "query": {
        "codeType": this.data.headerCode
      }
    };

    this.masterService.masterPost('common/getOne', req).subscribe({
      next: (res: any) => {
        if (res) {
          this.masterService.setValueheaderCode(this.data.headerCode);
          // Generate srno for each object in the array
          const dataWithSrno = res.data.db.data.General_master.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          this.csv = dataWithSrno;
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      }
    });
  }

  IsActiveFuntion(det) {
    let id = det.id;
    // Remove the "id" field from the form controls
    delete det.id;
    //  delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      type: "masters",
      collection: "General_master",
      id: id,
      updates: det
    };
    this.masterService.masterPut('common/update', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
        }
      }
    });
  }
}
