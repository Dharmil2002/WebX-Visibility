import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MarkArrivalComponent } from '../../ActionPages/mark-arrival/mark-arrival.component';
import { UpdateLoadingSheetComponent } from 'src/app/operation/update-loading-sheet/update-loading-sheet.component';
import{CnoteService}from 'src/app/core/service/Masters/CnoteService/cnote.service';
@Component({
  selector: 'app-arrival-dashboard-page',
  templateUrl: './arrival-dashboard-page.component.html',
})
export class ArrivalDashboardPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json';
  viewComponent: any;
  advancdeDetails: any;
  arrivalChanged:any;
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  companyCode: number;
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Arrival Details",
      items: ["Dashboard"],
      active: "Arrival Details"
    }
  ]
  height='100vw';
  width='100vw';
  maxWidth:'232vw'
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }

  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
 linkArray = [
  { Row: 'Action',Path:'',componentDetails: MarkArrivalComponent }
]
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
    "VehicleNo": "Vehicle No",
    "Route": "Route",
    "TripID": "Trip ID",
    "Location": "Location",
    "STA": "STA",
    "ETAATA": "ETA/ ATA",
    "Status": "Status",
    "Hrs": "Hrs.",
    "Action": "Action"
  }
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "id": "Sr No",
    "first_name": "First Code",
    "last_name": "Last Name",
    "email": "Email Id",
    "date": "Date",
    "ip_address": "IP Address",
    "address": "Address",
  };
  //#endregion
  menuItems = [
    { label: 'Vehicle Arrival', componentDetails: MarkArrivalComponent, function: "GeneralMultipleView" },
    { label: 'Arrival Scan', componentDetails: UpdateLoadingSheetComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
  ];
  IscheckBoxRequired: boolean;
  boxData: { count: any; title: any; class: string; }[];
  departureDetails: any;
  // declararing properties
  constructor(private http: HttpClient,private CnoteService:CnoteService) {

    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
    this.getArrivalDetails();
  }
  ngOnInit(): void {
    this.viewComponent = MarkArrivalComponent //setting Path to add data

    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }
  getArrivalDetails() {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data;
      const newArray = tableArray.arrivalData.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      this.csv = newArray;
      let packages=0;
      this.data.shippingData.forEach((element,index) => {
        packages=element.Packages+packages
      });
    
      const createShipDataObject = (count, title, className) => ({
        count,
        title,
        class: `info-box7 ${className} order-info-box7`
      });
      
      const shipData = [
        createShipDataObject(this.csv.length, "Vehicles", "bg-danger"),
        createShipDataObject(this.csv.length, "Routes", "bg-info"),
        createShipDataObject(this.data.shippingData.length, "Shipments", "bg-warning"),
        createShipDataObject(packages, "Packages", "bg-warning")
      ];
      
      this.boxData = shipData;
      
      this.tableload = false;

    });

  }
  updateDepartureData(event){

 const result = Array.isArray(event) ? event.find((x) => x.Action === 'Arrival Scan') : null;
 const action = result?.Action ?? '';
    if(action){
      this.csv=event;
    }
   else{
       this.CnoteService.setDeparture(event)
    this.csv=this.csv.filter((x)=>x.TripID!=event.tripID);

   }
  }
  handleMenuItemClick(label: string, element) {
    let Data = { label: label, data: element }
    //  this.menuItemClicked.emit(Data);
    this.advancdeDetails = {
      data: Data,
      viewComponent: this.viewComponent
    }
    return this.advancdeDetails
  }

}