import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MarkArrivalComponent } from '../../ActionPages/mark-arrival/mark-arrival.component';
import { UpdateStockComponent } from '../../ActionPages/update-stock/update-stock.component';
import { MarkArrivalControl } from 'src/assets/FormControls/MarkArrival';

@Component({
  selector: 'app-arrival-dashboard-page',
  templateUrl: './arrival-dashboard-page.component.html',
})
export class ArrivalDashboardPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json';
  viewComponent: any;
  advancdeDetails: any;
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
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }

  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
  linkArray = [
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
    "actions": "Action"
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
    { label: 'Mark Arrival', componentDetails: MarkArrivalComponent, function: "GeneralMultipleView" },
    { label: 'Update Stock', componentDetails: UpdateStockComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
  ];
  IscheckBoxRequired: boolean;
  width: string;
  height: string;
  // declararing properties
  constructor(private http: HttpClient) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
  }
  ngOnInit(): void {
    this.width = "800px"
    this.height = "400px"
    this.viewComponent = MarkArrivalComponent //setting Path to add data
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['data'];
      const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      this.csv = newArray;
      this.tableload = false;
    });
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
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