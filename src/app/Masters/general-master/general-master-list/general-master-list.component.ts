import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-general-master-list',
  templateUrl: './general-master-list.component.html',
})
export class GeneralMasterListComponent implements OnInit {
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = []
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = [];
  columnHeader = {
    "srNo": "Sr No",
    "headerDesc": "General Master",
    "description": "Description",
    "whereused": "Masters/Forms where used",
    "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    "general": "General Master",
    "description": "Description",
    "formsUsed": "Masters/Forms where used",
  }
  breadScrums = [
    {
      title: "General Master",
      items: ["Home"],
      active: "General Master",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }
  addAndEditPath: string;
  tableData: any[];
  constructor(private masterService: MasterService) { }
  ngOnInit(): void {
    this.addAndEditPath = "/Masters/GeneralMaster/GeneralMasterCodeList";
    this.getGeneralDetails();
  }
  getGeneralDetails() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "collectionName": "CodeTypes",
      "filter": {}
    }
    this.masterService.masterPost('generic/get', req).subscribe({
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
          this.tableLoad = false;
        }
      }
    })
  }
}

