import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { EwayBillControls } from "src/assets/FormControls/ewayBillControl";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from "src/app/Utility/utility.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-eway-example',
  templateUrl: './eway-bill-docket-booking-v2.html'
})
export class EwayBillDocketBookingV2Component implements OnInit {
  breadscrums = [
    {
      title: "EwayBillDocket",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ];
  ewayBillTab: EwayBillControls;         // a example of model , whose form we have to display
  docketControlArray: FormControls[];         // array to hold form controls
  consignorControlArray: FormControls[];         // array to hold form controls
  consigneeControlArray: FormControls[];         // array to hold form controls
  containerControlArray: FormControls[];
  appointmentControlArray: FormControls[];
  contractControlArray: FormControls[];
  totalSummaryControlArray: FormControls[];
  ewayBillControlArray: FormControls[];
  // array to hold form controls
  tabData: any;
  contractData: any;
  sampleDropdownData: any[];
  protected _onDestroy = new Subject<void>();
  tabForm: UntypedFormGroup;
  contractForm: UntypedFormGroup;
  location: any;
  locationStatus: any;
  RouteStatus: any;
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: false,
    submit: true,
    search: true
  };
  sampleDropdownData2 = [
    { name: "HQTR", value: "HQTR" },
    { name: "MUMB", value: "MUMB" },
    { name: "AMDB", value: "AMDB" }
  ]
  routedropdown = [
    {
      value: "S0010 ",
      name: "AMDB-BRDB-MUMB",
    },
    {
      value: "S0003 ",
      name: "AMDB-JAIB-DELB",
    },
    {
      value: "S0002 ",
      name: "MUMB-BRDB-AMDB",
    }

  ]
  DocketField: any;
  isLinear = true;
  showSaveAndCancelButton = true;
  error: any;
  data: any;
  fromCity: string;
  fromCityStatus: any;
  ewayData: any;
  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "#",
      key: "index",
      style: "",
    },
    INVNO: {
      name: "Invoice No.",
      key: "inputString",
      style: "",
    },
    INVDT: {
      name: "Invoice Date",
      key: "date",
      style: "",
    },
    LENGTH: {
      name: "Length (CM)",
      key: "input",
      style: "",
    },
    BREADTH: {
      name: "Breadth (CM)",
      key: "input",
      style: "",
    },
    HEIGHT: {
      name: "Height (CM)",
      key: "input",
      style: "",
    },
    DECLVAL: {
      name: "Declared Value",
      key: "input",
      style: "",
    },
    NO_PKGS: {
      name: "No. of Pkgs.",
      key: "input",
      style: "",
    },
    CUB_WT: {
      name: "Cubic Weight",
      key: "input",
      style: "",
    },
    ACT_WT: {
      name: "Actual Weight (KG)",
      key: "input",
      style: "",
    },
    Invoice_Product: {
      name: "Product",
      key: "inputString",
      style: "",
    },
    HSN_CODE: {
      name: "HSN Code",
      key: "inputString",
      style: "",
    },
  };
  toCity: string;
  toCityStatus: any;
  customer: string;
  customerStatus: any;
  consignorName: string;
  consignorStatus: any;
  consignorCity: string;
  consignorCityStatus: any;
  consigneeCity: string;
  consigneeCityStatus: any;
  consigneeName: string;
  consigneeNameStatus: any;
  genralMaster: any;
  containerSize1: any;
  containerSize2: any;
  containerType: any;
  containerSize1Size: boolean;
  destination: any;
  destinationStatus: boolean;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  dockNo: string;
  constructor(
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private service: utilityService,
    private operationService: OperationService
  ) {
    this.getCity();
    this.customerDetails();
    this.destionationDropDown();
  }

  ngOnInit(): void {
    this.loadTempData();
    this.initializeFormControl();
  }

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  // Initialize form control
  initializeFormControl() {
    this.ewayBillTab = new EwayBillControls();

    // Get control arrays for different sections
    this.docketControlArray = this.ewayBillTab.getDocketFieldControls();
    this.consignorControlArray = this.ewayBillTab.getConsignorFieldControls();
    this.consigneeControlArray = this.ewayBillTab.getConsigneeFieldControls();
    this.appointmentControlArray = this.ewayBillTab.getAppointmentFieldControls();
    this.containerControlArray = this.ewayBillTab.getContainerFieldControls();
    this.contractControlArray = this.ewayBillTab.getContractFieldControls();
    this.totalSummaryControlArray = this.ewayBillTab.getTotalSummaryFieldControls();
    this.ewayBillControlArray = this.ewayBillTab.getEwayBillFieldControls();

    // Set up data for tabs and contracts
    this.tabData = {
      "Details From Eway-Bill": this.docketControlArray,
      "Consignor Details": this.consignorControlArray,
      "Consignee Details": this.consigneeControlArray,
      "Appointment Based Delivery": this.appointmentControlArray,
      "Container Details": this.containerControlArray,
    };

    this.contractData = {
      "Contract Details": this.contractControlArray,
      "Total Summary": this.totalSummaryControlArray,
      "E-Way Bill Details": this.ewayBillControlArray,
    };

    // Perform common drop-down mapping
    this.commonDropDownMapping();

    // Build form groups
    this.tabForm = formGroupBuilder(this.fb, Object.values(this.tabData));
    this.contractForm = formGroupBuilder(this.fb, Object.values(this.contractData));

    // Set initial values for the form controls
    this.tabForm.controls["appoint"].setValue('N');

    // Retrieve EwayBill data
    this.getEwayBillData();
  }


  // Get city details
  getCity() {
    this.masterService.getJsonFileDetails('city').subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.docketControlArray,
            this.tabForm,
            res,
            this.fromCity,
            this.fromCityStatus,
          );  // Filter the docket control array based on fromCity details

          this.filter.Filter(
            this.docketControlArray,
            this.tabForm,
            res,
            this.toCity,
            this.toCityStatus,
          );  // Filter the docket control array based on toCity details

          this.filter.Filter(
            this.consignorControlArray,
            this.tabForm,
            res,
            this.consignorCity,
            this.consignorCityStatus,
          );  // Filter the consignor control array based on consignorCity details

          this.filter.Filter(
            this.consigneeControlArray,
            this.tabForm,
            res,
            this.consigneeCity,
            this.consigneeNameStatus,
          );  // Filter the consignee control array based on consigneeCity details
        }
      }
    });
  }

  // Customer details
  customerDetails() {
    this.masterService.getJsonFileDetails('customer').subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.docketControlArray,
            this.tabForm,
            res,
            this.customer,
            this.customerStatus
          );  // Filter the docket control array based on customer details

          this.filter.Filter(
            this.consignorControlArray,
            this.tabForm,
            res,
            this.consignorName,
            this.consignorStatus
          );  // Filter the consignor control array based on customer details

          this.filter.Filter(
            this.consigneeControlArray,
            this.tabForm,
            res,
            this.consigneeName,
            this.consigneeNameStatus
          );  // Filter the consignee control array based on customer details
        }
      }
    });
  }

  // Get EwayBill data
  getEwayBillData() {
    // this.masterService.getJsonFileDetails('ewayUrl').subscribe(res => {
    //   this.ewayData = res;  // Assign the received data to the ewayData property

    //   // Set the value of fromCity in the tabForm control using the data
    //   this.tabForm.controls.fCity.setValue(res.Ewddata[0][1].Consignor.city);

    //   // Assign the itemList data to the tableData property
    //   this.tableData = this.ewayData.Ewddata[0][0].data.itemList;
    // });
  }

  // Load temporary data
  loadTempData() {
    this.tableData = [{
      documentType: [],   // Array to store document types
      srNo: 0,            // Serial number
      INVNO: "",          // Invoice number
      INVDT: "",          // Invoice date
      LENGTH: "",         // Length
      BREADTH: "",        // Breadth
      HEIGHT: "",         // Height
      DECLVAL: "",        // Declaration value
      NO_PKGS: "",        // Number of packages
      CUB_WT: "",         // Cubic weight
      ACT_WT: "",         // Actual weight
      Invoice_Product: "",// Invoice product
      HSN_CODE: ""        // HSN code
    }];
  }
  // Add a new item to the table
  addItem() {
    const AddObj = {
      documentType: [],     // Array to store document types
      srNo: 0,              // Serial number
      INVNO: "",            // Invoice number
      INVDT: "",            // Invoice date
      LENGTH: "",           // Length
      BREADTH: "",          // Breadth
      HEIGHT: "",           // Height
      DECLVAL: "",          // Declaration value
      NO_PKGS: "",          // Number of packages
      CUB_WT: "",           // Cubic weight
      ACT_WT: "",           // Actual weight
      Invoice_Product: "",  // Invoice product
      HSN_CODE: ""          // HSN code
    };
    this.tableData.splice(0, 0, AddObj);  // Insert the new object at the beginning of the tableData array
  }

  // Display appointment
  displayAppointment($event) {
    const generateControl = $event.eventArgs.value === "Y";  // Check if value is "Y" to generate control
    this.appointmentControlArray.forEach(data => {
      if (data.name !== 'appoint') {
        data.generatecontrol = generateControl;  // Set generatecontrol property based on the generateControl value
      }
    });
  }

  // Common drop-down mapping
  commonDropDownMapping() {
    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach(data => {
        const mapping = mappings.find(mapping => mapping.name === data.name);
        if (mapping) {
          this[mapping.target] = data.name;  // Set the target property with the value of the name property
          this[`${mapping.target}Status`] = data.additionalData.showNameAndValue;  // Set the targetStatus property with the value of additionalData.showNameAndValue
        }
      });
    };

    const docketMappings = [
      { name: 'fromCity', target: 'fromCity' },
      { name: 'toCity', target: 'toCity' },
      { name: 'billingParty', target: 'customer' }
    ];

    const consignorMappings = [
      { name: 'consignorName', target: 'consignorName' },
      { name: 'consignorCity', target: 'consignorCity' }
    ];

    const consigneeMappings = [
      { name: 'consigneeCity', target: 'consigneeCity' },
      { name: 'consigneeName', target: 'consigneeName' }
    ];
    const destinationMapping = [
      { name: 'destination', target: 'destination' }
    ]
    mapControlArray(this.docketControlArray, docketMappings);  // Map docket control array
    mapControlArray(this.consignorControlArray, consignorMappings);  // Map consignor control array
    mapControlArray(this.consigneeControlArray, consigneeMappings);  // Map consignee control array
    mapControlArray(this.contractControlArray, destinationMapping)
  }

  //End
  //destionation
  destionationDropDown() {

    this.masterService.getJsonFileDetails('destination').subscribe({
      next: (res: any) => {
        if (res) {

          this.filter.Filter(
            this.contractControlArray,
            this.contractForm,
            res,
            this.destination,
            this.destinationStatus,
          );
        }
      }
    })
  }
  //end 
  saveData(event) {

    let invoiceDetails = {
      invoiceDetails: event.data
    }
    const dynamicValue = localStorage.getItem('Branch'); // Replace with your dynamic value
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, '0');
    this.dockNo = `CN${dynamicValue}${paddedNumber}`;
    this.tabForm.controls['docketNumber'].setValue(this.dockNo);
    this.tabForm.controls['fromCity'].setValue(this.tabForm.value.fromCity?.name || '');
    this.tabForm.controls['toCity'].setValue(this.tabForm.value.toCity?.name || '');
    this.tabForm.controls['billingParty'].setValue(this.tabForm.value?.billingParty.name || '');
    this.tabForm.controls['consignorName'].setValue(this.tabForm.value?.consignorName.name || '');
    this.tabForm.controls['consignorCity'].setValue(this.tabForm.value?.consignorCity.name || '');
    this.tabForm.controls['consigneeCity'].setValue(this.tabForm.value?.consigneeCity.name || '');
    this.tabForm.controls['consigneeName'].setValue(this.tabForm.value?.consigneeName.name || '');
    this.contractForm.controls['destination'].setValue(this.contractForm.value?.destination.name || '');
    let id={id:this.dockNo}
    let docketDetails = { ...this.tabForm.value, ...this.contractForm.value, ...invoiceDetails,...id};
    let reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
      data: docketDetails
    }
    this.operationService.operationPost('common/create', reqBody).subscribe({
      next: (res: any) => {
        this.Addseries()
      }
    })
  }
  Addseries() {
    const resultArray = this.generateArray(this.companyCode,this.tabForm.controls['docketNumber'].value,this.contractForm.controls['totalChargedNoOfpkg'].value);
    let reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docketScan",
      data: resultArray
    }
    this.operationService.operationPost('common/create', reqBody).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Booked SuccesFully",
          text: "DocketNo: "+this.dockNo,
          showConfirmButton: true,
        });
      }
    })
  }
   generateArray(companyCode, dockno,pkg) {
    const array = Array.from({ length: pkg }, (_, index) => {
      const serialNo = (index + 1).toString().padStart(3, '0');
      const bcSerialNo = `${dockno}-${serialNo}`;
      const entryDateTime = new Date().toISOString();
      const bcDockSf = '.';
      return {
        id:bcSerialNo,
        companyCode: companyCode,
        dockNo: dockno,
        bcSerialNo: bcSerialNo,
        entryDateTime: entryDateTime,
        bcDockSf: bcDockSf,
      };
    });
  
    return array;
  }
  
   
}