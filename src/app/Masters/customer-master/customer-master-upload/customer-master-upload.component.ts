import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { nextKeyCode } from 'src/app/Utility/commonFunction/stringFunctions';
import { AddressService } from 'src/app/Utility/module/masters/Address/address.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { customerModel } from 'src/app/core/models/Masters/customerMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-master-upload',
  templateUrl: './customer-master-upload.component.html'
})
export class CustomerMasterUploadComponent implements OnInit {
  customerUploadForm: UntypedFormGroup;
  existingData: any;
  customerGrpList: any;
  pincodeList: any;
  CustomerCategoryList: { name: string; value: string; }[];
  locationList: any;
  zonelist: any;
  countryList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<CustomerMasterUploadComponent>,
    private objGeneralService: GeneralService,
    private objState: StateService,
    private objPinCodeService: PinCodeService,
    private objLocationService: LocationService,
    private storage: StorageService,
    private objAddressService: AddressService) {
    this.customerUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {
  }
  //#region to handle functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
  //#region to select file
  selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then(async (jsonData) => {

        // Fetch data from various services
        this.existingData = await this.fetchExistingData();
        this.customerGrpList = await this.getCustomerGroupData();
        this.CustomerCategoryList = [
          {
            name: "Primary",
            value: "Primary",
          },
          {
            name: "Secondary",
            value: "Secondary",
          },
        ];
        this.pincodeList = await this.objPinCodeService.pinCodeDetail();
        this.locationList = await this.getLocationList();
        this.zonelist = await this.objState.getStateWithZone();
        this.countryList = await firstValueFrom(this.masterService.getJsonFileDetails("countryList"));

        // Fetch state details by state name
        const validationRules = [
          {
            ItemsName: "CustomerGroup",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.customerGrpList.map((x) => {
                  return x.name;
                }),
              }
            ],
          },
          {
            ItemsName: "CustomerName",
            Validations: [
              { Required: true },
              { pattern: "^[a-zA-Z 0-9]{3,200}$" },
              {
                Exists: this.existingData.map((name) => {
                  return name.customerName;
                })
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "CustomerCategory",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.CustomerCategoryList.map((x) => {
                  return x.name;
                }),
              }
            ],
          },
          {
            ItemsName: "CustomerLocation",
            Validations: [
              { Required: true },
              {
                TakeFromArrayList: this.locationList.map((x) => {
                  return x.name;
                }),
              }
            ],
          },
          {
            ItemsName: "CustomerEmailID",
            Validations: [
              { pattern: "^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$" }
            ],
          },
          {
            ItemsName: "CustomerMobileNo",
            Validations: [
              { pattern: "^[\d{10}]$" }
            ],
          },
          {
            ItemsName: "ERPCode",
            Validations: [
              { pattern: "^[a-zA-Z0-9]{4,100}$" },
              {
                Exists: this.existingData.map((item) => {
                  return item.ERPcode;
                })
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "PANNo",
            Validations: [
              { pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$" }
            ],
          },
          {
            ItemsName: "CINNo",
            Validations: [
              { pattern: "^[a-zA-Z0-9]{4,100}$" },
              {
                Exists: this.existingData.map((item) => {
                  return item.CINnumber;
                })
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "RegisteredAddress",
            Validations: [
              { Required: true },
              { pattern: "^.{4,500}$" }
            ],
          },
          {
            ItemsName: "PinCode",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.pincodeList.map((x) => {
                  return x.PIN;
                }),
              }
            ],
          },
          {
            ItemsName: "MSMENo",
            Validations: [
              { pattern: "^[a-zA-Z0-9]{4,100}$" }
            ],
          },
          {
            ItemsName: "BlackListed",
            Validations: [
              { Required: true },
            ],
          },
          {
            ItemsName: "Active",
            Validations: [
              { Required: true },
            ],
          },

        ];

        try {
          const response = await firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));

          const filteredData = await Promise.all(response.map(async (element) => {

            const city = this.pincodeList.find(x => x.PIN === parseInt(element.PinCode));
            if (city) {
              element['City'] = city.CT;

              const state = this.zonelist.find(x => x.ST === city?.ST);
              element['State'] = state.STNM

              const country = this.countryList.find(x => x.Code.toLowerCase() === state.CNTR.toLowerCase());
              element['Country'] = country.Country;

            }
            return element;
          }));
          console.log(filteredData);

          this.OpenPreview(filteredData);
        } catch (error) {
          // Handle errors from the API call or other issues
          console.error("Error:", error);
        }
      });
    }
  }
  //#endregion
  //#region to get Existing Data from collection
  async fetchExistingData() {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "customer_detail",
      filter: {},
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
    return response.data;
  }
  //#endregion
  //#region to open modal to show validated data
  OpenPreview(results) {
    const dialogRef = this.dialog.open(XlsxPreviewPageComponent, {
      data: results,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.save(result)
      }
    });
  }
  //#endregion
  //#region to get customer Group list
  async getCustomerGroupData() {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: 'customerGroup_detail',
      filter: {}
    };

    try {
      const response = await firstValueFrom(this.masterService.masterPost('generic/get', request));
      return response?.success && response?.data ?
        response.data.map(
          ({ groupName, groupCode }) => ({ name: groupName, value: groupCode })) : [];
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      return [];
    }
  }
  //#endregion
  //#region to process and save location data
  async save(data) {

    try {

      let req = {
        companyCode: this.storage.companyCode,
        collectionName: "customer_detail",
        filter: {},
        sorting: {
          customerCode: -1
        }
      }
      const customer = await firstValueFrom(this.masterService.masterPost("generic/findLastOne", req))
      const rescustomer = customer?.data;
      const lastcustomerCode = rescustomer.customerCode || "CUST00000";
      const customerCode = nextKeyCode(lastcustomerCode);
      // Array to store processed location data
      const uploadData: customerModel[] = [];

      // Process each element in the input data
      data.forEach(element => {

        // Call the processData function to transform a single location element
        const processedData = this.processData(element);
        //console.log(processedData);

        // Add the processed data to the locationData array
        uploadData.push(processedData);
      });


      // Format the final data with additional information
      const formattedData = this.formatContractData(uploadData, customerCode);
      console.log(formattedData);
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "customer_detail",
        data: uploadData,
      };

      const response = await firstValueFrom(this.masterService.masterPost("generic/create", request));
      if (response) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Valid customer Data Uploaded",
          showConfirmButton: true,
        });
      }

    } catch (error) {
      console.error("Error during saving customer data:", error);

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving customer Data. Please try again.",
        showConfirmButton: true,
      });
    }
  }
  // Function to format contract data
  formatContractData(processedData, customerCode) {
    console.log(`processedData=${processedData}`, `customerCode=${customerCode}`);

    return processedData.map((item, index) => {
      const formattedItem = {
        ...item,
        _id: `${this.storage.companyCode}-${customerCode + index}`,
        customerCode: customerCode
      };

      return formattedItem;
    });
  }
  // Function to process a single location element
  processData(element) {

    // Create a new customerModel instance to store processed data
    const processedData = new customerModel({});

    // Set basic properties
    processedData.companyCode = this.storage.companyCode;
    processedData.customerGroup = element.CustomerGroup;
    processedData.customerName = element.CustomerName.toUpperCase();
    // processedData.customerCode = customerCode;
    processedData.CustomerCategory = element.CustomerCategory;
    processedData.customerLocations = element.CustomerLocation ?
      Array.isArray(element.CustomerLocation)
        ? element.CustomerLocation
        : element.CustomerLocation.split(',').map(pinCode => pinCode)
      : [];
    processedData.Customer_Emails = element.CustomerEmailID;
    processedData.customer_mobile = element.CustomerMobileNo;
    processedData.RegisteredAddress = element.RegisteredAddress;
    processedData.PinCode = element.PinCode;
    processedData.city = element.City;
    processedData.state = element.State;
    processedData.Country = element.Country;
    processedData.BlackListed = element.BlackListed === 'true' ? true : false;
    processedData.activeFlag = element.Active === 'true' ? true : false;
    processedData.ERPcode = element.ERPCode;
    processedData.TANNumber = element.TANNo;
    processedData.PANnumber = element.PANNo;
    processedData.CINnumber = element.CINNo;
    processedData.updatedBy = this.storage.userName;

    // Return the processed data
    return processedData;
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "CustomerMasterTemplate";
    link.href = "assets/Download/CustomerMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to ocation list for location dropdown
  async getLocationList() {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "location_detail",
      filter: {},
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
    return response.data.map(x => ({
      name: x.locCode,
      value: x.locCode
    }));
  }
  //#endregion
}
