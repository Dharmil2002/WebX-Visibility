import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { max } from "lodash";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { chunkArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { UploadFieldType } from "src/app/config/myconstants";
import { DriverMaster } from "src/app/core/models/Masters/Driver";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { StorageService } from "src/app/core/service/storage.service";
import { nextKeyCodeByN } from "src/app/Utility/commonFunction/stringFunctions";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-driver-master-upload",
  templateUrl: "./driver-master-upload.component.html",
})
export class DriverMasterUploadComponent implements OnInit {
  driverUploadForm: UntypedFormGroup;
  existingData: any;
  pincodeList: any;
  countryData: any;
  country: any;
  VehicleData: any;

  //#region to define validation rules
  validationRules: any[] = [
    {
      ItemsName: "DriverName",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^[a-zA-Z -/]{3,200}$" },
        { DuplicateFromList: true },
      ],
    },
    {
      ItemsName: "LicenseNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^[A-Z]{2}[0-9]{13}$" },
        { DuplicateFromList: true },
      ],
    },
    {
      ItemsName: "CountryCode",
      Type: UploadFieldType.Upload,
      From: "Country",
      Field: "Country",
      Validations: [],
    },
    {
      ItemsName: "CountryId",
      Type: UploadFieldType.Derived,
      BasedOn: "CountryCode",
      From: "Country",
      Field: "PhoneCode",
      Validations: [],
    },
    {
      ItemsName: "MobileNo",
      Type: UploadFieldType.Upload,
      Validations: [{ Pattern: "^[1-9][0-9]{9}$" }],
    },
    {
      ItemsName: "Address",
      Type: UploadFieldType.Upload,
      Validations: [{ Pattern: "^.{1,500}$" }],
    },
    {
      ItemsName: "PinCode",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        {
          ExistsInPincodeMaster: true,
          IsComaSeparated: true,
        },
      ],
    },
    {
      ItemsName: "City",
      Type: UploadFieldType.Derived,
      BasedOn: "PinCode",
      From: "Pincode",
      Field: "CT",
      Validations: [],
    },
    {
      ItemsName: "LicenseValidityDate",
      Validations: [
        { Required: true },
        { range: 1 },
      ],
    },
    {
      ItemsName: "DateofBirth",
      Validations: [
        { Required: true },
        { range: 1 },
      ],
    },
    {
      ItemsName: "AssignedVehicleNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9]{3,200}$" },
        { DuplicateFromList: false },
      ],
    },
  ];
  //#endregion

  constructor(
    private dialogRef: MatDialogRef<DriverMasterUploadComponent>,
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private storage: StorageService,
    private masterService: MasterService,
    private dialog: MatDialog,
    private objPinCodeService: PinCodeService
  ) {
    this.driverUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {}

  //#region to select file
  async selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      const jsonData = await this.xlsxUtils.readFile(file);
      try {
        const response = await this.xlsxUtils.validateAllData(
          jsonData,
          this.validationRules
        );
        const existingRecords = await this.getDriverData(response);
        // Creating lookup tables
        const driverNames = new Set();
        const licenseNos = new Set();

        existingRecords.forEach((rec) => {
          if (rec.driverName) driverNames.add(rec.driverName.toLowerCase());
          if (rec.licenseNo && rec.licenseNo !== "")
            licenseNos.add(rec.licenseNo);
        });

        const filteredData = await Promise.all(
          response.map(async (element) => {
            element.error = element.error || [];

            if (driverNames.has(element.DriverName.toLowerCase())) {
              element.error.push(
                `DriverName : ${element.DriverName} Already exists`
              );
            }
            if (licenseNos.has(element.LicenseNo)) {
              element.error.push(
                `LicenseNo : ${element.LicenseNo} Already exists`
              );
            }
            if (element.error.length === 0) {
              element.error = null; // set the error property null if there are no errors;
            }
            return element;
          })
        );
        this.OpenPreview(filteredData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  //#endregion

  //#region to get Existing Data from collection
  async getDriverData(data) {
    const driverName = [...new Set(data.map((x) => x.DriverName))];
    const licenseNo = [...new Set(data.map((x) => x.LicenseNo))];

    const drvNms = chunkArray(driverName, 25);
    const licno = chunkArray(licenseNo, 25);

    const totalChunks = max([drvNms.length, licno.length]);
    let results = [];
    for (let i = 0; i < totalChunks; i++) {
      const vc = drvNms[i] || [];
      const pc = licno[i] || [];

      if (vc.length > 0 || pc.length > 0) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: "driver_detail",
          filter: {
            $or: [
              ...(vc.length > 0 ? [{ driverName: { D$in: vc } }] : []),
              ...(pc.length > 0 ? [{ licenseNo: { D$in: pc } }] : []),
            ],
          },
        };
        const response = await firstValueFrom(
          this.masterService.masterPost("generic/get", request)
        );
        results = [...results, ...response.data];
      }
    }
    return results;
  }
  //#endregion

  //#region  Download()
  Download(): void {
    let link = document.createElement("a");
    link.download = "DriverMasterTemplate";
    link.href = "assets/Download/DriverMasterTemplate.xlsx";
    link.click();
  }
  //#endregion

  //#region to open modal to show validated data
  OpenPreview(results) {
    const metaData = {
      data: results,
      hideColumns: this.validationRules
        .filter((x) => x.Type === UploadFieldType.Derived)
        .map((x) => x.ItemsName),
    };
    const dialogRef = this.dialog.open(XlsxPreviewPageComponent, {
      data: metaData,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // console.log(result);
        this.save(results);
      }
    });
  }
  //#endregion

  //#region to process and save data
  async save(data: any[]) {
    try {
      const chunkSize = 50;
      let successfulUploads = 0;
      const lastDriverCode = await this.masterService.getLastId(
        "driver_detail",
        this.storage.companyCode,
        "companyCode",
        "manualDriverCode",
        "DR"
      );
      // Process each element in data using processData
      const processedData = data.map((element, i) =>
        this.processData(element, lastDriverCode, i)
      );
      // Chunk the processedData data recursively
      const chunks = chunkArray(processedData, chunkSize);
      const sendData = async (chunks: DriverMaster[][]) => {
        chunks.forEach(async (chunk) => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "driver_detail",
            data: chunk,
          };
          try {
            const response = await firstValueFrom(
              this.masterService.masterPost("generic/create", request)
            );
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
              text: "Valid Driver Data Uploaded",
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
  async getListId() {
    try {
      let query = { companyCode: this.storage.companyCode };
      const req = { companyCode:this.storage.companyCode, collectionName: "driver_detail", filter: query, sorting: { manualDriverCode: -1 } };
      const response = await firstValueFrom(this.masterService.masterPost("generic/findLastOne", req));

      return response?.data;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }
  processData(element, lastDriverCode: string, i: number) {
    // Create a new VendorModel instance to store processed data
    const processedData = new DriverMaster({});
    // Set basic properties
    const newDriverCode = nextKeyCodeByN(lastDriverCode, i + 1);
    processedData.manualDriverCode = newDriverCode;
    processedData._id = newDriverCode;
    processedData.cID = this.storage.companyCode;
    processedData.driverName = element.DriverName.toUpperCase();
    processedData.licenseNo = element.LicenseNo;
    processedData.country = element.CountryCode;
    processedData.countryCD = element.CountryId  || "";
    processedData.telno = element.MobileNo;
    processedData.address = element.Address;
    processedData.pincode = element.PinCode;
    processedData.city = element.City;
    processedData.valdityDt = new Date(element.LicenseValidityDate);
    processedData.dDob = new Date(element.DateofBirth);
    processedData.vehicleNo = element.AssignedVehicleNo || "";
    processedData.activeFlag = true;
    processedData.addressProofDocNo = "";
    processedData.DOBProofDocNo = "";
    processedData.driverPhoto = "";
    processedData.licenseScan = "";
    processedData.addressProofScan = "";
    processedData.DOBProofScan = "";
    // Set timestamp and user information
    processedData["eNTDT"] = new Date();
    processedData["eNTBY"] = this.storage.userName;
    processedData["eNTLOC"] = this.storage.branch;

    // Return the processed data
    return processedData;
  }
  //#endregion

  //#region Close()
  Close() {
    this.dialogRef.close();
  }
  //#endregion

  //#region functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
}
