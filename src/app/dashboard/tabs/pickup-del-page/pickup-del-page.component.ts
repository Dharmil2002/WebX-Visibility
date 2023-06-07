import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
@Component({
  selector: 'app-pickup-del-page',
  templateUrl: './pickup-del-page.component.html'
})
export class PickupDelPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/deliveryPlanner.json'
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
      title: "Pickup and Delivery Planner",
      items: ["Dashboard"],
      active: "Pickup and Delivery Planner"
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
    { label: 'Create Run Sheet' },
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
    "DeliveryCluster": "Delivery Cluster",
    "DeliveryShipments": "Delivery Shipments",
    "PickupRequests": "Pick up Requests",
    "TotalWeight": "Total Weight",
    "CFT": "CFT",
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
    "DeliveryCluster": "Delivery Cluster",
    "DeliveryShipments": "Delivery Shipments",
    "PickupRequests": "Pick up Requests",
    "TotalWeight": "Total Weight",
    "CFT": "CFT",
  }
  //#endregion

  IscheckBoxRequired: boolean;
  advancdeDetails: { data: { label: string; data: any; }; viewComponent: any; };
  viewComponent: any;
  // declararing properties

  constructor(private http: HttpClient, private Route: Router) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
    //.uploadComponent = undefined;
  }

  ngOnInit(): void {

    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['data'];
      const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      this.csv = newArray;
      // console.log(this.csv);
      this.tableload = false;

    });
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }

  }
  handleMenuItemClick(label: any, element) {

    this.Route.navigate(['Operation/CreateLoadingSheet'], {
      state: {
        data: label.data,
      },
    });

  }

}
