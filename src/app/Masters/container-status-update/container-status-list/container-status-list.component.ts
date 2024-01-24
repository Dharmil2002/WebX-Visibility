import { Component, OnInit } from '@angular/core';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { ContainerMasterService } from 'src/app/Utility/module/operation/container-master/container-master-service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-container-status-list',
  templateUrl: './container-status-list.component.html'
})
export class ContainerStatusListComponent implements OnInit {
  breadScrums = [
    {
      title: "Container Status List",
      items: ["Master"],
      active: "Container Status",
    },
  ];
  tableLoad:boolean=true;
  addAndEditPath: string = 'Masters/Container/Status/Add';
  data: [] | any;
  // Metadata for the table
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  // Array to store table data
  tableData: any[];
  linkArray:[];
  // Array of links for actions
  // Configuration for dynamic controls
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  // Column headers for the table
  columnHeader = {
    cNID: {
      Title: "Container No",
      class: "matcolumncenter",
      Style: "min-width:170px"
    },
    cNTYPNM: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "",
    },
    vNTYPNM: {
      Title: "Vendor Type",
      class: "matcolumncenter",
      Style: "",
    },
    sTSNM: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "",
    },
    dKTNO: {
      Title: "Consigment No",
      class: "matcolumncenter",
      Style: "",
    },
    rAKENO: {
      Title: "Rake No",
      class: "matcolumncenter",
      Style: "",
    },
    lastUpdated: {
      Title: "Last Updated On",
      class: "matcolumncenter",
      Style: "",
    }
  };

  // List of static fields
  staticField = [
    "cNID",
    "cNTYPNM",
    "vNTYPNM",
    "sTSNM",
    "dKTNO",
    "rAKENO",
    "lastUpdated"
  ];

  constructor(
    private containerMasterService:ContainerMasterService,
    private storage:StorageService
    ) { }

  ngOnInit(): void {
    this.getContainerData()
  }
  async getContainerData(){
    const data = await this.containerMasterService.getContainerList({cID:this.storage.companyCode});
    this.tableData=data.data.map((x)=>{
      return {
        ...x,
        lastUpdated:x.mODDT?formatDocketDate(x.mODDT):formatDocketDate(x.eNTDT)
      }
    })
    this.tableLoad=false;
   
  }
}
