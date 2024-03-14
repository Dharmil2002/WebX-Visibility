import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  menuItems = []
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
    tYP: {
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
    Location: {
      Title: "Location",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    allocatedto: {
      Title: "Allocated to",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    name: {
      Title: "Name",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    action: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
  };

  staticField = [ "tYP", "bOOK", "fROM", "tO", "pAGES", "uSED", "eNTDT"];

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

  loadDocumentWithType() {
    this.http.get<any>(this.jsonUrl).subscribe(
      data => this.documentWithType = data.documentTypeDropDown,
      error => console.error('Error loading documentWithType:', error)
    );
  }

  getDCRDetails() {
    debugger
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "dcr_header"
    };

    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Sort the data based on updatedDate in descending order
          const sortedData = res.data.sort((a, b) => {
            return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
          });
          const dataWithMappedTypes = sortedData.map((obj, index) => {
            const typeName = this.documentWithType.find(type => type.value === obj.tYP)?.name || obj.tYP;
            return {
              ...obj,
              tYP: typeName,// Replace document type with its name
              action:obj.sTS == 1 ? "Allocate" : '',
              eNTDT: formatDocketDate(obj.eNTDT)
            };
          });

          // Extract the updatedDate from the first element (latest record)
          const latestUpdatedDate = sortedData.length > 0 ? sortedData[0].updatedDate : null;

          // Use latestUpdatedDate as needed

          this.tableData = dataWithMappedTypes;
          this.csv = this.tableData;
          this.tableLoad = false;
        }
      }
    });
  }

  // AddNew(){
  //   this.Route.navigateByUrl("/Masters/AccountMaster/AddAccountGroup");
  // }

}
