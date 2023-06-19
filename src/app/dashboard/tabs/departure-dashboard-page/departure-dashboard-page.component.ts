import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router } from '@angular/router';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
@Component({
  selector: 'app-departure-dashboard-page',
  templateUrl: './departure-dashboard-page.component.html'
})

export class DepartureDashboardPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/departureDetails.json'
  jsonDeparturUrl = '../../../assets/data/arrival-dashboard-data.json';
  loadingSheetJsonUrl = '../../../assets/data/shipmentDetails.json'
  
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  csv: any[];
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
  // declararing properties

  constructor(private http: HttpClient, private Route: Router, private CnoteService: CnoteService) {
    super();
    this.loadingSheetData=this.CnoteService.getLsData();
    this.departure = this.CnoteService.getDeparture();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'

    //.uploadComponent = undefined;
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
    this.http.get(this.jsonDeparturUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['arrivalData'].filter((x)=>x.module==='Departure');
      const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      //let departure= newArray.filter((x) => x.ArrivalLocation === this.orgBranch);
      let dataDeparture: { [key: string]: string }[] = [];// Initialize dataDeparture as an empty array
      const { format } = require('date-fns');
      newArray.forEach(element => {
        let jsonDeparture = {
          RouteandSchedule: element?.Route || '',
          VehicleNo: element?.VehicleNo || '',
          TripID: element?.TripID || '',
          Scheduled: format(new Date(), 'dd-MM-yy HH:mm'),
          Expected: format(new Date(), 'dd-MM-yy HH:mm'),
          Status: element?.Status || 'OnTime',
          Hrs: element?.Hrs || '0:00',
          VehicleType: element?.VehicleType || '',
          Action: element.TripID!=''?'Update Trip':'Create Trip',
          location: element?.ArrivalLocation || '',
          Leg: element?.Leg || ''
        };
        dataDeparture.push(jsonDeparture);
      });
      this.csv=dataDeparture;

      if (this.departure) {
        let currentDate = new Date();
        let formattedDate = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
        let formattedTime = currentDate.getHours() + ':' + currentDate.getMinutes();

        let formattedDateTime = formattedDate + ' ' + formattedTime;
        let jsonDeparture = {
        RouteandSchedule: this.departure?.Route || '',
        VehicleNo: this.departure?.vehicle || '',
        TripID: this.departure?.tripID || '',
        Scheduled:formattedDateTime,
        Expected: formattedDateTime,
        Status: "SCHEDULED",
        Hrs: "17:30",
        VehicleType: "CANTER 1080",
        Action: "Update Trip",
        location: this.departure?.LoadingLocation || '',
        Leg:this.departure?.Leg || ''
      }
      this.csv.push(jsonDeparture)
    }
      if(this.loadingSheetData){
        // Use the `map()` function along with the `filter()` function to replace the object
        // this.csv = this.csv.map(item => {
        //   if (item.RouteandSchedule === this.loadingSheetData[0].RouteandSchedule) {
        //     return this.loadingSheetData[0];
        //   }
        //   return item;
        // });
        this.csv=this.csv.filter((x)=>x.RouteandSchedule!=this.loadingSheetData[0].RouteandSchedule)
        console.log(this.loadingSheetData);
        this.csv.push(this.loadingSheetData[0]);
      }
      this.getshipmentData();
      this.tableload = false;

    });
    
    // if (this.departure) {
    //   let currentDate = new Date();
    //   let formattedDate = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
    //   let formattedTime = currentDate.getHours() + ':' + currentDate.getMinutes();

    //   let formattedDateTime = formattedDate + ' ' + formattedTime;
    //   if (!this.csv) {
    //     this.csv = [];
    //   }
    //   let jsonDeparture = {
    //     RouteandSchedule: this.departure?.Route || '',
    //     VehicleNo: this.departure?.vehicle || '',
    //     TripID: this.departure?.tripID || '',
    //     Scheduled:formattedDateTime,
    //     Expected: formattedDateTime,
    //     Status: "SCHEDULED",
    //     Hrs: "17:30",
    //     VehicleType: "CANTER 1080",
    //     Action: "Update Trip",
    //     location: this.departure?.LoadingLocation || '',
    //     Leg:this.departure?.Leg || ''
    //   }
    //   this.csv.push(jsonDeparture)
    // }


  }
  handleMenuItemClick(label: any, element) {

    this.Route.navigate(['Operation/CreateLoadingSheet'], {
      state: {
        data: label.data,
      },
    });

  }
  getshipmentData() {

    this.http.get(this.jsonDeparturUrl).subscribe(res => {
      this.shipmentData = res;
      let shipPackage = 0
      let shipmat = 0
      let shipmentFilter;
      if(this.departure||this.loadingSheetData){
       shipmentFilter = this.shipmentData.shippingData.filter(x => x.Origin === (this.departure ? this.departure.LoadingLocation : this.loadingSheetData[0]?.location) && x.Leg === (this.departure ? this.departure.Leg : this.loadingSheetData[0]?.Leg));
      }
      else{
         shipmentFilter = this.shipmentData.shippingData.filter((x) => x.Origin === this.orgBranch);
      }
      shipmentFilter.forEach((element, index) => {
        shipPackage = element.Packages + shipPackage
        shipmat = index + shipmat
      });

      const createShipDataObject = (count, title, className) => ({
        count,
        title,
        class: `info-box7 ${className} order-info-box7`
      });

      const shipData = [
        createShipDataObject(this.csv.length, "Vehicles", "bg-danger"),
        createShipDataObject(this.csv.length, "Routes", "bg-info"),
        createShipDataObject(this.csv.length, "Shipments", "bg-warning"),
        createShipDataObject(shipPackage, "Packages", "bg-warning")
      ];

      this.boxData = shipData;

      //this.csv = this.shipmentData.shipmentData.filter((x) => x.RouteandSchedule == this.tripData.RouteandSchedule);
      //this.csv 
      this.tableload = false;
    })
  }

  //   let Data = { label: label, data: element }
  //   //  this.menuItemClicked.emit(Data);
  //   this.advancdeDetails = {
  //     data: Data,
  //     viewComponent: this.viewComponent
  //   }
  //   return this.advancdeDetails
  // }
}





