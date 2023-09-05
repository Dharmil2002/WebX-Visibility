import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MarkArrivalComponent } from '../../ActionPages/mark-arrival/mark-arrival.component';
import { UpdateLoadingSheetComponent } from 'src/app/operation/update-loading-sheet/update-loading-sheet.component';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { PodCodControl } from 'src/assets/FormControls/pod-cod-control';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';
@Component({
  selector: 'app-pod-cod-dashboard-page',
  templateUrl: './pod-cod-dashboard-page.component.html'
})
export class PodCodDashboardPageComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  viewComponent: any;
  advancdeDetails: any;
  arrivalChanged: any;
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  csv: any;
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
  toggleArray = [];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = {
    checkBoxRequired: {
      Style: "min-width:50px",
      class: "matcolumncenter",
      Title: "",
    },
    pfmCnNo: {
      Title: "PFM/CN No.",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    cnDate: {
      Title: "CN Date",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    deliveryDate: {
      Title: "Delivery Date",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    podScanDate: {
      Title: "POD Scan Date",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    customerName: {
      Title: "Customer Name",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    documentType: {
      Title: "Document Type",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    originDestination: {
      Title: "Origin-Destination",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    fromCityToCity: {
      Title: "From City - To City",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
  };
  staticField = [
    "pfmCnNo",
    "cnDate",
    "deliveryDate",
    "podScanDate",
    "customerName",
    "documentType",
    "originDestination",
    "fromCityToCity",
    "status",
    "action"
  ];
  metaData = {
    checkBoxRequired: true,
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
  codKpiData: any;
  podKpiData: any;
  range: FormGroup;
  jsonControlArray: any;
  podCodForm: UntypedFormGroup;
  pod: boolean;
  // declararing properties
  constructor(private fb: FormBuilder, private operationService: OperationService, private datePipe: DatePipe) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown';
    this.range = this.fb.group({
      start: new FormControl(),
      end: new FormControl(),
    });
  }
  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    this.range.controls["start"].setValue(lastweek);
    this.range.controls["end"].setValue(now);
    this.getArrivalDetails();

    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
    this.intializeFormControl();
  }
  intializeFormControl() {
    const companyGstFormControls = new PodCodControl();
    this.jsonControlArray = companyGstFormControls.getFormControls();
    this.podCodForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.podCodForm.controls["type"].setValue('P');
    this.pod = false;
  }
  getArrivalDetails() {
    this.operationService.getJsonFileDetails('podcodDetails').subscribe(res => {
      this.data = res.podData;
      this.codKpiData = res.codKpiData
      this.podKpiData = res.podKpiData
      this.tableload = false;
    });
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
  get() {
    var fdate = this.datePipe.transform(this.range.controls.start.value, "dd MMM yyyy");
    var tdate = this.datePipe.transform(this.range.controls.end.value, "dd MMM yyyy");
  }
  functionCaller($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  display($event) {
    const generateControl = $event.eventArgs.value;
    if (generateControl === "C") {
      this.pod = true;
      this.jsonControlArray.forEach(data => {
        if (data.name !== 'type') {
          data.label = 'COD Status';
          data.placeholder = 'COD Status';
          data.value = [
            { value: 'U', name: 'Upload COD' },
            { value: 'F', name: 'Forward COD' },
            { value: 'AK', name: 'Acknowledge POD' },
          ];
        }
      });
    } else if (generateControl === "P") {
      this.pod = false;
      // Reset jsonControlArray to its original value
      this.jsonControlArray = [
        {
          name: 'type', label: 'Type', placeholder: 'Type', type: 'radiobutton',
          value: [{ value: 'P', name: 'POD' }, { value: 'C', name: 'COD' }],
          Validations: [],
          functions: {
            onChange: "display"
          },
          generatecontrol: true, disable: false
        },
        {
          name: 'podStatus',
          label: 'POD Status',
          placeholder: 'POD Status',
          type: 'Staticdropdown',
          value: [
            { value: 'A', name: 'Audit POD' },
            { value: 'F', name: 'Forward POD' },
            { value: 'AK', name: 'Acknowledge POD' },
            { value: 'U', name: 'Upload POD' }
          ],
          filterOptions: '',
          autocomplete: '',
          displaywith: '',
          Validations: [
          ],
          generatecontrol: true,
          disable: true
        },
      ];
    }
  }

}