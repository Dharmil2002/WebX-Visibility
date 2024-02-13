import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AddressService } from 'src/app/Utility/module/masters/Address/address.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { LocationMaster } from 'src/app/core/models/Masters/LocationMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-location',
  templateUrl: './upload-location.component.html'
})
export class UploadLocationComponent implements OnInit {
  fileUploadForm: UntypedFormGroup;
  CurrentContractDetails: any;
  routeList: any[];
  rateTypeDropDown: any;
  mergedCapacity: any[];
  existingData: any;
  hierachy: any[];
  locOwnerShipList: any[];
  pincodeList: any[];
  countryList: any;
  zonelist: any;

  constructor(
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<UploadLocationComponent>,
    private objGeneralService: GeneralService,
    private objState: StateService,
    private objPinCodeService: PinCodeService,
    private objLocationService: LocationService,
    private storage: StorageService,
    private objAddressService: AddressService
  ) {
    this.fileUploadForm = fb.group({
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
        this.hierachy = await this.objGeneralService.getGeneralMasterData("HRCHY");
        this.locOwnerShipList = await this.objGeneralService.getGeneralMasterData("LOC_OWN");
        this.pincodeList = await this.objPinCodeService.pinCodeDetail();
        this.zonelist = await this.objState.getStateWithZone();
        this.countryList = await firstValueFrom(this.masterService.getJsonFileDetails("countryList"));

        // Fetch state details by state name
        const validationRules = [
          {
            ItemsName: "LocationCode",
            Validations: [
              { Required: true },
              { Pattern: "^[.a-zA-Z0-9,-]{0,5}$" },
              {
                Exists: this.existingData.map((code) => {
                  return code.locCode;
                })
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "LocationName",
            Validations: [
              { Required: true },
              { Pattern: "^[a-zA-Z ]{3,25}$" },
              {
                Exists: this.existingData.map((code) => {
                  return code.locName;
                })
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "LocationHirarchay",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.hierachy.map((x) => {
                  return x.name;
                }),
              }
            ],
          },
          {
            ItemsName: "Reportingto",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.hierachy.map((x) => {
                  return x.name;
                }),
              },],
          },
          {
            ItemsName: "ReportingLocation",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.existingData.map((x) => {
                  return x.locCode;
                }),
              },
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
              },],
          },
          {
            ItemsName: "LocationOwnership",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.locOwnerShipList.map((x) => {
                  return x.name;
                }),
              }
            ],
          },
          {
            ItemsName: "Lat",
            Validations: [
              { Numeric: true },
              //{ MinValue: 0.0 },
            ],
          },
          {
            ItemsName: "Log",
            Validations: [
              { Numeric: true },
              //{ MinValue: 1 },
            ],
          },
          {
            ItemsName: "MappedAreaCity",
            Validations: [
              { TakeFromList: Array.from(new Set(this.pincodeList.map((x) => x.CT))) }
            ],
          },
          {
            ItemsName: "MappedAreaState",
            Validations: [
              { TakeFromList: Array.from(new Set(this.zonelist.map((x) => x.STNM))) }
            ]
          },
          {
            ItemsName: "GSTNumber",
            Validations: [
              { Pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" }
            ],
          }
        ];

        try {
          const response = await firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));

          const filteredData = await Promise.all(response.map(async (element) => {
            if (element.LocationHierarchy === 'Head Office') {
              element.error.push('Head Office already exists!');
            }

            const locLevel = this.hierachy.find(x => x.name === element.Reportingto);

            if (locLevel) {
              const data = await this.objLocationService.locationFromApi({ locLevel: parseInt(locLevel.value) });
              const locationList = data.map((code) => code.name);

              if (!locationList.includes(element.ReportingLocation)) {
                element.error.push(`${element.ReportingLocation} is not from the allowed location list`);
              }
            }

            if (element.PinCode) {
              const city = this.pincodeList.find(x => x.PIN === element.PinCode);
              element.City = city.CT;

              const state = this.zonelist.find(x => x.ST === city?.ST);
              element.State = state.STNM
              element.Zone = state.ZN;

              const country = this.countryList.find(x => x.Code.toLowerCase() === state.CNTR.toLowerCase());
              element.Country = country.Country;

              const gstNumberPrefix = element.GSTNumber?.substring(0, 2);
              if (element.GSTNumber && state && state.ST !== parseInt(gstNumberPrefix)) {
                element.error.push(`${element.GSTNumber} does not belong to '${state.STNM}'. Please correct it`);
              }

              const filter = { pincode: element.PinCode };
              const addressList = await this.objAddressService.getAddressDetail(filter);
              element.Address = addressList[0]?.address ?? '';
            }
            return element;
          }));
          // console.log(filteredData);

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
      collectionName: "location_detail",
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
        this.saveLocation(result)
      }
    });
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "LocationMasterTemplate";
    link.href = "assets/Download/LocationMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to process and save location data
  async saveLocation(data) {
    try {
      // Array to store processed location data
      const locationData: LocationMaster[] = [];

      // Process each element in the input data
      data.forEach(element => {

        // Call the processData function to transform a single location element
        const processedData = this.processData(element, this.existingData, this.hierachy, this.pincodeList, this.zonelist, this.locOwnerShipList);
        //console.log(processedData);

        // Add the processed data to the locationData array
        locationData.push(processedData);
      });

      //console.log(locationData);
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "location_detail",
        data: locationData,
      };

      const response = await firstValueFrom(this.masterService.masterPost("generic/create", request));
      if (response) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Valid Locations Uploaded",
          showConfirmButton: true,
        });
      }

    } catch (error) {
      console.error("Error during saveLocation:", error);

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving locations. Please try again.",
        showConfirmButton: true,
      });
    }
  }

  // Function to process a single location element
  processData(element, existingData, hierachy, pincodeList, zonelist, locOwnerShipList) {
    // Retrieve relevant data for transformation
    const updateLocLevel = hierachy.find(item => item.name.toUpperCase() === element.LocationHirarchay.toUpperCase());
    const updateReportLevel = hierachy.find(item => item.name.toUpperCase() === element.Reportingto.toUpperCase());
    const updateReportLoc = existingData.find(item => item.locCode.toUpperCase() === element.ReportingLocation.toUpperCase());
    const updatePincode = pincodeList.find(item => item.PIN === element.PinCode);
    const updateOwnership = locOwnerShipList.find(item => item.name === element.LocationOwnership.toUpperCase());
    const updateState = zonelist.find(item => item.STNM.toUpperCase() === element.State.toUpperCase());

    // Create a new LocationMaster instance to store processed data
    const processedData = new LocationMaster({});

    // Set basic properties
    processedData._id = `${this.storage.companyCode}-${element.LocationCode}`;
    processedData.companyCode = this.storage.companyCode;
    processedData.locCode = element.LocationCode;
    processedData.locName = element.LocationName;

    // Set additional properties based on retrieved data
    processedData.locRegion = element.Zone;
    processedData.locCountry = element.Country;
    processedData.locCity = element.City;
    processedData.locAddr = element.Address;

    // Check if locLevel information is available and update accordingly
    if (updateLocLevel) {
      processedData.locLevel = updateLocLevel.value;
    }

    // Check if ReportLevel information is available and update accordingly
    if (updateReportLevel) {
      processedData.reportLevel = parseInt(updateReportLevel.value);
    }

    // Check if reportLoc information is available and update accordingly
    if (updateReportLoc) {
      processedData.reportLoc = updateReportLoc.locCode;
    }

    // Check if pincode information is available and update accordingly
    if (updatePincode) {
      processedData.locPincode = updatePincode.PIN;
    }

    // Check if state information is available and update accordingly
    if (updateState) {
      processedData.locState = updateState.STNM;
      processedData.locStateId = parseInt(updatePincode.ST);
    }

    // Set remaining properties
    processedData.gstNumber = element.GSTNumber;

    // Check if ownership information is available and update accordingly
    if (updateOwnership) {
      processedData.ownership = updateOwnership.value;
    }

    // Set additional properties
    processedData.Latitude = element.Lat;
    processedData.Longitude = element.Log;
    processedData.mappedPinCode = element.MappedAreaPinCode ?
      Array.isArray(element.MappedAreaPinCode)
        ? element.MappedAreaPinCode
        : element.MappedAreaPinCode.toString().split(',').map(pinCode => parseInt(pinCode))
      : [];

    processedData.mappedCity = element.MappedAreaCity ?
      Array.isArray(element.MappedAreaCity)
        ? element.MappedAreaCity
        : element.MappedAreaCity.toString().split(',').map(city => city.trim())
      : [];

    processedData.mappedState = element.MappedAreaState ?
      Array.isArray(element.MappedAreaState)
        ? element.MappedAreaState
        : element.MappedAreaState.toString().split(',').map(state => state.trim())
      : [];

    // Set timestamp and user information
    processedData.eNTDT = new Date();
    processedData.eNTBY = this.storage.userName;
    processedData.eNTLOC = this.storage.branch;

    // Return the processed data
    return processedData;
  }
  //#endregion
}