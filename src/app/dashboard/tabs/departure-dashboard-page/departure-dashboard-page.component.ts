import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router } from '@angular/router';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { generateTableData, getShipmentData } from './departureUtils';
@Component({
  selector: 'app-departure-dashboard-page',
  templateUrl: './departure-dashboard-page.component.html'
})

export class DepartureDashboardPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  tableData: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  menuItemflag: boolean = true;
  departure: any;
  @Input() arrivaldeparture: any;
  orgBranch: string = localStorage.getItem("Branch");
  breadscrums = [
    {
      title: "Departure Details",
      items: ["Dashboard"],
      active: "Departure Details"
    }
  ]
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }

  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [
    { Row: 'Action', Path: 'Operation/CreateLoadingSheet' }
  ]
  menuItems = [
    { label: 'Create Trip' },
    { label: 'Update Trip' },
    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [
    'activeFlag',
    'isActive',
    'isActiveFlag',
    'isMultiEmployeeRole'
  ]
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table > 

  columnHeader = {
    "RouteandSchedule": "Route and Schedule",
    "VehicleNo": "Vehicle No",
    "TripID": "Trip ID",
    "Scheduled": "Scheduled",
    "Expected": "Expected",
    "Status": "Status",
    "Hrs": "Hrs.",
    "Action": "Action "
  }

  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "RouteandSchedule": "Route and Schedule",
    "VehicleNo": "Vehicle No",
    "TripID": "Trip ID",
    "Scheduled": "Scheduled",
    "Expected": "STA",
    "Status": "Status",
    "Hrs": "Hrs."
  }
  //#endregion

  IscheckBoxRequired: boolean;
  advancdeDetails: { data: { label: string; data: any; }; viewComponent: any; };
  viewComponent: any;
  shipmentData: any;
  boxData = [];
  loadingSheetData: any;
  departuredata: any[];
  // declararing properties

  constructor(private operationService:OperationService,private Route: Router, private CnoteService: CnoteService) {
    super();
    this.loadingSheetData=this.CnoteService.getLsData();
    this.departure = this.CnoteService.getDeparture();
    this.csvFileName = "departureData.csv";
    this.getdepartureDetail()
  }

  ngOnInit(): void {

    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }

  }
  dailogData(event){
    

  }
  getdepartureDetail() {
    this.operationService.getJsonFileDetails('arrivalUrl').subscribe(res => {
      this.departuredata = res;
      const tableData = generateTableData(this.departuredata, this.orgBranch, this.departure, this.loadingSheetData);
     // Use the generated tableData as needed
     this.tableData = tableData;
      this.getshipmentData();
      this.tableload = false;

    });

  }

  getshipmentData() {
      this.shipmentData = this.departuredata;
      const shipmentResult = getShipmentData(this.shipmentData,this.departure,this.loadingSheetData,this.orgBranch,this.tableData);
      this.boxData = shipmentResult.boxData;
      this.tableload = shipmentResult.tableload;
    
  }


}





