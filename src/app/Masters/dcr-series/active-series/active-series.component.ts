import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DcrAction } from 'src/app/Models/docStatus';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { createShipDataObject } from 'src/app/Utility/commonFunction/dashboard/dashboard';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-active-series',
  templateUrl: './active-series.component.html',
})
export class ActiveSeriesComponent implements OnInit {

  boxdata: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  dynamicControls = {
    add: true,
    edit: false,
    csv: false
  }
  filterColumn: boolean = true;
  allColumnFilter: any;
  toggleArray = []
  METADATA = {
    // checkBoxRequired: true,
    // selectAllorRenderedData: false,
    // noColumnSort: ["checkBoxRequired"],
  };
  linkArray = [{ Row: "action", Path: "/Masters/AddDCR/DCRAllocation" }];
  csv: any[];
  addAndEditPath: string;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any;
  documentWithType: any[] = [];
  jsonUrl = '../../../assets/data/state-countryDropdown.json'
  columnHeader = {
    tYPNM: {
      Title: "Document",
      class: "matcolumncenter",
      Style: "",//min-width:15%
    },
    bOOK: {
      Title: "Book code",
      class: "matcolumncenter",
      Style: "",//min-width:15%
    },
    fROM: {
      Title: "Series from",
      class: "matcolumncenter",
      Style: "",//min-width:15%
    },
    tO: {
      Title: "Series To",
      class: "matcolumncenter",
      Style: "",//min-width:20%
    },
    pAGES: {
      Title: "Allocated",
      class: "matcolumncenter",
      Style: "",//min-width:10%
    },
    uSED: {
      Title: "Used",
      class: "matcolumncenter",
      Style: "",//max-width:95px
    },
    eNTDT: {
      Title: "DCR date",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    aLOCD: {
      Title: "Location",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    aSNTO: {
      Title: "Assign to",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    aSNNM: {
      Title: "Name",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
  };
  staticField = [ "tYPNM", "bOOK", "fROM", "tO", "pAGES", "uSED", "eNTDT","aLOCD","aSNTO","aSNNM"];
  menuItemflag: boolean = true;
  menuItems = [
    { label: "Allocate", route:"/Masters/AddDCR/DCRAllocation", tabIndex: 6, status: "1" },
    { label: "Split", route: "/Masters/AddDCR/DCRAllocation", tabIndex: 6, status: "4" },
    { label: "Reallocate", route: "/Masters/AddDCR/DCRAllocation", tabIndex: 6, status: "4" },
    { label: "Assign", route: "/Masters/AddDCR/DCRAllocation", tabIndex: 6, status: "4" },
    { label: "Void", route: "/Masters/AddDCR/DCRAllocation", tabIndex: 6, status: "4" }
  ];

  statusActions = {
    "1": ["Allocate","Split"],
    "2":["Assign","Reallocate","Split"],
    "3": ["Assign","Reallocate","Split"],
    "4": ["Reallocate","Void"],
    default: [""],
  };
  constructor(private Route: Router,
    private masterService: MasterService,
    private http: HttpClient) { }

  ngOnInit(): void {
    const shipData = [
      createShipDataObject(0, "Active Series", "bg-c-Bottle-light"),
      createShipDataObject(0, "Customer Series", "bg-c-Grape-light"),
      createShipDataObject(0, "Location Series", "bg-c-Bottle-light"),
    ];
    this.addAndEditPath = "/Masters/DocumentControlRegister/AddDCR";//setting Path to add data
    this.boxdata = shipData;
    this.tableLoad = false;
    this.loadDocumentWithType();
    this.getDCRDetails();
  }


  async loadDocumentWithType() {
    try {
      const data = await firstValueFrom(this.http.get<any>(this.jsonUrl));
      if (data && data.documentTypeDropDown) {
        this.documentWithType = data.documentTypeDropDown;
      }
    } catch (error) {
      console.error('Error loading documentWithType:', error);
      // Handle errors here
    }
  }

  async getDCRDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "dcr_header"
    };

   const res= await firstValueFrom(this.masterService.masterPost('generic/get', req));
        if (res) {
          // Sort the data based on updatedDate in descending order
          const sortedData = res.data.sort((a, b) => {
            return new Date(b.mODDT).getTime() - new Date(a.mODDT).getTime();
          });
          const dataWithMappedTypes = sortedData.map((obj, index) => {
            const typeName = this.documentWithType.find(type => type.value === obj.tYP)?.name || obj.tYP;
            return {
              ...obj,
              tYPNM: typeName,// Replace document type with its name
              actions: this.statusActions[`${obj.sTS}`] || this.statusActions.default,
              eNTDT: formatDocketDate(obj.eNTDT)
            };
          });
          // Extract the updatedDate from the first element (latest record)
          this.tableData = dataWithMappedTypes;
          this.csv = this.tableData;
          this.tableLoad = false;
        }
  }
  async handleMenuItemClick(data) {
    if(data.label.route){
    this.Route.navigate([data.label.route], {
      state: {
        data: {data:data.data,label:data.label.label},
      },
    });
  }
  }
  // AddNew(){
  //   this.Route.navigateByUrl("/Masters/AccountMaster/AddAccountGroup");
  // }

}
