import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MarkArrivalComponent } from '../../ActionPages/mark-arrival/mark-arrival.component';
import { UpdateLoadingSheetComponent } from 'src/app/operation/update-loading-sheet/update-loading-sheet.component';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/core/service/storage.service';
import { firstValueFrom } from 'rxjs';
import { ArrivalVehicleService } from 'src/app/Utility/module/operation/arrival-vehicle/arrival-vehicle.service';
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
    "VehicleNo": "Veh No",
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
  columnWidths = {
    'Route': 'min-width:20%',
    'TripID': 'min-width:20%',
    'Location': 'min-width:1%',
  };
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
    private datePipe: DatePipe,
    private storage:StorageService,
    private depatureService: ArrivalVehicleService
  ) {

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
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }
  // getRouteDetail() {
  //   let reqbody = {
  //     companyCode: this.companyCode,
  //     collectionName: "route",
  //     filter:{}
  //   };
  //   this._operation.operationMongoPost('generic/get', reqbody).subscribe({
  //     next: (res: any) => {
  //       this.routeDetails = res.data;
  //       this.getArrivalDetails();
  //     }
  //   })
  // }

  async getArrivalDetails() {
  
    const reqbody =
    {
      "companyCode": this.companyCode,
      "collectionName": "trip_Route_Schedule",
      "filter":{nXTLOC:this.storage.branch,cID:this.companyCode}
    }
    const res=await firstValueFrom(this._operation.operationMongoPost('generic/get', reqbody));
          let tableData = [];
          if(res.data.length>0){
            res.data.forEach(element => {
            const currentDate = new Date();
            /*here  the of schedule is not avaible so i can trying to ad delay manually*/
            const expectedTime = new Date(currentDate.getTime() + 10 * 60000); // 10 minutes in milliseconds
            const scheduleTime = new Date(); // Replace this line with your actual scheduleTime variable
            const updatedISOString = expectedTime.toISOString();
            const scheduleTimeISOString = scheduleTime.toISOString();
            const diffScheduleTime = new Date(updatedISOString); // Replace 'element.scheduleTime' with the actual property containing the schedule time
        
            // Step 2: Get the expected time (replace this with your actual expectedTime variable)
            const diffSexpectedTime = new Date(scheduleTimeISOString); // Replace 'element.expectedTime' with the actual property containing the expected time
        
            const timeDifferenceInMilliseconds = diffScheduleTime.getTime() - diffSexpectedTime.getTime();
            const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);
            const statusToActionMap = {
               4: "Vehicle Arrival",
               5: "Arrival Scan"
            };
          
            if (element.sTS==4||element.sTS ==5) {
              let arrivalData = {
                "id": element?._id || "",
                "Route":element?.rUTCD + ":" + element?.rUTNM,
                "VehicleNo": element?.vEHNO || '',
                "TripID": element?.tHC || '',
                "Location": this.storage.branch,
                "Scheduled": this.datePipe.transform(scheduleTimeISOString, 'dd/MM/yyyy HH:mm'),
                "Expected": this.datePipe.transform(updatedISOString, 'dd/MM/yyyy HH:mm'),
                "Status": timeDifferenceInHours > 0 ? "Delay" : "On Time",
                "Hrs": timeDifferenceInHours.toFixed(2),                
                "cLOC": element?.cLOC,
                "nXTLOC": element?.nXTLOC,
                "Action": statusToActionMap[element?.sTS]
              };
              tableData.push(arrivalData);
              // Display or use arrivalData as needed
            }
          });
          this.fetchShipmentData();
          this.arrivalTableData = tableData;
          this.tableload = false;
        }
        else{
          this.arrivalTableData = [];
          this.tableload = false;
        }
  }
  /**
    * Fetches shipment data from the API and updates the boxData and tableload properties.
    */
  async fetchShipmentData() {
    // Prepare request payload
    // Send request and handle response
        const shipment= await this.depatureService.getThcWiseMeniFest({dEST:this.storage.branch,"D$or":[{iSDEL:false},{iSDEL:{"D$exists":false}}]});
        const sumTotalChargedNoOfpkg = shipment.reduce((total, count) => {
          return total + parseInt(count.pKGS);
        }, 0);
        const createShipDataObject = (count, title, className) => ({
          count,
          title,
          class: `info-box7 ${className} order-info-box7`
        });

        const shipData = [
          createShipDataObject(this.arrivalTableData.length, "Routes", "bg-c-Bottle-light"),
          createShipDataObject(this.arrivalTableData.length, "Vehicles", "bg-c-Grape-light"),
          createShipDataObject(shipment.length, "Shipments", "bg-c-Daisy-light"),
          createShipDataObject(sumTotalChargedNoOfpkg, "Packages", "bg-c-Grape-light")
        ];
        this.boxData = shipData;
        const shipmentStatus = shipment.length <= 0 ? 'noDkt' : 'dktAvail';
        this._operation.setShipmentStatus(shipmentStatus);
  }
  updateDepartureData(event) {
    
    this.tableload=true
    this.getArrivalDetails()
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
    this.tableload=false;
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