import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { EwayBillControls } from "src/assets/FormControls/ewayBillControl";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from "src/app/Utility/utility.service";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { MasterService } from "src/app/core/service/Masters/master.service";

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
    submit: false,
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
  constructor(private ICnoteService: CnoteService, private masterService: MasterService,
    private fb: UntypedFormBuilder, private filter: FilterUtils, private service: utilityService) {
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
  getFromCity() {
    if (this.tabForm.controls["FromCity"].value.length > 2) {
      var request = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ruleValue: 'Y',
        searchText: this.tabForm.controls.FromCity.value,
        docketMode: "Yes",
        ContractParty: "",
        PaymentType: "P02",
      };
      this.error = "";
      this.ICnoteService.cnoteNewPost(
        "services/GetFromCityDetails",
        request
      ).subscribe({
        next: (res) => {
          if (res) {
            this.data = res.result.map((item) => {
              item["name"] = item.Name;
              item["value"] = item.Value;
              return item;
            });
            // this.tabForm.controls["FromCity"].setValue(this.data.find(x => x.name == this.ewayData?.Ewddata[0][1].Consignor.city))
            this.filter.Filter(
              this.docketControlArray,
              this.tabForm,
              this.data,
              this.fromCity,
              this.fromCityStatus,
            );
          } else {
            this.error = "Error While Getting Cluster List";
          }
        },
        error: (error) => {
          this.error = error;
        },
        complete() { },
      });
    }
  }
  initializeFormControl() {
    this.ewayBillTab = new EwayBillControls();
    this.docketControlArray = this.ewayBillTab.getDocketFieldControls();
    this.consignorControlArray = this.ewayBillTab.getConsignorFieldControls();
    this.consigneeControlArray = this.ewayBillTab.getConsigneeFieldControls();
    this.appointmentControlArray = this.ewayBillTab.getAppointmentFieldControls();
    this.containerControlArray = this.ewayBillTab.getContainerFieldControls();
    this.contractControlArray = this.ewayBillTab.getContractFieldControls();
    this.totalSummaryControlArray = this.ewayBillTab.getTotalSummaryFieldControls();
    this.ewayBillControlArray = this.ewayBillTab.getEwayBillFieldControls();
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
    this.docketControlArray.forEach(data => {
      if (data.name === 'FromCity') {
        this.fromCity = data.name;
        this.fromCityStatus = data.additionalData.showNameAndValue;
      }
    });
    this.tabForm = formGroupBuilder(this.fb, Object.values(this.tabData));
    this.contractForm = formGroupBuilder(this.fb, Object.values(this.contractData));
    this.tabForm.controls["appoint"].setValue('N');
    this.getEwayBillData();
  }
  save() {
    this.service.exportData(this.tabForm.value)
  }
  getEwayBillData() {
    this.masterService.getJsonFileDetails('ewayUrl').subscribe(res => {
      this.ewayData = res;
      this.tabForm.controls.FromCity.setValue(res.Ewddata[0][1].Consignor.city)
      this.tableData = this.ewayData.Ewddata[0][0].data.itemList
    });
  }
  // Load temporary data
  loadTempData() {
    this.tableData = [{
      documentType: [],
      srNo: 0,
      INVNO: "",
      INVDT: "",
      LENGTH: "",
      BREADTH: "",
      HEIGHT: "",
      DECLVAL: "",
      NO_PKGS: "",
      CUB_WT: "",
      ACT_WT: "",
      Invoice_Product: "",
      HSN_CODE: ""
    }];
  }

  // Add a new item to the table
  addItem() {
    const AddObj = {
      documentType: [],
      srNo: 0,
      INVNO: "",
      INVDT: "",
      LENGTH: "",
      BREADTH: "",
      HEIGHT: "",
      DECLVAL: "",
      NO_PKGS: "",
      CUB_WT: "",
      ACT_WT: "",
      Invoice_Product: "",
      HSN_CODE: ""
    };
    this.tableData.splice(0, 0, AddObj);
  }
  displayAppointment($event) {
    const generateControl = $event.eventArgs.value === "Y";
    this.appointmentControlArray.forEach(data => {
      if (data.name !== 'appoint') {
        data.generatecontrol = generateControl;
      }
    });
  }
}