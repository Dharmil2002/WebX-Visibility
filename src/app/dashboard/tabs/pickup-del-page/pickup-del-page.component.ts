import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
@Component({
  selector: 'app-pickup-del-page',
  templateUrl: './pickup-del-page.component.html'
})
export class PickupDelPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/create-runsheet-data.json'
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
    { Row: 'Action', Path: 'Operation/CreateRunSheet' }
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
    "Cluster": "Delivery Cluster",
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
  boxData: { count: any; title: any; class: string; }[];
  // declararing properties

  constructor(private http: HttpClient, private Route: Router) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }

    //.uploadComponent = undefined;
  }

  ngOnInit(): void {
    this.getRunSheetDetails();
  }
  getRunSheetDetails() {
    // Fetch data from the JSON endpoint
    this.http.get(this.jsonUrl).subscribe((res: any) => {
      this.data = res;
  
      // Extract relevant data arrays from the response
      const tableArray = this.data['GenerateData'];
      const shippingData = this.data['RunsheetData'];
      const pickUpData: any[] = [];
  
      // Iterate over each element in tableArray
      for (const element of tableArray) {
        // Filter shippingData for delivery and pickup details of the current cluster
        const shippingDetailsForDelivery = shippingData.filter(
          (x: any) => x.Cluster === element.Cluster && x.Type === 'Delivery'
        );
        const pickupRequests = shippingData.filter(
          (x: any) => x.Cluster === element.Cluster && x.Type === 'Pickup'
        );
  
        // Calculate total weight and total CFT for the delivery shipments
        const totalWeight = shippingDetailsForDelivery.reduce(
          (total: number, shipment: any) => total + shipment.Weight,
          0
        );
        
        const totalCFT = shippingDetailsForDelivery.reduce(
          (total: number, shipment: any) => total + shipment.Volume,
          0
        );
  
        // Prepare an object with the required data for the current cluster
        const clusterData = {
          Cluster: element.Cluster,
          DeliveryShipments: shippingDetailsForDelivery.length,
          PickupRequests: pickupRequests.length,
          TotalWeight: totalWeight,
          CFT: totalCFT,
          Action: element.Action,
        };
  
        // Add the cluster data to pickUpData array
        pickUpData.push(clusterData);
      }
  
      // Store the pickUpData in csv property
      this.csv = pickUpData;
  
      // Create shipData objects for displaying summary information
      const createShipDataObject = (count: number, title: string, className: string) => ({
        count,
        title,
        class: `info-box7 ${className} order-info-box7`,
      });
  
      // Filter shippingData for delivery and pickup details
      const deliveryShipments = shippingData.filter((x: any) => x.Type === 'Delivery');
      const pickupRequests = shippingData.filter((x: any) => x.Type === 'Pickup');
  
      // Prepare the shipData array with summary information
      const shipData = [
        createShipDataObject(this.csv.length, "Clusters", "bg-danger"),
        createShipDataObject(deliveryShipments.length, "Shipments for Delivery", "bg-info"),
        createShipDataObject(pickupRequests.length, "Pickup Requests", "bg-warning"),
      ];
  
      // Store the shipData in boxData property
      this.boxData = shipData;
  
      // Set tableload flag to false to indicate that the table has finished loading
      this.tableload = false;
    });
  }
  
  


  
  handleMenuItemClick(label: any, element) {

    this.Route.navigate(['Operation/CreateRunSheet'], {
      state: {
        data: label.data,
      },
    });

  }

}
