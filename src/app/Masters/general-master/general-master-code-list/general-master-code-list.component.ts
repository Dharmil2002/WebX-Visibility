import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-general-master-code-list',
  templateUrl: './general-master-code-list.component.html',
})
export class GeneralMasterCodeListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = [];

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
  addAndEditPath: string;
  tableData:any[];
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/GeneralMaster/AddGeneralMaster";
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.getGeneralDetails();
  }
  getGeneralDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "General_master"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          this.csv = dataWithSrno
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      }
    })
  }
}