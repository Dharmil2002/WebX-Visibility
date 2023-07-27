import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MarkArrivalComponent } from '../../ActionPages/mark-arrival/mark-arrival.component';
import { UpdateLoadingSheetComponent } from 'src/app/operation/update-loading-sheet/update-loading-sheet.component';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-arrival-dashboard-page',
  templateUrl: './arrival-dashboard-page.component.html',
})
export class ArrivalDashboardPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  viewComponent: any;
  advancdeDetails: any;
  arrivalChanged: any;
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  arrivalTableData: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Arrival Details",
      items: ["Dashboard"],
      active: "Arrival Details"
    }
  ]
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }

  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
  linkArray = [
    { Row: 'Action', Path: '', componentDetails: MarkArrivalComponent }
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
    "Route": "Route",
    "VehicleNo": "Vehicle No",
    "TripID": "Trip ID",
    "Location": "Location",
    "Scheduled": "STA",
    "Expected": "ETA",
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
  isCalled: boolean;
  branch: string = localStorage.getItem("Branch");
  routeDetails: any;
  // declararing properties
  constructor(
    private CnoteService: CnoteService,
    private _operation: OperationService,
    private datePipe: DatePipe
  ) {

    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
    this.getRouteDetail();
  }
  ngOnInit(): void {
    this.viewComponent = MarkArrivalComponent //setting Path to add data

    try {
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }
  getRouteDetail() {
    let reqbody = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "route",
    };
    this._operation.operationPost('common/getall', reqbody).subscribe({
      next: (res: any) => {
        this.routeDetails = res.data;
        this.getArrivalDetails();
      }
    })
  }

  getArrivalDetails() {
    const reqbody =
    {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "trip_detail"
    }
    this._operation.operationPost('common/getall', reqbody).subscribe({
      next: (res: any) => {
        if (res) {

          const arrivalDetails = res.data.filter((x) => x.nextUpComingLoc.toLowerCase() === this.branch.toLowerCase());
          let tableData = [];
          arrivalDetails.forEach(element => {
            //let scheduleTime = new Date(); // Replace this with the actual schedule time
            // Step 1: Create a new Date object for the current date and time
            const currentDate = new Date();
            // Step 2: Add 10 minutes to the Date object for the expected time
            const expectedTime = new Date(currentDate.getTime() + 10 * 60000); // 10 minutes in milliseconds
            // Step 3: Add the transHrs (if required) to the expected time
            // let expectedTimeWithTransHrs = addHours(expectedTime, transHrs);
            // Step 4: Get the schedule time (replace this with your scheduleTime variable)
            const scheduleTime = new Date(); // Replace this line with your actual scheduleTime variable

            // Step 5: Format the dates to strings
            const updatedISOString = expectedTime.toISOString();
            const scheduleTimeISOString = scheduleTime.toISOString();

            let routeDetails = this.routeDetails.find((x) => x.routeCode == element.routeCode);
            const routeCode = routeDetails?.routeCode ?? 'Unknown';
            const routeName = routeDetails?.routeName ?? 'Unnamed';
            let arrivalData = {
              "Route": routeCode + ":" + routeName,
              "VehicleNo": element?.vehicleNo || '',
              "TripID": element?.tripId || '',
              "Location": this.branch,
              "Scheduled":this.datePipe.transform(scheduleTimeISOString,'dd/MM/yyyy HH:mm'),
              "Expected": this.datePipe.transform(updatedISOString,'dd/MM/yyyy HH:mm'),
              "Status": "On Time",
              "Hrs": 0,
              "Action": element?.status === "depart" ? "Vehicle Arrival" : "Arrival Scan"
            }
            tableData.push(arrivalData);
          });
          this.fetchShipmentData();
          this.arrivalTableData = tableData;
          this.tableload = false;


        }
      }
    })
  }
  /**
    * Fetches shipment data from the API and updates the boxData and tableload properties.
    */
  fetchShipmentData() {

    // Prepare request payload
    let req = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
    };

    // Send request and handle response
    this._operation.operationPost("common/getall", req).subscribe({
      next: async (res: any) => {
        // Update shipmentData property with the received data
        const boxData = res.data.filter((x) => x.destination.split(":")[1].trim() === this.branch.trim() && x.unloading === 0 && x.mfNo !== '');
        const sumTotalChargedNoOfpkg = boxData.reduce((total, count) => {
          return total + parseInt(count.totalChargedNoOfpkg);
        }, 0);


        const createShipDataObject = (count, title, className) => ({
          count,
          title,
          class: `info-box7 ${className} order-info-box7`
        });

        const shipData = [
          createShipDataObject(this.arrivalTableData.length, "Routes", "bg-white"),
          createShipDataObject(this.arrivalTableData.length, "Vehicles", "bg-white"),
          createShipDataObject(boxData.length, "Shipments", "bg-white"),
          createShipDataObject(sumTotalChargedNoOfpkg, "Packages", "bg-white")
        ];

        this.boxData = shipData;
      },
    });
  }
  updateDepartureData(event) {

    const result = Array.isArray(event) ? event.find((x) => x.Action === 'Arrival Scan') : null;
    const action = result?.Action ?? '';
    if (action) {
      this.arrivalTableData = event;
    }
    else {
      this.CnoteService.setDeparture(event)
      if (event) {
        this.arrivalTableData = this.arrivalTableData.filter((x) => x.TripID != event.tripID);
        /*Here Function is Declare for get Latest arrival Data*/
        let arrivalData = {
          arrivalData: this.arrivalTableData,
          packagesData: this.data?.packagesData || "",
          shippingData: this.data?.shippingData || ""
        }
        this.CnoteService.setVehicleArrivalData(arrivalData);
        /*End*/
      }

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