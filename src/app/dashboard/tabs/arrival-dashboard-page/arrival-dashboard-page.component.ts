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
import { da } from 'date-fns/locale';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import Swal from 'sweetalert2';
import { DepartureService } from 'src/app/Utility/module/operation/departure/departure-service';
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
  companyCode: number = 0;
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
    Route: {
      Title: "Route",
      class: "matcolumnleft",
      Style: "min-width:200px",
      sticky: true,
      datatype: 'string'
    },
    VehicleNo: {
      Title: "Veh No",
      class: "matcolumnleft",
      Style: "min-width:100px",
      sticky: true,
      datatype: 'string'
    },
    TripID: {
      Title: "Trip ID",
      class: "matcolumnleft",
      Style: "min-width:120px",
      sticky: true,
      datatype: 'string'
    },
    Location: {
      Title: "Location",
      class: "matcolumncenter",
      Style: "min-width:100px",
      datatype: 'string'
    },
    Scheduled: {
      Title: "STA",
      class: "matcolumncenter",
      Style: "min-width:100px",
      datatype: 'datetime'
    },
    Expected: {
      Title: "ETA",
      class: "matcolumncenter",
      Style: "min-width:100px",
      datatype: 'datetime'
    },
    // Status: {
    //   Title: "Status",
    //   class: "matcolumnleft",
    //   Style: "min-width:100px"
    // },
    // Hrs: {
    //   Title: "Hrs.",
    //   class: "matcolumnright",
    //   Style: "min-width:100px"
    // },
    // Action: {
    //   Title: "Action",
    //   class: "matcolumnleft",
    //   Style: "min-width:100px",
    //   stickyEnd: true
    // },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width:80px; width:80px",
      stickyEnd: true
    }

    // "Route": "Route",
    // "VehicleNo": "Veh No",
    // "TripID": "Trip ID",
    // "Location": "Location",
    // "Scheduled": "STA",
    // "Expected": "ETA",
    // "Status": "Status",
    // "Hrs": "Hrs.",
    // "Action": "Action"
  }
  staticField = ["Route","VehicleNo","TripID","Location","Scheduled","Expected"] //,"Hrs","Scheduled","Expected","Status"

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
    {label: 'Cancel THC'}
  ];

  IscheckBoxRequired: boolean;
  boxData: { count: any; title: any; class: string; }[];
  departureDetails: any;
  isCalled: boolean;
  branch: string = "";
  routeDetails: any;
  // declararing properties
  constructor(
    private CnoteService: CnoteService,
    private _operation: OperationService,
    private datePipe: DatePipe,
    private storage:StorageService,
    private departureService: DepartureService,
    private depatureService: ArrivalVehicleService,
    private objGeneralService: GeneralService,
    private invoiceService: InvoiceServiceService,
  ) {

    super();
    this.companyCode = this.storage.companyCode;
    this.branch = this.storage.branch;
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
    this.getArrivalDetails();
  }
  ngOnInit(): void {

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
    debugger;
  
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
               5: "Arrival Scan",
               6: "Cancel THC"
            };
          
            if (element.sTS==4||element.sTS ==5) {
              let actions = [];
    
    // Add the primary action based on the status
    if (statusToActionMap[element?.sTS]) {
        actions.push(statusToActionMap[element.sTS]);
    }
    
    // Add "Cancel THC" if the status is 5
    if (element.sTS == 4) {
        actions.push(statusToActionMap[4]);  
        actions.push(statusToActionMap[6]);  // Assuming 6 maps to "Cancel THC"
    }
              let arrivalData = {
                "id": element?._id || "",
                "Route":element?.rUTCD + ":" + element?.rUTNM,
                "VehicleNo": element?.vEHNO || '',
                "TripID": element?.tHC || '',
                "Location": this.storage.branch,
                "Scheduled": scheduleTime,
                "Expected": expectedTime,
                "Status": timeDifferenceInHours > 0 ? "Delay" : "On Time",
                "Hrs": timeDifferenceInHours.toFixed(2),                
                "cLOC": element?.cLOC,
                "nXTLOC": element?.nXTLOC,
                 "actions": actions
                // "actions": ["Vehicle Arrival", "Arrival Scan"]
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
  }

  async handleMenuItemClick(label, element) {
    debugger;
    
    let Data = { label: label, data: element }
    if (label.label.label == "Cancel THC") 
      {
        const rejectionData = await this.objGeneralService.getGeneralMasterData("THCCAN");
        const options = rejectionData.map(item => `<option value="${item.name}">${item.name}</option>`).join('');

        Swal.fire({
          title: 'Reason For Cancel?',
          html: `<select id="swal-select1" class="swal2-select">${options}</select>`,
          focusConfirm: false,
          showCancelButton: true,
          width:"auto",
          cancelButtonText: 'Cancel', // Optional: Customize the cancel button text
          preConfirm: () => {
            return (document.getElementById('swal-select1') as HTMLInputElement).value;
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Handle the input value if the user clicks the confirm button
            const filter = {
              docNo: Data.label.data.TripID
            }
            const status = {
              cNL: true,
              cNLDT: new Date(),
              cNBY: this.storage.userName,
              oPSSTNM: "Cancelled",
              oPSST: "9",
              cNRES: result.value//required cancel reason in popup
            }
            const res = await this.departureService.updateTHCLTL(filter, status);
            await this.departureService.deleteTrip({ cID: this.storage.companyCode, tHC: Data.label.data.TripID });
            Data.label.data.reason= result.value;
          this.departureService.updateDocket(Data.label.data.data);
            if (res) {
              SwalerrorMessage("success", "Success", "The THC has been successfully Cancelled.", true)
              this.getArrivalDetails();
            }
            // Your code to handle the input value
          } else if (result.isDismissed) {
            this.getArrivalDetails();
          }
        });
      }
      
    //  this.menuItemClicked.emit(Data);
    this.advancdeDetails = {
      data: Data,
      viewComponent: this.viewComponent
    }
    return this.advancdeDetails
  }

}