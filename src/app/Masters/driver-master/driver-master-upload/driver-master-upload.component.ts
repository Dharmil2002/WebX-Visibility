import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { nextKeyCode } from 'src/app/Utility/commonFunction/stringFunctions';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { DriverMaster } from 'src/app/core/models/Masters/Driver';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-driver-master-upload',
  templateUrl: './driver-master-upload.component.html'
})
export class DriverMasterUploadComponent implements OnInit {
  driverUploadForm: UntypedFormGroup;
  existingData: any;
  pincodeList: any;
  countryData: any;
  country: any;
  VehicleData: any;
  constructor(
    private dialogRef: MatDialogRef<DriverMasterUploadComponent>,
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private storage: StorageService,
    private masterService: MasterService,
    private dialog: MatDialog,
    private objPinCodeService: PinCodeService,
  ) {
    this.driverUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {
  }

  selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then(async (jsonData) => {
        // Fetch data from various services
        this.existingData = await this.getDriverData();
        this.pincodeList = await this.objPinCodeService.pinCodeDetail();
        this.countryData = await firstValueFrom(this.masterService.getJsonFileDetails("dropDownUrl"));
        const mergedData = this.countryData.countryList.map((x) => `${x.value}:${x.name}`);
        this.VehicleData = await this.getVehicleData();

        const validationRules = [
          {
            ItemsName: "ManualDriverCode",
            Validations: [
              { Required: true },
              {
                Exists: this.existingData.map((x) => {
                  return x.manualDriverCode;
                }),
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "DriverName",
            Validations: [
              { Required: true },
              { Pattern: "^[a-zA-Z -/]{3,30}$" },
              {
                Exists: this.existingData.map((x) => {
                  return x.driverName;
                }),
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "LicenseNo",
            Validations: [
              { Required: true },
              { Pattern: "^[A-Z]{2}[0-9]{13}$" },
              {
                Exists: this.existingData.map((x) => {
                  return x.licenseNo;
                }),
              },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "LicenseValidityDate",
            Validations: [
              { Required: true },
              {CustomValidation: true}
            ],
          },
          {
            ItemsName: "CountryCode",
            Validations: [
              { Required: true },
              {
                TakeFromList: mergedData
              }
            ],
          },
          {
            ItemsName: "MobileNo",
            Validations: [
              { Numeric: true },
              { Pattern: "^[0-9]{10}$" }
            ],
          },
          {
            ItemsName: "Address",
            Validations: [
              { Required: true },
              { Pattern: "^.{4,500}$" }
            ],
          },
          {
            ItemsName: "PinCode",
            Validations: [
              {
                TakeFromList: this.pincodeList.map((x) => {
                  return x.PIN;
                }),
              }
            ]
          },
          {
            ItemsName: "AssignedVehicleNo",
            Validations: [
              {
                TakeFromList: this.VehicleData.map((x) => {
                  return x.name;
                }),
              }
            ]
          },
          {
            ItemsName: "DateofBirth",
            Validations: [
              { Required: true }
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
          console.log("jsonData", jsonData)
          const filteredData = await Promise.all(response.map(async (element) => {

            const city = this.pincodeList.find(x => x.PIN === parseInt(element.PinCode));

            if (city) {
              element['City'] = city.CT;
            }
            return element;
          }));
          this.OpenPreview(filteredData);
          console.log("filteredData", filteredData)
        } catch (error) {
          // Handle errors from the API call or other issues
          console.error("Error:", error);
        }
      })
    }
  }

  async getDriverData() {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "driver_detail",
      filter: {},
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
    return response.data;
  }

  async getVehicleData() {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "vehicle_detail",
      filter: {},
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
    return response.data.map((element) => ({
      name: element.vehicleNo,
      value: element.vehicleNo,
    }));;
  }

  Download(): void {
    let link = document.createElement("a");
    link.download = "DriverMasterTemplate";
    link.href = "assets/Download/DriverMasterTemplate.xlsx";
    link.click();
  }

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

  async save(data) {
    try {
      const uploadData: DriverMaster[] = [];
      console.log(uploadData, "uploadData");
      data.forEach(element => {
        const processedData = this.processData(element, this.pincodeList, this.VehicleData);
        uploadData.push(processedData);
        console.log("processedData", processedData)
      });
      const formattedData = await this.formatDriverData(uploadData);
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "driver_detail",
        data: formattedData
      };
      const response = await firstValueFrom(this.masterService.masterPost("generic/create", request));
      if (response) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Valid driver Data Uploaded",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error during saving driver data", error);

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving driver Data. Please try again.",
        showConfirmButton: true,
      });
    }
  }

  processData(element, pincodeList, VehicleData) {
    console.log("element", element)
    const updatepincodeList = pincodeList.find(item => item.PIN === parseInt(element.PinCode));
    const updateVehicleData = VehicleData.find(item => item.name.toLowerCase() === element.AssignedVehicleNo.toLowerCase());
    const processedData = new DriverMaster({});
    processedData.cID = this.storage.companyCode;
    processedData.vehicleNo = updateVehicleData.name || '';
    processedData.pincode = updatepincodeList.PIN || '';
    processedData.manualDriverCode = element.ManualDriverCode || '';
    processedData.driverName = element.DriverName || '';
    processedData.licenseNo = element.LicenseNo || '';
    processedData.valdityDt = moment(element.LicenseValidityDate, 'DD-MMM-YY').toDate();
    processedData.telno = element.MobileNo || '';
    processedData.address = element.Address || '';
    processedData.pincode = element.PinCode || '';
    processedData.city = element.City || '';
    processedData.vehicleNo = element.AssignedVehicleNo || '';
    processedData.dDob = moment(element.DateofBirth, 'DD-MMM-YY').toDate();
    processedData.activeFlag = element.Active === 'Y';
    processedData.eNTBY = this.storage.userName;
    // processedData.countryCD = element.CountryCode || ''
    // processedData.country = element.CountryCode || ''
    if (element.CountryCode) {
      const [countryCD, countryName] = element.CountryCode.split(':');
      processedData.countryCD = countryCD.trim() || '';
      processedData.country = countryName.trim() || '';
    }
    return processedData;
  }

  async formatDriverData(processedData: any[]) {
    try {
      // Get the last driver code from the database outside the forEach loop
      let lastDriverCode = await this.getLastDriverCode();
      const formattedData: any[] = [];
      // Sequentially process each item in processedData using forEach
      processedData.forEach((item) => {
        // Calculate the new driver code using nextKeyCode function
        const newDriverCode = nextKeyCode(lastDriverCode);
        // Update the last driver code for the next iteration
        lastDriverCode = newDriverCode;

        const formattedItem = {
          ...item,
          driverCode: newDriverCode,
          _id: newDriverCode,
        };

        formattedData.push(formattedItem);
      });

      return formattedData;
    } catch (error) {
      // Handle any errors that occur during processing
      console.error('Error in formatDriverData:', error);
      throw error; // Propagate the error
    }
  }
  // Function to get last driver code
  async getLastDriverCode(): Promise<string> {
    try {
      // Construct the request object for fetching the last driver code
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "driver_detail",
        filter: {},
        sorting: { manualDriverCode: -1 }
      };

      // Make an API call to fetch the last driver code
      const driver = await firstValueFrom(this.masterService.masterPost("generic/findLastOne", req));

      // Extract and return the last driver code or use a default value if not available
      return driver?.data?.manualDriverCode || "DR0000";
    } catch (error) {
      // Handle any errors that occur during API call or processing
      console.error('Error in getLastDriverCode:', error);
      throw error; // Propagate the error
    }
  }

  Close() {
    this.dialogRef.close()
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
