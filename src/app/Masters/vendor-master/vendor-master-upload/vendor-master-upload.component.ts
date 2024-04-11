import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { PayBasisdetailFromApi } from '../../Customer Contract/CustomerContractAPIUtitlity';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import Swal from 'sweetalert2';
import { VendorMaster } from 'src/app/core/models/Masters/vendor-master';
import { nextKeyCode } from 'src/app/Utility/commonFunction/stringFunctions';

@Component({
  selector: 'app-vendor-master-upload',
  templateUrl: './vendor-master-upload.component.html'
})
export class VendorMasterUploadComponent implements OnInit {
  vendorUploadForm: UntypedFormGroup;
  pincodeList: any;
  zonelist: any;
  countryList: any;
  vendorTypeList: any;
  locationList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<VendorMasterUploadComponent>,
    private objState: StateService,
    private objPinCodeService: PinCodeService,
    private storage: StorageService,
    private locationService: LocationService
  ) {
    this.vendorUploadForm = fb.group({
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
        this.pincodeList = await this.objPinCodeService.pinCodeDetail();
        this.vendorTypeList = await PayBasisdetailFromApi(this.masterService, "VENDTYPE");
        this.locationList = await this.locationService.locationFromApi();
        this.zonelist = await this.objState.getStateWithZone();
        this.countryList = await firstValueFrom(this.masterService.getJsonFileDetails("countryList"));

        const validationRules = [
          {
            ItemsName: "VendorName",
            Validations: [
              { Required: true },
              { Pattern: "^[a-zA-Z0-9 -/]{3,150}$" },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "VendorManager",
            Validations: [
              { Pattern: "^[a-zA-Z - a-zA-Z]{3,25}$" }
            ]
          },
          {
            ItemsName: "VendorType",
            Validations: [
              { Required: true },
              {
                TakeFromArrayList: this.vendorTypeList.map((x) => {
                  return x.name;
                })
              }
            ]
          },
          {
            ItemsName: "VendorAddress",
            Validations: [
              { Required: true },
              { Pattern: "^.{1,500}$" }
            ]
          },
          {
            ItemsName: "VendorLocation",
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
            ItemsName: "VendorPinCode",
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
            ItemsName: "VendorContactNo",
            Validations: [
              { Pattern: "^[1-9][0-9]{9}$" }
            ],
          },
          {
            ItemsName: "VendorEmailID",
            Validations: [
              { Pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" } //for one email id
            ],
          },

          {
            ItemsName: "PANNo",
            Validations: [
              { Required: true },
              { Pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$" },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "CINNo",
            Validations: [
              { Pattern: "^[a-zA-Z0-9]{4,100}$" },
              { DuplicateFromList: true }
            ],
          },
          {
            ItemsName: "ITRNo",
            Validations: [
              { Pattern: "^[a-zA-Z0-9]{4,100}$" }
            ],
          },
          {
            ItemsName: "VendorAdvance%",
            Validations: [
              { Numeric: true },
            ],
          }

        ];

        try {
          const response = await firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
          const existingRecord = await this.getVendorData(response);
          const filteredData = await Promise.all(response.map(async (element) => {

            // Initialize the error array if it doesn't exist
            if (!element.error) {
              element.error = [];
            }

            const existVendorName = existingRecord.find(x => x.vendorName.toLowerCase() === element.VendorName.toLowerCase());
            const existPanNo = existingRecord.filter(item => item.panNo !== null && item.panNo !== "" && item.panNo !== undefined).find(x => x.panNo === element.PANNo);
            const existCINNo = existingRecord.filter(item => item.cinNumber !== null && item.cinNumber !== "" && item.cinNumber !== undefined).find(x => x.cinNumber === element.CINNo);

            existVendorName ? element.error.push(`VendorName : ${element.VendorName} Already exist`) : "";
            existPanNo ? element.error.push(`PANNo : ${element.PANNo} Already exist`) : "";
            existCINNo ? element.error.push(`CINNo : ${element.CINNo} Already exist`) : "";
            const city = this.pincodeList.find(x => x.PIN === parseInt(element.PinCode));
            if (city) {
              element['VendorCity'] = city.CT;

              const state = this.zonelist.find(x => x.ST === city?.ST);
              element['VendorState'] = state.STNM

              const country = this.countryList.find(x => x.Code.toLowerCase() === state.CNTR.toLowerCase());
              element['Country'] = country.Country;

            }

            if (element.error.length < 1) { element.error = null }
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
  //#region to process and save data
  async save(data: any[]) {
    try {
      const chunkSize = 50;
      let successfulUploads = 0;

      // Process each element in data using processData
      const processedData = data.map(element => this.processData(element));

      // Pass the processedData array to formatVendorData
      const formattedData = await this.formatVendorData(processedData);

      // Chunk the formatted data recursively
      const chunks = await this.xlsxUtils.chunkArray(formattedData, chunkSize);
      // console.log(chunks);

      const sendData = async (chunks: VendorMaster[][]) => {

        chunks.forEach(async chunk => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "vendor_detail",
            data: chunk,
          };
          try {
            const response = await firstValueFrom(this.masterService.masterPost("generic/create", request));
            if (response.success) {

              successfulUploads++;
            }
          } catch (error) {
            console.log(error);
          }

          // Check if all chunks were successfully uploaded
          if (successfulUploads === chunks.length) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Valid Vendor Data Uploaded",
              showConfirmButton: true,
            });
          }
        });
      };

      await sendData(chunks);

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving vendor Data. Please try again.",
        showConfirmButton: true,
      });
    }
  }

  processData(element) {

    const updateVendortype = this.vendorTypeList.find(item => item.name.toLowerCase() === element.VendorType.toLowerCase());

    let vendorLocations: string[];

    // Check if element.vendorLocation contains a comma
    if (element.VendorLocation.includes(',')) {
      // If it contains a comma, split into an array of locations
      vendorLocations = element.VendorLocation.split(',').map(location => location.trim().toUpperCase());
    } else {
      // If it doesn't contain a comma, treat it as a single location
      vendorLocations = [element.VendorLocation.trim()];
    }

    // Find the matching locations in locationList
    const updateLocationList = this.locationList.filter(item => vendorLocations.includes(item.name.toUpperCase()));

    // Create a new VendorModel instance to store processed data
    const processedData = new VendorMaster({});

    // Set basic properties
    processedData.companyCode = this.storage.companyCode;
    processedData.vendorName = element.VendorName.toUpperCase();
    processedData.vendorManager = element.VendorManager;
    processedData.vendorType = updateVendortype.value || '';
    processedData.vendorTypeName = updateVendortype.name || '';
    processedData.vendorAddress = element.VendorAddress;
    processedData.vendorLocation = updateLocationList.map((x) => {
      return x.name;
    }) || [];
    processedData.vendorPinCode = element.VendorPinCode;
    processedData.vendorCity = element.VendorCity;
    processedData.vendorState = element.VendorState;
    processedData.vendorCountry = element.Country;
    processedData.vendorPhoneNo = element.VendorContactNo;
    processedData.emailId = element.VendorEmailID;
    processedData.panNo = element.PANNo;
    processedData.cinNumber = element.CINNo;
    processedData.itrnumber = element.ITRNo;
    processedData.vendorAdvance = parseFloat(element['VendorAdvance%']).toFixed(2);
    processedData['otherdetails'] = []

    // Set timestamp and user information
    processedData['eNTDT'] = new Date();
    processedData['eNTBY'] = this.storage.userName;
    processedData['eNTLOC'] = this.storage.branch;

    // Return the processed data
    return processedData;
  }
  // Function to format contract data
  async formatVendorData(processedData: any[]) {
    try {
      // Get the last Vendor code from the database outside the forEach loop
      let lastVendorCode = await this.getLasVendorCode();

      const formattedData: any[] = [];
      // Sequentially process each item in processedData using forEach
      processedData.forEach((item) => {
        // Calculate the new vendor code using nextKeyCode function
        const newVendorCode = nextKeyCode(lastVendorCode);
        // Update the last vendor code for the next iteration
        lastVendorCode = newVendorCode;

        const formattedItem = {
          ...item,
          vendorCode: newVendorCode,
          _id: `${this.storage.companyCode}-${newVendorCode}`,
        };

        formattedData.push(formattedItem);
      });

      return formattedData;
    } catch (error) {
      // Handle any errors that occur during processing
      console.error('Error in formatVendorData:', error);
      throw error; // Propagate the error
    }
  }
  // Function to get last vendor code
  async getLasVendorCode(): Promise<string> {
    try {
      // Construct the request object for fetching the last vendor code
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "vendor_detail",
        filter: {},
        sorting: { vendorCode: -1 },
      };
      const Vendor = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", req)
      );

      // Extract and return the last Vendor code or use a default value if not available
      return Vendor?.data?.vendorCode || "V00000";
    } catch (error) {
      // Handle any errors that occur during API call or processing
      console.error('Error in getLastVendorCode:', error);
      throw error; // Propagate the error
    }
  }

  //#endregion
  //#region to get Existing Data from collection
  async getVendorData(data) {
    const vendorName = data.map((x) => x.VendorName);
    const panNo = data.map((x) => x.PANNo);
    const cinNumber = data.map((x) => x.CINNo);
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "vendor_detail",
      filter: { $or: [{ vendorName: { D$in: vendorName } }, { panNo: { D$in: panNo } }, { cinNumber: { D$in: cinNumber } }] },
    };
    const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
    return response.data;
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "VendorMasterTemplate";
    link.href = "assets/Download/VendorMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
}