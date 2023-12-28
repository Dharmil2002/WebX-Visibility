import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { DocketTrackingControl } from 'src/assets/FormControls/docket-tracking';
import { getDocketFromApiDetail } from './docket-tracking-utlity';
import Swal from 'sweetalert2';
import { formatDate } from 'src/app/Utility/date/date-utils';
import moment from 'moment';

@Component({
  selector: 'app-docket-tracking',
  templateUrl: './docket-tracking.component.html'
})
export class DocketTrackingComponent implements OnInit {
  tableload = true
  dktTracking: DocketTrackingControl;
  dktTrackingArray: FormControls[];
  dktTableForm: UntypedFormGroup;
  addAndEditPath: string;
  data: [] | any;
  uploadComponent: any;
  csvFileName: string;
  toggleArray = ["isActive"];
  linkArray = [];
  csv: any;
  load:boolean=false;
  tableData: any;
  docketNo:string='';
  dynamicControls = {
    add: false,
    edit: false,
    csv: true
  }
  orgBranch: string = localStorage.getItem("Branch");
  companyCode = parseInt(localStorage.getItem("companyCode"));
  userName = localStorage.getItem("Username");
  columnHeader = {
    upDt:"Date",
    documnetNo: "Transaction Number",
    loc: "Location",
    event: "Event",
  };
  headerForCsv = {
    upDt:"Date",
    documnetNo: "Transaction Number",
    loc: "Location",
    event: "Event",
  };
  IscheckBoxRequired: boolean;
  menuItemflag: boolean = true;
  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };

  breadScrums = [
    {
      title: "Docket Tracking",
      items: ["Operation"],
      active: "Docket Tracking",
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private operationService: OperationService) {
    this.initializeFormControl();
  }


  ngOnInit(): void {
  }
  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.dktTracking = new DocketTrackingControl();
    // Get form controls for Driver Details section
    this.dktTrackingArray = this.dktTracking.getDepartVehicleFormControls();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.dktTableForm = formGroupBuilder(this.fb, [this.dktTrackingArray]);
  }

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  async Fetch() {
    this.load = true;
    this.tableload = true;

    // Introduce a delay of 2 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));

    const docketList = await getDocketFromApiDetail(this.companyCode, this.docketNo, this.operationService);
    const tableDetail = docketList.map((x) => {
      if (x.upDt) {
        x.upDt = formatDate(x.upDt, 'dd/MM/yyyy HH:mm:ss');
      }
      //1: Booking, 2: Loading Sheet Generated, 3: Manifest Generated, 4: THC Generated, 5: Departure, 6: Arrival, 7: Unloading/Stock Update, 8: Delivered, 9: Attempted
      if(x.event.startsWith("Booked")){
        x.statusCode = "1",
        x.status = "Booking",
        x.documnetNo = x.dktNo
      }
      else if(x.event.startsWith("Loading Sheet Generated At")){
        x.statusCode = "2",
        x.status = "Loading",
        x.documnetNo = x.lsno
      }
      else if(x.event.startsWith("Menifest Generated At")){
        x.statusCode = "3",
        x.status = "Loading",
        x.documnetNo = x.mfno
      }
      else if(x.event.startsWith("Departed From")){
        x.statusCode = "5",
        x.status = "Departure",
        x.documnetNo = x.tripId
      }
      else if(x.event.startsWith("Vehicle Arrival at")){
        x.statusCode = "6",
        x.status = "Arrival",
        x.documnetNo = x.tripId
      }
      else if(x.event.startsWith("UnLoaded At")){
        x.statusCode = "7",
        x.status = "Unloading",
        x.documnetNo = (x.tripId && x.tripId != "") ? x.tripId : x.mfno
      }
      return x;
    });
    const sortedTableDetail = tableDetail.sort((a, b) => {
      const dateA = moment(a.upDt).valueOf(); // Converts to Unix timestamp in milliseconds
      const dateB = moment(b.upDt).valueOf(); // Converts to Unix timestamp in milliseconds
      return dateB - dateA; // Sorting by date and time in descending order
    });
    if (docketList.length > 0) {
      this.tableData = sortedTableDetail;
      this.tableload = false;
      this.load = false;
    } else {
      Swal.fire({
        icon: "info",
        title: "Docket Number Not Found",
        text: "The provided Docket Number does not exist.",
        showConfirmButton: true
      });
      this.load = false;
    }
  }



  reset(){
    this.tableload = true;
  }
}
