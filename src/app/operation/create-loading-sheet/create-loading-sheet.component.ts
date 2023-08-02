import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { loadingControl } from "src/assets/FormControls/loadingSheet";
import { Router } from "@angular/router";
import { SwalerrorMessage } from "src/app/Utility/Validation/Message/Message";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { LodingSheetGenerateSuccessComponent } from "../loding-sheet-generate-success/loding-sheet-generate-success.component";
import { LoadingSheetViewComponent } from "../loading-sheet-view/loading-sheet-view.component";
import { filterCnoteDetails, filterDataByLocation, groupShipments } from "./loadingSheetCommon";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { setFormControlValue } from "src/app/Utility/commonFunction/setFormValue/setFormValue";

@Component({
  selector: "app-create-loading-sheet",
  templateUrl: "./create-loading-sheet.component.html",
})
/* Business logic separation is pending in this code. 
Currently, all flows are working together without proper separation.
 The separation will be implemented by Dhaval Patel.
  So, no need to worry about it for now. */
export class CreateLoadingSheetComponent implements OnInit {
  tableload = true;
  addAndEditPath: string;
  uploadComponent: any;
  loadingSheetData: any;
  csvFileName: string; // Name of the CSV file, when data is downloaded. You can also use a function to generate filenames based on dateTime.
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  height = "100vw";
  width = "100vw";
  maxWidth: "232vw";
  menuItems = [
    { label: "count", componentDetails: LoadingSheetViewComponent },
    // Add more menu items as needed
  ];
  // Declaring breadcrumbs
  breadscrums = [
    {
      title: "Create-Loading-Sheet",
      items: ["Loading-Sheet"],
      active: "Loading-Sheet",
    },
  ];
  linkArray = [{ Row: "count", Path: "" }];
  toggleArray = [];
  menuItemflag: boolean = true;
  isShipmentUpdate: boolean = false;
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tripData: any;
  extraData: any;
  vehicleType: any;
  vehicleTypeStatus: any;
  orgBranch: string = localStorage.getItem("Branch");
  shipmentData: any;
  tableData: any[];
  columnHeader = {
    checkBoxRequired: "",
    leg: "Leg",
    count: "Shipments",
    packages: "Packages",
    weightKg: "Weight Kg",
    volumeCFT: "Volume CFT",
  };
  centerAlignedData = ["leg", "packages", "weightKg", "volumeCFT"];
  // Declaring CSV file's header as key and value pair
  headerForCsv = {
    RouteandSchedule: "Leg",
    Shipments: "Shipments",
    Packages: "Packages",
    WeightKg: "Weight Kg",
    VolumeCFT: "Volume CFT",
  };

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  loadingData: any;
  shippingData: any;
  listDepartueDetail: any;
  getloadingFormData: any;
  legWiseData: any;
  updatedShipment: any[] = [];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  packagesScan: any;
  vehicleNoControlName: any;
  vehicleControlStatus: any;
  loadingSheetNo: any;
  docketApiRes: any;
  cnoteDetails: any;
  userName=localStorage.getItem("Username");
  constructor(
    private Route: Router,
    private _cnoteService: CnoteService,
    private _operationService: OperationService,
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      
      // Retrieve tripData and shippingData from the navigation state
      this.tripData =
        this.Route.getCurrentNavigation()?.extras?.state.data?.columnData ||
        this.Route.getCurrentNavigation()?.extras?.state.data;
      this.shippingData =
        this.Route.getCurrentNavigation()?.extras?.state.shipping;

      // Check if tripData meets the condition for navigation
      const routeMap = {
        "Depart Vehicle": "Operation/DepartVehicle",
        "Vehicle Loading": "Operation/VehicleLoading",
      };

      const route = routeMap[this.tripData.Action];

      if (route) {
        this.navigationService.navigateTo(route, this.tripData);
      }


    }

    // Initialize form controls
    this.IntializeFormControl();

