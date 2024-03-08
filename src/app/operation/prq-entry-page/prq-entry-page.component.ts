import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { PrqEntryControls } from "src/assets/FormControls/prq-entry";
import { processProperties } from "src/app/Masters/processUtility";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { Router } from "@angular/router";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { prqDetail } from "src/app/core/models/operations/prq/prq";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { PrqListComponent } from "./prq-list/prq-list.component";
import { setControlValue } from "src/app/Utility/Form Utilities/setform";
import { ContainerService } from "src/app/Utility/module/masters/container/container.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { PrqService } from "src/app/Utility/module/operation/prq/prq.service";
import { customerFromApi } from "./prq-utitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { StorageService } from "src/app/core/service/storage.service";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { rules } from "src/app/Utility/commonFunction/rules/rule";

@Component({
  selector: "app-prq-entry-page",
  templateUrl: "./prq-entry-page.component.html",
  providers: [FilterUtils],
})
export class PrqEntryPageComponent implements OnInit {
  prqControls: PrqEntryControls;
  prqEntryTableForm: UntypedFormGroup;
  jsonControlPrqArray: FormControls[];
  iSShow: boolean = true;
  fromCity: string; //it's used in getCity() for the binding a fromCity
  fromCityStatus: boolean; //it's used in getCity() for binding fromCity
  toCity: string; //it's used in getCity() for binding ToCity
  toCityStatus: boolean; //it's used in getCity() for binding ToCity
  customer: string; //it's used in customerDetails() for binding billingParty
  billingPartytatus: boolean; //it's used in customerDetails() for binding billingParty
  companyCode = parseInt(localStorage.getItem("companyCode"));
  fleetSize: string;
  fleetSizeStatus: boolean;
  ftlType: string;
  ftlTypeStatus: boolean;
  prqRaiseOn: string;
  prqRaiseOnStatus: boolean;
  carrierType: string;
  carrierTypeStatus: boolean;
  isUpdate: boolean;
  backPath: string;
  prqBranchCode: string;
  prqBranchStatus: boolean;
  pendingOperations = false;
  typeContainerCode: string;
  typeContainerStatus: boolean;
  containerSizeCode: string;
  containerSizeStatus: boolean;
  allPrqDetail: any;
  submit = "Save";
  breadScrums = [
    {
      title: "PRQ Entry",
      items: ["PRQ"],
      active: "PRQ Entry",
    },
  ];
  prqDetail: prqDetail;
  isConfirm: boolean;
  locationDetail: any;
  customerList: any;
  allFormGrop: FormControls[];
  resContainer: any;
  branchCode = localStorage.getItem("Branch");
  paymentBase: any;
  vehicleType: any;
  AddressStatus: any;
  Address: string;
  userLocations: any;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private router: Router,
    public dialog: MatDialog,
    private operationService: OperationService,
    private containerService: ContainerService,
    private locationService: LocationService,
    private pinCodeService: PinCodeService,
    private prqService: PrqService,
    private storage: StorageService,
    private customerService: CustomerService,
    private generalService: GeneralService,
    private masterService: MasterService
  ) {
    this.prqDetail = new prqDetail({});
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.prqDetail = router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.breadScrums[0].active = "PRQ Modify";
      this.breadScrums[0].title = "PRQ Modify";
      this.submit = "Modify";
    }
    this.initializeFormControl();
    this.getGeneralmasterData();
  }

  ngOnInit(): void {
    this.mapControls();
    this.getFromCity();
    this.bindDataFromDropdown();
    this.backPath = "dashboard/Index?tab=6";
  }

  autoFill() {
    if (this.isUpdate) {
      this.prqEntryTableForm.controls["cARTYP"].setValue(
        `${this.prqDetail.carrierTypeCode}`
      );
      this.disableSize();

      if (this.prqDetail.carrierTypeCode == "3") {
        const containerlist = this.resContainer.find(
          (x) =>
            x.name == this.prqDetail?.typeContainer ||
            x.value == this.prqDetail?.typeContainerCode
        );
        this.prqEntryTableForm.controls["cNTYP"].setValue(containerlist);
      } else {
        this.prqEntryTableForm.controls["vEHSIZE"].setValue(
          `${this.prqDetail?.vehicleSizeCode || ""}`
        );
      }
      this.prqEntryTableForm.controls["fCITY"].setValue({
        name: this.prqDetail.fromCity,
        value: this.prqDetail.fromCity,
      });
      this.prqEntryTableForm.controls["tCITY"].setValue({
        name: this.prqDetail.toCity,
        value: this.prqDetail.toCity,
      });
      this.prqEntryTableForm.controls["bPARTY"].setValue({
        name: this.prqDetail.billingParty,
        value: this.prqDetail.billingPartyCode,
      });
      this.prqEntryTableForm.controls["cNTSIZE"].setValue(
        this.prqDetail.containerSize
      );
      this.prqEntryTableForm.controls["pADD"].setValue({
        name: this.prqDetail.pAddress,
        value: this.prqDetail.pAddressName,
      });
      this.prqEntryTableForm.controls["pAYTYP"].setValue(
        `${this.prqDetail?.payTypeCode || ""}`
      );
    } else {
      this.prqEntryTableForm.controls["cARTYP"].setValue("1");
      this.prqEntryTableForm.controls["pAYTYP"].setValue("P02");
    }
  }

  initializeFormControl() {
    // Create an instance of PrqEntryControls to get form controls for different sections
    this.prqControls = new PrqEntryControls(
      this.prqDetail,
      this.isUpdate,
      rules
    );
    // Get form controls for PRQ Entry section
    this.jsonControlPrqArray = this.prqControls.getPrqEntryFieldControls();
    this.jsonControlPrqArray.forEach((data) => {
      if (data.name === "pADD") {
        // Set location-related variables
        this.Address = data.name;
        this.AddressStatus = data.additionalData.showNameAndValue;
      }
    });
    // Create the form group using the form builder and the form controls array
    this.prqEntryTableForm = formGroupBuilder(this.fb, [
      this.jsonControlPrqArray,
    ]);
    this.allFormGrop = this.jsonControlPrqArray;
    if (!this.isUpdate) {
      this.prqEntryTableForm.controls['oDRDT'].setValue("");
    }

  }

  mapControls() {
    const locationPropertiesMapping = {
      bPARTY: { variable: "customer", status: "billingPartytatus" },
      fleetSize: { variable: "fleetSize", status: "fleetSizeStatus" },
      fCITY: { variable: "fromCity", status: "fromCityStatus" },
      tCITY: { variable: "toCity", status: "toCityStatus" },
      ftlType: { variable: "ftlType", status: "ftlTypeStatus" },
      prqRaiseOn: { variable: "prqRaiseOn", status: "prqRaiseOnStatus" },
      cRTTYP: { variable: "carrierTypeOn", status: "carrierTypeOnStatus" },
      bRCD: { variable: "prqBranchCode", status: "prqBranchStatus" },
      cNTYP: {
        variable: "typeContainerCode",
        status: "typeContainerStatus",
      },
    };
    processProperties.call(
      this,
      this.jsonControlPrqArray,
      locationPropertiesMapping
    );
  }

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  /*below the method a getting a default city Based on Location*/
  async getFromCity() {
    try {
      if (!this.isUpdate) {
        this.prqEntryTableForm.controls["cARTYP"].setValue("truck");
        this.disableSize();
      }
    } catch (error) {
      console.error("Error getting city details:", error);
    }
  }
  /*End*/

  //#region get Address Details
  async getAddressDetails() {
    const addressRequest = {
      companyCode: this.companyCode,
      collectionName: "address_detail",
      filters: [
        {
          D$match: {
            cityName: this.prqEntryTableForm.controls["fCITY"].value.value,
            customer: {
              D$elemMatch: {
                code:
                  this.prqEntryTableForm.controls["bPARTY"].value?.value || "",
              },
            },
          },
        },
      ],
    };
    const address = await firstValueFrom(
      this.masterService.masterPost("generic/query", addressRequest)
    );
    const addressList = address.data.map((item) => {
      return {
        name: item.address,
        value: item.addressCode,
      };
    });
    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      addressList,
      this.Address,
      this.AddressStatus
    );
  }
  //#endregion

  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(
      this.prqEntryTableForm,
      this.allFormGrop,
      event.field.name,
      this.billingPartytatus
    );
  }

  async getGeneralmasterData() {
    const carrierType: AutoComplete[] =
      await this.generalService.getGeneralMasterData("CARTYP");
    const vehicleType: AutoComplete[] =
      await this.generalService.getGeneralMasterData("VEHSIZE");
    const paymentBase: AutoComplete[] =
      await this.generalService.getGeneralMasterData("PAYTYP");
    this.paymentBase = paymentBase;
    this.vehicleType = vehicleType;

    this.setGeneralMasterData(this.allFormGrop, carrierType, "cARTYP");
    this.setGeneralMasterData(this.allFormGrop, vehicleType, "vEHSIZE");
    this.setGeneralMasterData(this.allFormGrop, paymentBase, "pAYTYP");

    this.autoFill();
  }

  setGeneralMasterData(
    controls: any[],
    data: AutoComplete[],
    controlName: string
  ) {
    const control = controls.find((x) => x.name === controlName);
    if (control) {
      control.value = data;
    }
  }

  /*below the method for the getting a CityName for PinCode Collection*/
  async getPincodeDetail(event) {
    const cityMapping = event.field.name == "tCITY" ?? this.fromCityStatus;
    this.pinCodeService.getCity(
      this.prqEntryTableForm,
      this.jsonControlPrqArray,
      event.field.name,
      cityMapping
    );
  }
  /*End*/
  /*below the method for the getting a CityName for PinCode Collection*/
  async getFromCityDetail(event) {
    const fcityMapping = event.field.name == "fCITY" ?? this.fromCityStatus;
    this.pinCodeService.getCity(
      this.prqEntryTableForm,
      this.jsonControlPrqArray,
      event.field.name,
      fcityMapping
    );
  }
  /*End*/

  cancel() {
    this.goBack(6);
  }

  async save() {
    this.iSShow = false;
    const tabcontrols = this.prqEntryTableForm;
    let prqDetails = { ...this.prqEntryTableForm.value };

    prqDetails["cID"] = this.storage.companyCode;
    prqDetails["bPARTY"] = this.prqEntryTableForm.value.bPARTY.value;
    prqDetails["bPARTYNM"] = this.prqEntryTableForm.value.bPARTY.name;
    prqDetails["fCITY"] = this.prqEntryTableForm.value.fCITY.name;
    prqDetails["tCITY"] = this.prqEntryTableForm.value.tCITY.name;
    prqDetails["bRCD"] = this.prqEntryTableForm.value.bRCD.name;
    prqDetails["pADD"] = this.prqEntryTableForm.value.pADD?.value || "A8888";
    prqDetails["pADDNM"] = this.prqEntryTableForm.value.pADD?.name || this.prqEntryTableForm.value.pADD;

    const cntrNames = [
      { controlName: "cARTYP", name: "cARTYPNM", value: "cARTYP" },
      { controlName: "vEHSIZE", name: "vEHSIZENM", value: "vEHSIZE" },
      { controlName: "pAYTYP", name: "pAYTYPNM", value: "pAYTYP" },
    ];

    cntrNames.forEach((c) => {
      let ctrl = this.prqEntryTableForm.controls[c.controlName];
      if (ctrl && ctrl.value) {
        prqDetails[c.value] = ctrl.value;
        let cData = this.allFormGrop
          .find((f) => f.name == c.controlName)
          .value.find((f) => f.value == ctrl.value);
        if (cData) {
          prqDetails[c.name] = cData.name;
        }
      }
    });

    if (prqDetails.cARTYP == "3") {
      prqDetails["cNTSIZE"] = this.prqEntryTableForm.value.cNTSIZE;
      prqDetails["cNTYP"] = this.prqEntryTableForm.value.cNTYP.value;
      prqDetails["cNTYPNM"] = this.prqEntryTableForm.value.cNTYP.name;
      prqDetails["vEHSIZE"] = 0;
      prqDetails["vEHSIZENM"] = "";
    } else {
      prqDetails["cNTSIZE"] = 0;
      prqDetails["cNTYP"] = 0;
      prqDetails["cNTYPNM"] = "";
    }

    prqDetails["sTS"] = 0;
    prqDetails["sTSNM"] = "Awaiting Confirmation";

    clearValidatorsAndValidate(tabcontrols);
    this.prqEntryTableForm.controls["cNTYP"].enable();
    this.prqEntryTableForm.controls["cNTSIZE"].enable();
    this.prqEntryTableForm.controls["vEHSIZE"].enable();

    this.prqEntryTableForm.controls["bPARTY"].setValue(
      this.prqEntryTableForm.controls["bPARTY"].value?.name || ""
    );
    this.prqEntryTableForm.controls["fCITY"].setValue(
      this.prqEntryTableForm.controls["fCITY"].value?.name || ""
    );
    this.prqEntryTableForm.controls["tCITY"].setValue(
      this.prqEntryTableForm.controls["tCITY"].value?.name || ""
    );
    this.prqEntryTableForm.controls["cNTYP"].setValue(
      this.prqEntryTableForm.controls["cNTYP"].value?.name || ""
    );

    const controlNames = ["cARTYP", "pAYTYP", "vEHSIZE"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.prqEntryTableForm.value[controlName])) {
        this.prqEntryTableForm.controls[controlName].setValue("");
      }
    });

    if (!this.isUpdate) {
      prqDetails["docNo"] = "";
      prqDetails["pRQNO"] = "";
      prqDetails["eNTDT"] = new Date();
      prqDetails["eNTLOC"] = this.storage.branch;
      prqDetails["eNTBY"] = this.storage.userName;

      const res = await this.prqService.addPrqData(prqDetails);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Generated Successfully",
          text: `Generated PRQ No: ${res.data.ops[0].pRQNO}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack(6);
          }
        });
      }
    } else {
      prqDetails["mODDT"] = new Date();
      prqDetails["mODLOC"] = this.storage.branch;
      prqDetails["mODBY"] = this.storage.userName;

      const res = await this.prqService.updatePrqStatus(prqDetails);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `PRQ No: ${this.prqEntryTableForm.controls["pRQNO"].value}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack(6);
          }
        });
      }
      // const tabIndex = 6; // Adjust the tab index as needed
      // showConfirmationDialog(this.prqEntryTableForm.value, this.masterService, this.goBack.bind(this), tabIndex);
    }
    this.iSShow = true;
    // console.log(this.prqEntryTableForm.value);
  }
  goBack(tabIndex: number): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }
  async bindDataFromDropdown() {
    this.resContainer = await this.containerService.containerFromApi();
    let locList = localStorage.getItem('userLocations');
    let locations = locList.split(",")
    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      locations.map((x) => { return { name: x, value: x } }),
      "bRCD",
      false
    );
    if (this.isUpdate) {
      this.prqEntryTableForm.controls["bRCD"].setValue(
        { value: this.prqDetail.prqBranch, name: this.prqDetail.prqBranch }
      );
    }
  }

  async bilingChanged() {
    const billingParty =
      this.prqEntryTableForm.controls["bPARTY"].value?.value || "";

    this.allPrqDetail = await this.prqService.getAllPrqDetailWithFilters(
      billingParty
    );

    let prqDetail = this.allPrqDetail.tableData
      // .filter(
      //   (x) => x.bPARTY.toLowerCase() === billingParty.toLowerCase()
      // )
      .slice(0, 5);
    if (prqDetail.length > 0) {
      this.prqView(prqDetail);
    }
    this.getAddressDetails();
  }

  prqView(prqDetail) {
    const dialogref = this.dialog.open(PrqListComponent, {
      width: "100vw",
      height: "100vw",
      maxWidth: "232vw",
      data: prqDetail,
    });
    dialogref.afterClosed().subscribe((result) => {
      this.autoFillPqrDetail(result[0]);
    });
  }

  async autoFillPqrDetail(result) {
    if (result) {
      setControlValue(
        this.prqEntryTableForm.get("cARTYP"),
        result.carrierTypeCode.toString()
      );
      if (result.carrierType?.toLowerCase() != "container") {
        setControlValue(
          this.prqEntryTableForm.get("vEHSIZE"),
          result?.vehicleSizeCode ?? ""
        );
      } else {
        setControlValue(
          this.prqEntryTableForm.get("cNTSIZE"),
          result?.containerSize ?? ""
        );
        setControlValue(this.prqEntryTableForm.get("cNTYP"), {
          name: result.typeContainer,
          value: result.typeContainerCode,
        });
      }
      this.disableSize();
      setControlValue(this.prqEntryTableForm.get("fCITY"), {
        name: result.fromCity,
        value: result.fromCity,
      });
      setControlValue(this.prqEntryTableForm.get("tCITY"), {
        name: result.toCity,
        value: result.toCity,
      });
      setControlValue(this.prqEntryTableForm.get("bPARTY"), {
        name: result.billingParty,
        value: result.billingPartyCode,
      });
      setControlValue(this.prqEntryTableForm.get("pHNO"), result.contactNo);

      setControlValue(this.prqEntryTableForm.get("pADD"), result?.pAddress);
    }
  }

  disableSize() {
    if (this.prqEntryTableForm.controls["cARTYP"].value === "3") {
      this.jsonControlPrqArray = this.allFormGrop.filter(
        (x) => x.name !== "vEHSIZE"
      );

      this.filter.Filter(
        this.jsonControlPrqArray,
        this.prqEntryTableForm,
        this.resContainer,
        this.typeContainerCode,
        this.typeContainerStatus
      );
    } else {
      this.jsonControlPrqArray = this.allFormGrop.filter(
        (x) => x.name != "cNTSIZE" && x.name != "cNTYP"
      );
    }
  }
  //#region to set size of container
  async setContainerSize() {
    const containerType = this.prqEntryTableForm.value.cNTYP.value;
    let size = await this.containerService.getContainersByFilter(containerType);
    size = size[0].loadCapacity;
    this.prqEntryTableForm.controls["cNTSIZE"].setValue(size);
    this.prqEntryTableForm.controls["sIZE"].setValue(size);
  }
  //#endregion
  async setVehicleSize() {
    const vehcileSize = this.prqEntryTableForm.value.vEHSIZE;
    this.prqEntryTableForm.controls["sIZE"].setValue(vehcileSize);
  }
  InvockedContract() {
    console.log(this.prqEntryTableForm.value);

    const paymentBasesName = this.paymentBase.find(
      (x) => x.value == this.prqEntryTableForm.value.pAYTYP
    ).name;
    // const TransMode = this.products.find(x => x.value == this.model.consignmentTableForm.value.transMode).name;
    let containerCode;
    if (this.prqEntryTableForm.value?.cARTYP == "3") {
      containerCode = this.prqEntryTableForm.value.cNTYP?.value;
    } else {
      containerCode = this.prqEntryTableForm.value.vEHSIZE;
    }
    let reqBody = {
      companyCode: this.storage.companyCode,
      customerCode: this.prqEntryTableForm.value.bPARTY.value,
      contractDate: this.prqEntryTableForm.value.pICKDT,
      productName: "Road",
      basis: paymentBasesName,
      from: this.prqEntryTableForm.value.fCITY.value,
      to: this.prqEntryTableForm.value.tCITY.value,
      capacity: containerCode,
    };

    firstValueFrom(
      this.operationService.operationMongoPost(
        "operation/docket/invokecontract",
        reqBody
      )
    )
      .then((res: any) => {
        if (res.length == 1) {
          Swal.fire({
            icon: "success",
            title: "Contract Invoked Successfully",
            text: "ContractId: " + res[0].docNo,
            showConfirmButton: false,
          });

          if (res[0].FreightChargeMatrixDetails?.rTYPCD == "RTTYP-0007") {
            const contractAmount = res[0]?.FreightChargeMatrixDetails?.rT * this.prqEntryTableForm?.value?.cNTSIZE
            this.prqEntryTableForm.controls["cONTRAMT"].setValue(contractAmount);
          }
          else {
            const contractAmount = res[0]?.FreightChargeMatrixDetails?.rT * (containerCode * 1000);
            this.prqEntryTableForm.controls["cONTRAMT"].setValue(contractAmount);
          }


        } else {
          Swal.fire({
            icon: "info",
            title: "info",
            text: "Contract Invoked Failed",
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong! ${err.message}`,
          showConfirmButton: false,
        });
      });
  }
}
