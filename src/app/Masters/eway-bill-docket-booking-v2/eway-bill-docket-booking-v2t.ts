import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { EwayBillControls } from "src/assets/FormControls/ewayBillControl";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { calculateInvoiceTotalCommon, getPincode } from "./docket.utility";
import { getCity } from "src/app/operation/quick-booking/quick-utility";

@Component({
  selector: "app-eway-example",
  templateUrl: "./eway-bill-docket-booking-v2.html",
})
export class EwayBillDocketBookingV2Component implements OnInit {
  breadscrums = [
    {
      title: "EwayBillDocket",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ];
  ewayBillTab: EwayBillControls; // a example of model , whose form we have to display
  docketControlArray: FormControls[]; // array to hold form controls
  consignorControlArray: FormControls[]; // array to hold form controls
  consigneeControlArray: FormControls[]; // array to hold form controls
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
    addRow: true,
    submit: false,
    search: true,
  };
  DocketField: any;
  isLinear = true;
  showSaveAndCancelButton = true;
  error: any;
  quickdocketDetaildata: any;
  fromCity: string;
  fromCityStatus: any;
  ewayData: any;
  userName=localStorage.getItem("Username");
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
      key: "inputnumber",
      style: "",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
    },
    BREADTH: {
      name: "Breadth (CM)",
      key: "inputnumber",
      style: "",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
    },
    HEIGHT: {
      name: "Height (CM)",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
      style: "",
    },
    DECLVAL: {
      name: "Declared Value",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
      style: "",
    },
    NO_PKGS: {
      name: "No. of Pkgs.",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
      style: "",
    },
    CUB_WT: {
      name: "Cubic Weight",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
      style: "",
    },
    ACT_WT: {
      name: "Actual Weight (KG)",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
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
    action: {
      name: "Action",
      key: "Action",
      style: "",
    },
  };
  /*below the varible for the
   dropdow biding*/

  toCity: string;
  toCityStatus: any;
  customer: string;
  customerStatus: any;
  consigneePincode: any;
  consigneePincodeStatus: any;
  consignorPinCode: any;
  consignorPinCodeStatus: any;
  consignorName: string;
  consignorStatus: any;
  consignorCity: string;
  consignorCityStatus: any;
  consigneeCity: string;
  consigneeCityStatus: any;
  consigneeName: string;
  consigneeNameStatus: any;
  /*End*/
  genralMaster: any;
  containerSize1: any;
  containerSize2: any;
  containerType: any;
  containerSize1Size: boolean;
  destination: any;
  destinationStatus: boolean;
  quickDocket: boolean;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branch = parseInt(localStorage.getItem("Branch"));
  dockNo: string;
  DocketDetails: any;
  vehicleNo: string;
  docketId: string;
  constructor(
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private operationService: OperationService,
    private route: Router,
    private _NavigationService: NavigationService
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.quickdocketDetaildata =
        route.getCurrentNavigation().extras.state.data.columnData;
      this.quickDocket = true;
    }
    this.bindQuickdocketData();
    this.getCity();
    this.customerDetails();
    this.destionationDropDown();
    this.getPincodeDetails();
  }

  ngOnInit(): void {
    this.loadTempData();
    this.initializeFormControl();
  }

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

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
    this.appointmentControlArray =
      this.ewayBillTab.getAppointmentFieldControls();
    this.containerControlArray = this.ewayBillTab.getContainerFieldControls();
    this.contractControlArray = this.ewayBillTab.getContractFieldControls();
    this.totalSummaryControlArray =
      this.ewayBillTab.getTotalSummaryFieldControls();
    this.ewayBillControlArray = this.ewayBillTab.getEwayBillFieldControls();

    // Set up data for tabs and contracts
    this.tabData = {
      "Cnote Details": this.docketControlArray,
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
    this.contractForm = formGroupBuilder(
      this.fb,
      Object.values(this.contractData)
    );

    // Set initial values for the form controls
    this.tabForm.controls["appoint"].setValue("N");

    // bind Quick docket Data
    this.bindQuickdocketData();
  }

  async getCity() {
    try {
      const cityDetail = await getCity(this.companyCode, this.masterService);

      if (cityDetail) {
        if (cityDetail) {
          this.filter.Filter(
            this.docketControlArray,
            this.tabForm,
            cityDetail,
            this.fromCity,
            this.fromCityStatus
          ); // Filter the docket control array based on fromCity details

          this.filter.Filter(
            this.docketControlArray,
            this.tabForm,
            cityDetail,
            this.toCity,
            this.toCityStatus
          ); // Filter the docket control array based on toCity details

          this.filter.Filter(
            this.consignorControlArray,
            this.tabForm,
            cityDetail,
            this.consignorCity,
            this.consignorCityStatus
          ); // Filter the consignor control array based on consignorCity details

          this.filter.Filter(
            this.consigneeControlArray,
            this.tabForm,
            cityDetail,
            this.consigneeCity,
            this.consigneeNameStatus
          ); // Filter the consignee control array based on consigneeCity details
          if (this.quickDocket) {
            this.tabForm.controls["fromCity"].setValue(
              cityDetail.find((x) => x.name === this.DocketDetails[0]?.fromCity || "")
            );
            this.tabForm.controls["toCity"].setValue(
              cityDetail.find((x) => x.name === this.DocketDetails[0]?.toCity || "")
            );
          }
        }
      }
    } catch (error) {
      console.error("Error getting city details:", error);
    }
  }

  // Customer details
  customerDetails() {
    this.masterService.getJsonFileDetails("customer").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.docketControlArray,
            this.tabForm,
            res,
            this.customer,
            this.customerStatus
          ); // Filter the docket control array based on customer details

          this.filter.Filter(
            this.consignorControlArray,
            this.tabForm,
            res,
            this.consignorName,
            this.consignorStatus
          ); // Filter the consignor control array based on customer details

          this.filter.Filter(
            this.consigneeControlArray,
            this.tabForm,
            res,
            this.consigneeName,
            this.consigneeNameStatus
          ); // Filter the consignee control array based on customer details
          if (this.quickDocket) {
            this.tabForm.controls["billingParty"].setValue(
              res.find(
                (x) => x.name === this.DocketDetails[0]?.billingParty || ""
              )
            );
          }
        }
      },
    });
  }

  // Get EwayBill data

  bindQuickdocketData() {
    if (this.quickDocket) {
      let reqBody = {
        companyCode: this.companyCode,
        type: "operation",
        collection: "docket",
        query: {
          id: this.quickdocketDetaildata.no,
        },
      };
      this.operationService.operationPost("common/getOne", reqBody).subscribe({
        next: (res: any) => {
          if (res) {
            this.DocketDetails = res.data.db.data.docket;
            this.contractForm.controls["payType"].setValue(
              this.DocketDetails[0]?.payType || ""
            );
            this.vehicleNo = this.DocketDetails[0]?.vehNo;
            this.contractForm.controls["totalChargedNoOfpkg"].setValue(
              this.DocketDetails[0]?.totalChargedNoOfpkg || ""
            );
            this.contractForm.controls["actualwt"].setValue(
              this.DocketDetails[0]?.actualwt || ""
            );
            this.contractForm.controls["chrgwt"].setValue(
              this.DocketDetails[0]?.chrgwt || ""
            );
            this.docketId = this.DocketDetails[0]?.id || "";
            this.tabForm.controls["docketNumber"].setValue(
              this.DocketDetails[0]?.docketNumber || ""
            );
            this.tabForm.controls["docketDate"].setValue(
              this.DocketDetails[0]?.docketDate || ""
            );
            this.tableData[0].NO_PKGS =
              this.DocketDetails[0]?.totalChargedNoOfpkg || "";
            this.tableData[0].ACT_WT = this.DocketDetails[0]?.actualwt || "";
          }
        },
      });
    }
  }

  // Load temporary data
  loadTempData() {
    this.tableData = [
      {
        documentType: [], // Array to store document types
        srNo: 0, // Serial number
        INVNO: "", // Invoice number
        INVDT: "", // Invoice date
        LENGTH: "", // Length
        BREADTH: "", // Breadth
        HEIGHT: "", // Height
        DECLVAL: "", // Declaration value
        NO_PKGS: "", // Number of packages
        CUB_WT: "", // Cubic weight
        ACT_WT: "", // Actual weight
        Invoice_Product: "", // Invoice product
        HSN_CODE: "", // HSN code
      },
    ];
  }
  // Add a new item to the table
  addItem() {
    const AddObj = {
      documentType: [], // Array to store document types
      srNo: 0, // Serial number
      INVNO: "", // Invoice number
      INVDT: "", // Invoice date
      LENGTH: "", // Length
      BREADTH: "", // Breadth
      HEIGHT: "", // Height
      DECLVAL: "", // Declaration value
      NO_PKGS: "", // Number of packages
      CUB_WT: "", // Cubic weight
      ACT_WT: "", // Actual weight
      Invoice_Product: "", // Invoice product
      HSN_CODE: "", // HSN code
    };
    this.tableData.splice(0, 0, AddObj); // Insert the new object at the beginning of the tableData array
  }

  // Display appointment
  displayAppointment($event) {
    const generateControl = $event.eventArgs.value === "Y"; // Check if value is "Y" to generate control
    this.appointmentControlArray.forEach((data) => {
      if (data.name !== "appoint") {
        data.generatecontrol = generateControl; // Set generatecontrol property based on the generateControl value
      }
    });
  }

  // Common drop-down mapping

  commonDropDownMapping() {
    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach((data) => {
        const mapping = mappings.find((mapping) => mapping.name === data.name);
        if (mapping) {
          this[mapping.target] = data.name; // Set the target property with the value of the name property
          this[`${mapping.target}Status`] =
            data.additionalData.showNameAndValue; // Set the targetStatus property with the value of additionalData.showNameAndValue
        }
      });
    };

    const docketMappings = [
      { name: "fromCity", target: "fromCity" },
      { name: "toCity", target: "toCity" },
      { name: "billingParty", target: "customer" },
    ];

    const consignorMappings = [
      { name: "consignorName", target: "consignorName" },
      { name: "consignorCity", target: "consignorCity" },
      { name: "consignorPinCode", target: "consignorPinCode" },
    ];

    const consigneeMappings = [
      { name: "consigneeCity", target: "consigneeCity" },
      { name: "consigneeName", target: "consigneeName" },
      { name: "consigneePincode", target: "consigneePincode" },
    ];
    const destinationMapping = [{ name: "destination", target: "destination" }];
    mapControlArray(this.docketControlArray, docketMappings); // Map docket control array
    mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    mapControlArray(this.contractControlArray, destinationMapping);
  }
  //End
  //destionation
  destionationDropDown() {
    this.masterService.getJsonFileDetails("destination").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.contractControlArray,
            this.contractForm,
            res,
            this.destination,
            this.destinationStatus
          );
          if (this.quickDocket) {
            this.contractForm.controls["destination"].setValue(
              res.find(
                (x) => x.name === this.DocketDetails[0]?.destination || ""
              )
            );
          }
        }
      },
    });
  }
  //end
  saveData() {

    this.tabForm.setErrors(null);
    this.contractForm.setErrors(null);

    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const controlNames = ["svcType", "payType", "rskty", "pkgs", "trn"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.contractForm.value[controlName])) {
        this.contractForm.controls[controlName].setValue("");
      }
    });
    let invoiceDetails = {
      invoiceDetails: this.tableData,
    };
    const controltabNames = [
      "containerCapacity",
      "containerSize1",
      "containerSize2",
      "containerType",
    ];
    controltabNames.forEach((controlName) => {
      if (Array.isArray(this.tabForm.value[controlName])) {
        this.tabForm.controls[controlName].setValue("");
      }
    });
    this.tabForm.controls["fromCity"].setValue(
      this.tabForm.value.fromCity?.name || ""
    );
    this.tabForm.controls["toCity"].setValue(
      this.tabForm.value.toCity?.name || ""
    );
    this.tabForm.controls["billingParty"].setValue(
      this.tabForm.value?.billingParty.name || ""
    );
    this.tabForm.controls["consignorName"].setValue(
      this.tabForm.value?.consignorName.name || ""
    );
    this.tabForm.controls["consignorCity"].setValue(
      this.tabForm.value?.consignorCity.name || ""
    );
    this.tabForm.controls["consigneeCity"].setValue(
      this.tabForm.value?.consigneeCity.name || ""
    );
    this.tabForm.controls["consigneeName"].setValue(
      this.tabForm.value?.consigneeName.name || ""
    );
    this.contractForm.controls["destination"].setValue(
      this.contractForm.value?.destination.name || ""
    );
    if (this.quickDocket) {
      let id = { isComplete: 1, unloading: 0, lsNo: "", mfNo: "",unloadloc:""};
      let docketDetails = {
        ...this.tabForm.value,
        ...this.contractForm.value,
        ...invoiceDetails,
        ...id,
      };
      let reqBody = {
        companyCode: this.companyCode,
        type: "operation",
        collection: "docket",
        id: this.docketId,
        updates: {
          ...docketDetails,
        },
      };
      this.operationService.operationPut("common/update", reqBody).subscribe({
        next: (res: any) => {
          this.Addseries();
        },
      });
    } else {
      const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
      const paddedNumber = dynamicNumber.toString().padStart(4, "0");
      this.dockNo = `CN${dynamicValue}${paddedNumber}`;
      this.tabForm.controls["docketNumber"].setValue(this.dockNo);

      let id = {
        id: this.dockNo,
        isComplete: 1,
        unloading: 0,
        lsNo: "",
        mfNo: "",
        entryBy:this.userName,
        entryData:new Date().toISOString(),
        unloadloc:""
      };
      let docketDetails = {
        ...this.tabForm.value,
        ...this.contractForm.value,
        ...invoiceDetails,
        ...id,
      };
      let reqBody = {
        companyCode: this.companyCode,
        type: "operation",
        collection: "docket",
        data: docketDetails,
      };
      this.operationService.operationPost("common/create", reqBody).subscribe({
        next: (res: any) => {
          this.Addseries();
        },
      });
    }
  }
  Addseries() {
    const resultArray = this.generateArray(
      this.companyCode,
      this.tabForm.controls["docketNumber"].value,
      this.contractForm.controls["totalChargedNoOfpkg"].value
    );
    let reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docketScan",
      data: resultArray,
    };
    this.operationService.operationPost("common/create", reqBody).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Booked Successfully",
          text: "DocketNo: " + this.tabForm.controls["docketNumber"].value,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the desired page after the success message is confirmed.
            this._NavigationService.navigateTotab(
              1,
              "dashboard/GlobeDashboardPage"
            );
          }
        });
      },
    });
  }
  generateArray(companyCode, dockno, pkg) {
    const array = Array.from({ length: pkg }, (_, index) => {
      const serialNo = (index + 1).toString().padStart(3, "0");
      const bcSerialNo = `${dockno}-${serialNo}`;
      const entryDateTime = new Date().toISOString();
      const bcDockSf = "0";
      return {
        id: bcSerialNo,
        companyCode: companyCode,
        dockNo: dockno,
        bcSerialNo: bcSerialNo,
        entryDateTime: entryDateTime,
        bcDockSf: bcDockSf,
        loc:this.branch,
        entryBy:this.userName,
        entryData:new Date().toISOString()
      };
    });

    return array;
  }

  async delete(event) {
    const index = event.index;
    const row = event.element;

    const swalWithBootstrapButtons = await Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success msr-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
        // color: "#03a9f3",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var Request = {
            CompanyCode: localStorage.getItem("CompanyCode"),
            ID: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "City has been deleted !",
            };
          } else {
            console.log("Request", Request);
            //return this.VendorContractService.updateMileStoneRequest(Request);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData = this.tableData;
          swalWithBootstrapButtons.fire("Deleted!", "Your Message", "success");
          event.callback(true);
        } else if (result.isConfirmed) {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your Message", "info");
          event.callback(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your item is safe :)",
            "error"
          );
          event.callback(false);
        }
      });

    return true;
  }

  calculateInvoiceTotal() {
    calculateInvoiceTotalCommon(this.tableData, this.contractForm);
  }
  async getPincodeDetails() {
    try {
      const pinCode = await getPincode(this.companyCode, this.masterService);

      if (pinCode) {
        this.filter.Filter(
          this.consigneeControlArray,
          this.tabForm,
          pinCode,
          this.consigneePincode,
          this.consigneePincodeStatus
        );

        this.filter.Filter(
          this.consignorControlArray,
          this.tabForm,
          pinCode,
          this.consignorPinCode,
          this.consignorPinCodeStatus
        );
      }
    } catch (error) {
      console.error("Error getting pincode details:", error);
    }
  }
}