    // Auto-bind data
    this.autoBindData();
  }

  autoBindData() {
    // Set the value of 'vehicle' form control with tripData's VehicleNo or getloadingFormData's vehicle or an empty string
    //setFormControlValue(this.loadingSheetTableForm.controls['vehicle'], this.tripData?.VehicleNo, this.getloadingFormData?.vehicle, '');

    // Set the value of 'Route' form control with tripData's RouteandSchedule or getloadingFormData's Route or an empty string
    setFormControlValue(
      this.loadingSheetTableForm.controls["Route"],
      this.tripData?.RouteandSchedule,
      this.getloadingFormData?.Route,
      ""
    );

    // Set the value of 'tripID' form control with tripData's TripID or getloadingFormData's TripID or an empty string
    setFormControlValue(
      this.loadingSheetTableForm.controls["tripID"],
      this.tripData?.TripID,
      this.getloadingFormData?.TripID,
      ""
    );
    setFormControlValue(
      this.loadingSheetTableForm.controls["vehicle"],
      { name:this.tripData?.VehicleNo,value:this.tripData?.VehicleNo},
      ""
    );
    setFormControlValue(
      this.loadingSheetTableForm.controls["tripID"],
      this.tripData?.TripID,
      this.getloadingFormData?.TripID,
      ""
    );
    // Set the value of 'Expected' form control with tripData's Expected or getloadingFormData's Expected or an empty string
    setFormControlValue(
      this.loadingSheetTableForm.controls["Expected"],
      this.tripData?.Expected,
      this.getloadingFormData?.Expected,
      ""
    );

    // Set the value of 'LoadingLocation' form control with the value retrieved from localStorage for 'Branch'
    setFormControlValue(
      this.loadingSheetTableForm.controls["LoadingLocation"],
      localStorage.getItem("Branch"),
      ""
    );

    this.vehicleTypeDropdown(); // Call the vehicleTypeDropdown() method
    this.GetVehicleDropDown();
  }

  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new loadingControl();

    // Get the form controls from the loadingControlFormControls instance
    this.jsonControlArray =
      loadingControlFormControls.getMarkArrivalsertFormControls();

    // Loop through the jsonControlArray to find the vehicleType control and set related properties
    this.jsonControlArray.forEach((data) => {
      if (data.name === "vehicleTypecontrolHandler") {
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "vehicle") {
        this.vehicleNoControlName = data.name;
        this.vehicleControlStatus = data.additionalData.showNameAndValue;
      }
    });

    // Build the form group using the form controls obtained
    this.loadingSheetTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
  }

  ngOnInit(): void { }

  functionCallHandler($event) {
    // console.log("fn handler called", $event);

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

  IsActiveFuntion($event) {
    // Assign the value of $event to the loadingData property
    this.loadingData = $event;
  }

  // Function to retrieve vehicle types from JSON file and populate the dropdown
  vehicleTypeDropdown() {
    this._operationService
      .getJsonFileDetails("loadingJsonUrl")
      .subscribe((res) => {
        this.loadingSheetData = res;
        let vehicleType: any[] = [];
        if (this.loadingSheetData) {
          this.loadingSheetData.data[0].forEach((element) => {
            let json = {
              name: element.Type_Name,
              value: element.Type_Code,
            };
            vehicleType.push(json);
          });
        }
        // Apply filter to control array based on vehicle types
        this.filter.Filter(
          this.jsonControlArray,
          this.loadingSheetTableForm,
          vehicleType,
          this.vehicleType,
          this.vehicleTypeStatus
        );

        const vehTypeValue = this.tripData?.VehicleType?.trim() || "";
        // Set the default vehicle type if it matches any in the dropdown options
        let vehicleTypeDetails = vehicleType.find(
          (x) => x.name.trim() == vehTypeValue
        );
        if (vehicleTypeDetails) {
          this.loadingSheetTableForm.controls["vehicleType"].setValue(
            vehicleTypeDetails
          );
          this.vehicleTypeDataAutofill();
        }
      });
    // Retrieve shipment data
    this.getshipmentData();
  }
  // Function to retrieve departure details based on the route
  getDepartueDetail(route) {
    this._operationService
      .getJsonFileDetails("departureJsonUrl")
      .subscribe((res) => {
        this.listDepartueDetail = res;
        // Find the departure detail that matches the given route
        this.tripData = this.listDepartueDetail.data.find(
          (x) => x.RouteandSchedule == route
        );
        if (!this.getloadingFormData) {
          // Auto-bind data if loading form data is not available
          this.autoBindData();
        }
      });
  }

  // Function to retrieve shipment data
  getshipmentData() {
    if (!this.isShipmentUpdate) {
      let routeDetail =
        this.tripData?.RouteandSchedule.split(":")[1].split("-");
      routeDetail = routeDetail.map((str) =>
        String.prototype.replace.call(str, " ", "")
      );
      // Update route details if shipment is not being updated
    }
    const req = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
    };
    this._operationService
      .operationPost("common/getall", req)
      .subscribe((res) => {
        this.shipmentData = res.data.filter((x) => x.lsNo == "");
        // Filter shipment data based on location and trip details
        const filterData = filterDataByLocation(
          this.shipmentData,
          this.tripData,
          this.orgBranch
        );
        //Here i user cnoteDetails varible to used in updateDocketDetails() method
        this._cnoteService.setShipingData(filterData.legWiseData);
        this.cnoteDetails = filterData.legWiseData;
        const shipingfilterData = filterData.legWiseData;
        // Call the function to group shipments based on criteria
        const groupedShipments = groupShipments(shipingfilterData);
        console.log(groupedShipments);
        this.tableData = groupedShipments;
        this.tableload = false;
      });
  }
  // Function to autofill vehicle type data
  vehicleTypeDataAutofill() {
    // Check if tripID is not already set

    let loadingSheetDetails = this.loadingSheetData.data[0].find(
      (x) =>
        x.Type_Code == this.loadingSheetTableForm.value?.vehicleType.value || ""
    );
    // Find the matching vehicle type details

    if (loadingSheetDetails) {
      // Set control values based on loading sheet details
      const controlNames = [
        "CapacityKg",
        "CapacityVolumeCFT",
        "LoadaddedKg",
        "LoadedKg",
        "LoadedvolumeCFT",
        "VolumeaddedCFT",
        "VolumeUtilization",
        "WeightUtilization",
      ];

      controlNames.forEach((controlName) => {
        this.loadingSheetTableForm.controls[controlName].setValue(
          loadingSheetDetails[controlName] || ""
        );
      });

    }
  }

  loadingSheetGenerate() {

    if (!this.loadingSheetTableForm.value.vehicle) {
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
    } else {
      if (this.loadingData) {
        this.loadingData.forEach(obj => {
          const randomNumber = "Ls/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
          obj.LoadingSheet = randomNumber;
          obj.Action = "Print";
        });
        this.addTripData();
        const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> =
          this.dialog.open(LodingSheetGenerateSuccessComponent, {
            width: "100%", // Set the desired width
            data: this.loadingData, // Pass the data object
          });

        dialogRef.afterClosed().subscribe((result) => {
          this.goBack(3);
          // Handle the result after the dialog is closed
        });
      } else {
        SwalerrorMessage("error", "Please Select Any one Record", "", true);
      }
    }
  }

  updateLoadingData(event) {

    let packages = event.shipping.reduce(
      (total, current) => total + current.Packages,
      0
    );
    let totalWeightKg = event.shipping.reduce(
      (total, current) => total + current.KgWeight,
      0
    );
    let totalVolumeCFT = event.shipping.reduce(
      (total, current) => total + current.CftVolume,
      0
    );
    this.tableData.find((x) => {
      if (
        x.leg.replace(" ", "").trim() ===
        (event.shipping[0].Origin + "-" + event.shipping[0].Destination).trim()
      ) {
        (x.count = event.shipping.length),
          (x.weightKg = totalWeightKg),
          (x.volumeCFT = totalVolumeCFT),
          (x.packages = packages);
      }
    });
    // this.getshipmentData(event)
    this.cnoteDetails = filterCnoteDetails(this.cnoteDetails, event.shipping)
    this._cnoteService.setShipingData(this.cnoteDetails);
  }

  // get vehicleNo
  GetVehicleDropDown() {
    const vehRequest = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "vehicle_status",
    };

    // Fetch data from the JSON endpoint
    this._operationService
      .operationPost("common/getall", vehRequest)
      .subscribe((res) => {
        if (res) {

          let vehicleDetails = res.data
            .filter((x) => x.status === "available" && x.currentLocation === this.orgBranch)
            .map((x) => {
              return { name: x.vehNo, value: x.vehNo };
            });

          this.filter.Filter(
            this.jsonControlArray,
            this.loadingSheetTableForm,
            vehicleDetails,
            this.vehicleNoControlName,
            this.vehicleControlStatus
          );
        }
      });
  }

  //Add tripData
  async addTripData() {
    if (this.loadingSheetTableForm.controls["tripID"].value === 'System Generated' || !this.loadingSheetTableForm.controls["tripID"].value) {
      const randomNumber =
        "TH/" +
        this.orgBranch +
        "/" +
        2223 +
        "/" +
        Math.floor(Math.random() * 100000);
      this.loadingSheetTableForm.controls["tripID"].setValue(randomNumber);
      // Generate and set a random tripID if not already set
    }
    let tripDetails = {
      startTime: new Date(),
      vehicleNo: this.loadingSheetTableForm.value.vehicle.value,
      tripId: this.loadingSheetTableForm.value.tripID,
      status: "Vehicle Loading",
      updateBy:this.userName,
      updateDate:new Date().toISOString()
    };
    const reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "trip_detail",
      id: this.tripData.id,
      updates: {
        ...tripDetails,
      },
    };
    try {
      // Await the API call's response before proceeding
      const res = await this._operationService.operationPut("common/update", reqBody).toPromise();
      if (res) {
        // If response is successful, call the next function
        await this.getDetailsByLeg();
      }
    } catch (error) {
      // Handle any errors that might occur during the API call
      console.error('Error occurred during the API call:', error);
    }
  }
  async getDetailsByLeg() {
    for (const leg of this.loadingData) {
      const org_loc = leg.leg.split("-")[0].trim();
      const destination = leg.leg.split("-")[1].trim();

      const matchingShipments = this.cnoteDetails.filter(
        (shipment) =>
          shipment.orgLoc === org_loc &&
          shipment.destination.split(":")[1].trim() === destination
      );

      // Call the addLsDetails function and await its completion before proceeding
      await this.addLsDetails(leg);

      if (matchingShipments.length > 0) {
        for (const matchingShipment of matchingShipments) {
          await this.updateDocketDetails(matchingShipment.docketNumber, leg.LoadingSheet);
        }
      } else {
        // console.log(`No matching details found for the leg: ${leg.leg}`);
      }
    }
  }

  async updateDocketDetails(docket, lsNo) {

    let loadingSheetData = {
      lsNo: lsNo,
    };
    const reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
      id: docket,
      updates: {
        ...loadingSheetData
      },
    };

    try {
      const res = await this._operationService.operationPut("common/update", reqBody).toPromise();
      if (res) {
        await this.updateVehicleStatus();
      }
    } catch (error) {
      console.error('Error occurred during the API call:', error);
    }
  }

  async addLsDetails(leg) {
    const lsDetails = {
      id: leg.LoadingSheet,
      lsno: leg.LoadingSheet,
      leg: leg.leg,
      vehno: this.loadingSheetTableForm.value.vehicle.value,
      vehType: this.loadingSheetTableForm.value.vehicleType.name,
      tripId: this.loadingSheetTableForm.value?.tripID,
      location: this.orgBranch,
      pacakges: leg.packages,
      weightKg: leg.weightKg,
      volumeCFT: leg.volumeCFT,
      entryBy:this.userName,
      entryData:new Date().toISOString()
    };
    const reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "loadingSheet_detail",
      data: lsDetails,
    };
    try {
      const res = await this._operationService.operationPost("common/create", reqBody).toPromise();
      if (res) {
        // Perform any necessary actions after the API call
      }
    } catch (error) {
      console.error('Error occurred during the API call:', error);
    }
  }
  updateVehicleStatus() {

    const vehicleDetails = {
      status: "On trip",
      tripId: this.loadingSheetTableForm.value?.tripID,
      route:this.tripData?.RouteandSchedule
    };
    const reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "vehicle_status",
      id: this.loadingSheetTableForm.value.vehicle.value,
      updates: {
        ...vehicleDetails,
      },
    };
    this._operationService.operationPut("common/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {

        }
      },
    });
  }
  goBack(tabIndex: number): void {
    this.navigationService.navigateTotab(
      tabIndex,
      "/dashboard/GlobeDashboardPage"
    );
  }
}
