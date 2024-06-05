import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AddressMaster } from "src/app/core/models/Masters/address-master";
import { AddressControl } from "src/assets/FormControls/address-master";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";

@Component({
  selector: "app-address-master-add",
  templateUrl: "./address-master-add.component.html",
})
export class AddressMasterAddComponent implements OnInit {
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: true;
    toggle: boolean;
  }[];
  companyCode: any = 0;
  addressTabledata: AddressMaster;
  addressTableForm: UntypedFormGroup;
  addressFormControls: AddressControl;
  //#region Variable Declaration
  jsonControlGroupArray: any;
  pincodeList: any;
  pincodeStatus: any;
  pincodeData: any;
  isUpdate = false;
  action: string;
  pincodeDet: any;
  addressData: any;
  newAddressCode: string;
  backPath: string;
  data: any;
  pincodeDataFetched = false;
  submit = "Save";
  protected _onDestroy = new Subject<void>();
  customerName: any;
  customerNameStatus: any;
  isSubmit: boolean = false;

  //#endregion
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    public StorageServiceI: StorageService,
    private objPinCodeService: PinCodeService,
    public snackBarUtilityService: SnackBarUtilityService,

  ) {
    this.companyCode = this.StorageServiceI.companyCode;
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.action = "edit";
      this.submit = "Modify";
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }

    if (this.action === "edit") {
      this.isUpdate = true;
      this.addressTabledata = this.data;
      this.breadScrums = [
        {
          generatecontrol: true,
          toggle: this.data.activeFlag,
          title: "Modify Address",
          items: ["Home"],
          active: "Modify Address",
        },
      ];
    } else {
      this.breadScrums = [
        {
          generatecontrol: true,
          toggle: true,
          title: "Add Address",
          items: ["Home"],
          active: "Add Address",
        },
      ];
      this.addressTabledata = new AddressMaster({});
    }

    this.initializeFormControl();
  }

  ngOnInit() {
    //this.getPincodeData();
    this.backPath = "/Masters/AddressMaster/AddressMasterList";
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

  initializeFormControl() {
    this.addressFormControls = new AddressControl(
      this.addressTabledata,
      this.isUpdate
    );
    this.jsonControlGroupArray = this.addressFormControls.getFormControls();
    this.addressTableForm = formGroupBuilder(this.fb, [
      this.jsonControlGroupArray,
    ]);
    this.bindDropdown();
    this.getdata();
  }
  bindDropdown() {
    this.jsonControlGroupArray.forEach((data) => {
      if (data.name === "pincode") {
        // Set Pincode related variables
        this.pincodeList = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "customer") {
        // Set Pincode related variables
        this.getCustomerNameData(
          data.name,
          data.additionalData.showNameAndValue
        );
      }
    });
  }
  async getdata() {
    if (this.isUpdate) {
      this.addressTableForm.controls["pincode"].patchValue(
        { name: this.addressTabledata.pincode, value: this.addressTabledata.pincode }
      );
    }
  }
  cancel() {
    this.Route.navigateByUrl("/Masters/AddressMaster/AddressMasterList");
  }
  //#region Pincode Dropdown

  async getPincodeData() {
    await this.fetchPincodeData();
  }

  // async fetchPincodeData() {
  //   const pincodeReq = {
  //     companyCode: this.companyCode,
  //     collectionName: "pincode_master",
  //     filter: {},
  //   };

  //   try {
  //     const pincodeRes = await this.masterService
  //       .masterPost("generic/get", pincodeReq)
  //       .toPromise();
  //     this.pincodeDet = pincodeRes?.data || [];
  //     const pincodeList = this.pincodeDet.map((x) => ({
  //       name: x.PIN.toString(),
  //       value: x.PIN.toString(),
  //     }));

  //     const pincodeValue = this.addressTableForm.controls["pincode"].value;

  //     if (this.isUpdate && !this.pincodeDataFetched) {
  //       const updatePin = pincodeList.find((x) => x.value == this.data.pincode);
  //       this.addressTableForm.controls["pincode"].setValue(updatePin);
  //     }
  //     // Check if pincodeValue is a valid number
  //     if (!isNaN(pincodeValue) && pincodeValue.toString().length >= 3) {
  //       const exactPincodeMatch = pincodeList.find(
  //         (element) => element.name === pincodeValue
  //       );
  //       if (!exactPincodeMatch) {
  //         const filteredPincodeDet = pincodeList.filter((element) =>
  //           element.name.includes(pincodeValue.toString())
  //         );
  //         if (filteredPincodeDet.length === 0) {
  //           // Show a popup indicating no data found for the given pincode
  //           Swal.fire({
  //             icon: "info",
  //             title: "No Data Found",
  //             text: `No data found for pincode ${pincodeValue}`,
  //             showConfirmButton: true,
  //           });
  //         } else {
  //           this.filter.Filter(
  //             this.jsonControlGroupArray,
  //             this.addressTableForm,
  //             filteredPincodeDet,
  //             this.pincodeList,
  //             this.pincodeStatus
  //           );
  //         }
  //       }
  //     }
  //     this.pincodeDataFetched = true;
  //   } catch (error) {
  //     console.error("Error fetching pincode data:", error);
  //   }
  // }

  async fetchPincodeData() {
    this.objPinCodeService.getPincodes(this.addressTableForm, this.jsonControlGroupArray, "pincode", this.pincodeStatus);
  }
  //#endregion

  async getCustomerNameData(name, status) {
    const Body = {
      companyCode: this.companyCode,
      collectionName: "customer_detail",
      filter: {},
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );

    if (res.success && res.data.length > 0) {
      let customerData = [];
      res.data.forEach((x) => {
        customerData.push({
          name: x.customerName,
          value: x.customerCode,
        });
      });
      this.filter.Filter(
        this.jsonControlGroupArray,
        this.addressTableForm,
        customerData,
        name,
        status
      );
      if (this.isUpdate) {
        const customer = this.data.customer?.map((x) => x.code);
        const selectedData = customerData.filter((x) => customer.includes(x.value));
        this.addressTableForm.controls["customerNameDropdown"].setValue(selectedData);
      }
    }
  }

  //#region Save Data
  save() {

    if (!this.addressTableForm.valid || this.isSubmit) {
      this.addressTableForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required  fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,

      });
      return false;
    }
    else {
      this.snackBarUtilityService.commonToast(async () => {
        try {

          this.isSubmit = true

          this.addressTableForm.controls["pincode"].setValue(
            this.addressTableForm.value.pincode.name
          );
          // Clear any errors in the form controls
          Object.values(this.addressTableForm.controls).forEach((control) =>
            control.setErrors(null)
          );
          const customerName = this.addressTableForm.value.customerNameDropdown?.map(
            (x) => {
              return {
                code: x.value,
                name: x.name,
              };
            }
          );
          this.addressTableForm.removeControl("customerNameDropdown");
          this.addressTableForm.controls["customer"].setValue(customerName);
          if (this.isUpdate) {
            let id = this.addressTableForm.value._id;
            this.addressTableForm.removeControl("_id");
            let req = {
              companyCode: this.companyCode,
              collectionName: "address_detail",
              filter: { _id: id },
              update: {
                ...this.addressTableForm.value,
                mODDT: new Date(),
                mODLOC: this.StorageServiceI.branch,
                mODBY: this.StorageServiceI.userName,
              },
            };
            this.masterService.masterPut("generic/update", req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.Route.navigateByUrl(
                    "/Masters/AddressMaster/AddressMasterList"
                  );
                }
              },
            });
          } else {
            const lastCode = this.addressData[this.addressData.length - 1];
            const lastAddressCode = lastCode
              ? parseInt(lastCode.addressCode.substring(1))
              : 0;
            // Function to generate a new address code
            function generateAddressCode(initialCode: number = 0) {
              const nextAddressCode = initialCode + 1;
              const addressNumber = nextAddressCode.toString().padStart(4, "0");
              const addressCode = `A${addressNumber}`;
              return addressCode;
            }
            this.newAddressCode = generateAddressCode(lastAddressCode);
            this.addressTableForm.controls["_id"].setValue(this.newAddressCode);
            this.addressTableForm.controls["addressCode"].setValue(
              this.newAddressCode
            );
            let req = {
              companyCode: this.companyCode,
              collectionName: "address_detail",
              data: {
                ...this.addressTableForm.value,
                eNTDT: new Date(),
                eNTLOC: this.StorageServiceI.branch,
                eNTBY: this.StorageServiceI.userName,
              },
            };
            this.masterService.masterPost("generic/create", req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.Route.navigateByUrl(
                    "/Masters/AddressMaster/AddressMasterList"
                  );
                }
              },
            });
          }
        }
        catch (error) {
          console.error("Error fetching data:", error);
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
        }
      }, "Address Adding...");
    }
  }
  //#endregion

  //#region set city and sate data
  async setStateCityData() {
    // const fetchData = this.pincodeDet.find(
    //   (item) => item.PIN == this.addressTableForm.controls["pincode"].value.name
    // );
    const data = this.addressTableForm.controls["pincode"].value;
    const pincodeReq = {
      companyCode: this.companyCode,
      collectionName: "state_master",
      filter: { ST: data.allData.ST },
    };

    // Fetch pincode data
    const state = await this.masterService
      .masterPost("generic/get", pincodeReq)
      .toPromise();
    this.addressTableForm.controls.stateName.setValue(state.data[0].STNM);
    this.addressTableForm.controls.cityName.setValue(data.allData.CT);
  }
  //#endregion

  checkCodeExists() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "address_detail",
      filter: {},
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          this.addressData = res.data;
          const count = res.data.filter(
            (item) =>
              item.manualCode == this.addressTableForm.controls.manualCode.value
          );
          if (count.length > 0) {
            Swal.fire({
              title: "Manual Code already exists! Please try with another",
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK",
            });
            this.addressTableForm.controls["manualCode"].reset();
          }
        }
      },
    });
  }
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.addressTableForm.controls["activeFlag"].setValue(event);
  }
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlGroupArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlGroupArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.addressTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
}
