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
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { PrqService } from "src/app/Utility/module/operation/prq/prq.service";
import { CityService } from "src/app/Utility/module/masters/city/city.service";

@Component({
  selector: "app-prq-entry-page",
  templateUrl: "./prq-entry-page.component.html",
  providers: [FilterUtils],
})
export class PrqEntryPageComponent implements OnInit {
  prqControls: PrqEntryControls;
  prqEntryTableForm: UntypedFormGroup;
  jsonControlPrqArray: FormControls[];
  fromCity: string; //it's used in getCity() for the binding a fromCity
  fromCityStatus: boolean; //it's used in getCity() for binding fromCity
  toCity: string; //it's used in getCity() for binding ToCity
  toCityStatus: boolean; //it's used in getCity() for binding ToCity
  customer: string; //it's used in customerDetails() for binding billingParty
  billingPartyStatus: boolean; //it's used in customerDetails() for binding billingParty
  companyCode = parseInt(localStorage.getItem("companyCode"));
  fleetSize: string;
  fleetSizeStatus: boolean;
  ftlType: string;
  ftlTypeStatus: boolean;
  prqRaiseOn: string;
  prqRaiseOnStatus: boolean;
  transMode: string;
  transModeStatus: boolean;
  isUpdate: boolean;
  backPath:string;
  prqBranchCode: string;
  prqBranchStatus: boolean;
  pendingOperations = false;
  typeContainerCode: string;
  typeContainerStatus: boolean;
  containerSizeCode: string;
  containerSizeStatus: boolean;
  allPrqDetail: any;
  submit = 'Save';
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

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private router: Router,
    public dialog: MatDialog,
    private containerService: ContainerService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private cityService: CityService,
    private prqService: PrqService
  ) {
    this.prqDetail = new prqDetail({});
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.prqDetail = router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.breadScrums[0].active = 'PRQ Modify'
      this.breadScrums[0].title = 'PRQ Modify'
      this.submit = 'Modify';
      this.initializeFormControl();
    } else {
      this.initializeFormControl();
    }
  }

  ngOnInit(): void {
    this.bindDropDown();
    this.getCity();
    this.bindDataFromDropdown();
    this.backPath = "dashboard/Index?tab=6";
  }

  autoFill() {

    if (this.isUpdate) {
      this.prqEntryTableForm.controls["transMode"].setValue(
        this.prqDetail.transMode
      );
      this.disableSize()
      if(this.prqDetail.transMode=="trailer"){
      this.prqEntryTableForm.controls["vehicleSize"].setValue(
        this.prqDetail?.vehicleSize?.split("-")[0] ?? ""
      );
      }
      else{
        this.prqEntryTableForm.controls["vehicleSize"].setValue(
          this.prqDetail?.vehicleSize || ""
        );
      }
      this.prqEntryTableForm.controls["fromCity"].setValue({
        name: this.prqDetail.fromCity,
        value: this.prqDetail.fromCity,
      });
      this.prqEntryTableForm.controls["toCity"].setValue({
        name: this.prqDetail.toCity,
        value: this.prqDetail.toCity,
      });
      this.prqEntryTableForm.controls["billingParty"].setValue({
        name: this.prqDetail.billingParty,
        value: this.prqDetail.billingParty,
      });
      this.prqEntryTableForm.controls["containerSize"].setValue(
       this.prqDetail.containerSize
      );
      const containor= this.resContainer.find((x)=>x.name.trim()==this.prqDetail.typeContainer.trim())
      this.prqEntryTableForm.controls["typeContainer"].setValue(containor);
      this.prqEntryTableForm.controls["payType"].setValue(
        this.prqDetail.payType
      );
    } else {
      this.prqEntryTableForm.controls["transMode"].setValue("truck");
      this.prqEntryTableForm.controls["payType"].setValue("TBB");
    }
  }
  initializeFormControl() {
    // Create an instance of PrqEntryControls to get form controls for different sections
    this.prqControls = new PrqEntryControls(this.prqDetail, this.isUpdate);
    // Get form controls for PRQ Entry section
    this.jsonControlPrqArray = this.prqControls.getPrqEntryFieldControls();
    // Create the form group using the form builder and the form controls array
    this.prqEntryTableForm = formGroupBuilder(this.fb, [
      this.jsonControlPrqArray,
    ]);
    this.allFormGrop = this.jsonControlPrqArray;

  }
  bindDropDown() {
    const locationPropertiesMapping = {
      billingParty: { variable: "customer", status: "billingPartyStatus" },
      fleetSize: { variable: "fleetSize", status: "fleetSizeStatus" },
      fromCity: { variable: "fromCity", status: "fromCityStatus" },
      toCity: { variable: "toCity", status: "toCityStatus" },
      ftlType: { variable: "ftlType", status: "ftlTypeStatus" },
      prqRaiseOn: { variable: "prqRaiseOn", status: "prqRaiseOnStatus" },
      transMode: { variable: "transModeOn", status: "transModeOnStatus" },
      prqBranch: { variable: "prqBranchCode", status: "prqBranchStatus" },
      typeContainer: {
        variable: "typeContainerCode",
        status: "typeContainerStatus",
      },
      // containerSize: {
      //   variable: "containerSizeCode",
      //   status: "containerSizeStatus",
      // },
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

  async getCity() {
    try {
      const cityDetail = await this.cityService.getCity();

      if (cityDetail) {
        this.filter.Filter(
          this.jsonControlPrqArray,
          this.prqEntryTableForm,
          cityDetail,
          this.fromCity,
          this.fromCityStatus
        ); // Filter the docket control array based on fromCity details

        this.filter.Filter(
          this.jsonControlPrqArray,
          this.prqEntryTableForm,
          cityDetail,
          this.toCity,
          this.toCityStatus
        ); // Filter the docket control array based on toCity details
      }
      if(!this.isUpdate){
      this.prqEntryTableForm.controls['transMode'].setValue("truck");
      this.disableSize();

      }
    } catch (error) {
      console.error("Error getting city details:", error);
    }
  }
  cancel() {
    this.goBack(6);
  }
  // GetBranchChanges() {
  //   const locationDetail = this.locationDetail.filter(
  //     (x) =>
  //       x.city.toLowerCase() ===
  //       this.prqEntryTableForm.value.fromCity.name.toLowerCase()
  //   );
  //   this.filter.Filter(
  //     this.jsonControlPrqArray,
  //     this.prqEntryTableForm,
  //     locationDetail,
  //     this.prqBranchCode,
  //     this.prqBranchStatus
  //   );
  // }
  async save() {

    const tabcontrols = this.prqEntryTableForm;
    clearValidatorsAndValidate(tabcontrols);
    this.prqEntryTableForm.controls["typeContainer"].enable();
    this.prqEntryTableForm.controls["containerSize"].enable();
    this.prqEntryTableForm.controls["vehicleSize"].enable();
    this.prqEntryTableForm.controls["billingParty"].setValue(
      this.prqEntryTableForm.controls["billingParty"].value?.name || ""
    );
    this.prqEntryTableForm.controls["fromCity"].setValue(
      this.prqEntryTableForm.controls["fromCity"].value?.name || ""
    );
    this.prqEntryTableForm.controls["toCity"].setValue(
      this.prqEntryTableForm.controls["toCity"].value?.name || ""
    );
    this.prqEntryTableForm.controls["typeContainer"].setValue(
      this.prqEntryTableForm.controls["typeContainer"].value?.name || ""
    );
    // this.prqEntryTableForm.controls["containerSize"].setValue(
    //   this.prqEntryTableForm.controls["containerSize"].value?.name || ""
    // );
    const controlNames = ["transMode", "payType", "vehicleSize"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.prqEntryTableForm.value[controlName])) {
        this.prqEntryTableForm.controls[controlName].setValue("");
      }
    });
    if (!this.isUpdate) {
      const res = await this.prqService.addPrqData(
        this.prqEntryTableForm.value,
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Generated Successfully",
          text:  `Generated PRQ No: ${res.data.ops[0].prqNo}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack(6);
          }
        });
      }
    } else {
      this.prqEntryTableForm.removeControl('entryDate');
      const res = await this.prqService.updatePrqStatus(
        this.prqEntryTableForm.value,
      );

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `PRQ No: ${this.prqEntryTableForm.controls["prqNo"].value}`,
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
    // console.log(this.prqEntryTableForm.value);
  }
  goBack(tabIndex: number): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }
  async bindDataFromDropdown() {
    const resLoc = await this.locationService.locationFromApi();
    const resCust = await this.customerService.customerFromApi();
    this.customerList = resCust;
    this.resContainer = await this.containerService.containerFromApi();
    this.locationDetail = resLoc;
    if (this.isUpdate) {
      // const prqLoc = resLoc.find(
      //   (x) => x.value.trim() === this.prqDetail.prqBranch
      // );
      this.prqEntryTableForm.controls["prqBranch"].setValue(this.prqDetail.prqBranch);
    }

    // this.filter.Filter(
    //   this.jsonControlPrqArray,
    //   this.prqEntryTableForm,
    //   resLoc,
    //   this.prqBranchCode,
    //   this.prqBranchStatus
    // );
    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      resCust,
      this.customer,
      this.billingPartyStatus
    );
    this.autoFill();
  }

  async bilingChanged() {

    this.allPrqDetail = await this.prqService.getAllPrqDetail();
    const billingParty =
      this.prqEntryTableForm.controls["billingParty"].value?.name || "";
    let prqDetail = this.allPrqDetail.tableData
      .filter(
        (x) => x.billingParty.toLowerCase() === billingParty.toLowerCase()
      )
      .slice(0, 5);
    if (prqDetail.length > 0) {
      this.prqView(prqDetail);
      // Swal.fire({
      //   icon: "info",
      //   title: "Previous Billing Party Details",
      //   text: "You can now select the previous details of the billing party.",
      //   showCancelButton: true,
      //   confirmButtonText: "Yes",
      //   showConfirmButton: true,
      //   cancelButtonText: "No"
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     // Add your event code for "OK" here
      //     // This code will run when the user clicks "OK"
      //     this.prqView(prqDetail)
      //   }
      // });
    }
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
  autoFillPqrDetail(result) {
    if (result) {
      setControlValue(
        this.prqEntryTableForm.get("transMode"),
        result.transMode
      );
      if(result.transMode=="truck"){
      setControlValue(
        this.prqEntryTableForm.get("vehicleSize"),
        result?.vehicleSize?.split("-")[0] ?? ""
      );
      }
      else{
        setControlValue(this.prqEntryTableForm.get("containerSize"),
        result?.size?.split("-")[0] ?? ""

      );
      setControlValue(this.prqEntryTableForm.get("typeContainer"), {
        name: result.typeContainer,
        value: result.typeContainer,
      });
      }
      this.disableSize();
      setControlValue(this.prqEntryTableForm.get("fromCity"), {
        name: result.fromCity,
        value: result.fromCity,
      });
      setControlValue(this.prqEntryTableForm.get("toCity"), {
        name: result.toCity,
        value: result.toCity,
      });
      const billingParty = this.customerList.find(
        (x) => x.name.toLowerCase() === result.billingParty.toLowerCase()
      );
      setControlValue(this.prqEntryTableForm.get("billingParty"), billingParty);
      setControlValue(
        this.prqEntryTableForm.get("contactNo"),
        result.contactNo
      );

      setControlValue(this.prqEntryTableForm.get("pAddress"), result?.pAddress);
    }
  }

  disableSize() {

    if (this.prqEntryTableForm.controls['transMode'].value==="trailer") {
      //this.prqEntryTableForm.controls["vehicleSize"].disable();
      this.jsonControlPrqArray = this.allFormGrop.filter((x) => x.name !== "vehicleSize");
      // const foundItem = this.jsonControlPrqArray.find(x => x.name === 'hide');
      // if (foundItem) {
      //   foundItem.generatecontrol = false;
      // }

      // this.filter.Filter(
      //   this.jsonControlPrqArray,
      //   this.prqEntryTableForm,
      //   this.resContainer,
      //   this.containerSizeCode,
      //   this.containerSizeStatus
      // );

      this.filter.Filter(
        this.jsonControlPrqArray,
        this.prqEntryTableForm,
        this.resContainer,
        this.typeContainerCode,
        this.typeContainerStatus
      );
    } else {

      this.jsonControlPrqArray = this.allFormGrop.filter((x) => x.name != "containerSize" && x.name != "typeContainer");
    }
  }
  //#region to set size of container
  async setContainerSize() {
    const containerType = this.prqEntryTableForm.value.typeContainer.value
    let size = await this.containerService.getContainersByFilter(containerType)
    size = size[0].loadCapacity
    this.prqEntryTableForm.controls["containerSize"].setValue(size)
  }
  //#endregion
}
