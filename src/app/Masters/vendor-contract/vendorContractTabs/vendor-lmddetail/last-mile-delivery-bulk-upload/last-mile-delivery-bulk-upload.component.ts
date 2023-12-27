import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { LastMileDelivery } from 'src/app/Models/VendorContract/vendorContract';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';
import { checkForDuplicatesInBulkUpload } from '../../../vendorContractApiUtility';
@Component({
  selector: 'app-last-mile-delivery-bulk-upload',
  templateUrl: './last-mile-delivery-bulk-upload.component.html'
})
export class LastMileDeliveryBulkUploadComponent implements OnInit {

  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  fileUploadForm: UntypedFormGroup;
  CurrentContractDetails: any;
  routeList: any[];
  rateTypeDropDown: any;
  mergedCapacity: any[];
  existingData: any;
  IsUploaded: boolean;
  locationList: any[];
  timeFrameList: any;
  //@ViewChild(VendorTERDetailComponent) tableComponent: VendorTERDetailComponent
  // vendorContractData: vendorContractUpload;
  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private objLocationService: LocationService,
    private objContainerService: ContainerService,
    private dialogRef: MatDialogRef<LastMileDeliveryBulkUploadComponent>,
    private objGeneralService: GeneralService
  ) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
      // console.log(this.CurrentContractDetails.cNID);

    });
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
        this.rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP');
        const containerData = await this.objContainerService.getContainerList();
        this.locationList = await this.objLocationService.getLocationList();
        this.timeFrameList = await PayBasisdetailFromApi(this.masterService, 'TMFRM')
        const vehicleData = await this.objGeneralService.getGeneralMasterData("VEHSIZE");

        this.mergedCapacity = [...containerData, ...vehicleData];
        const validationRules = [{
          ItemsName: "Location",
          Validations: [{ Required: true },
        
          {
            TakeFromList: this.locationList.map((x) => {
              return x.name;
            }),
          }
          ],
        },
        {
          ItemsName: "RateType",
          Validations: [{ Required: true },
          {
            TakeFromList: this.rateTypeDropDown.map((x) => {
              return x.name;
            }),
          },],
        },
        {
          ItemsName: "TimeFrame",
          Validations: [{ Required: true },
          {
            TakeFromList: this.timeFrameList.map((x) => {
              return x.name;
            }),
          },],
        },
        {
          ItemsName: "Capacity",
          Validations: [{ Required: true }, {
            TakeFromList: this.mergedCapacity.map((x) => {
              return x.name;
            }),
          },
          ],
        },
        {
          ItemsName: "MinCharge",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 },
            { CompareMinMaxValue: true }
          ],
        },
        {
          ItemsName: "CommittedKM",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 }
          ],
        },
        {
          ItemsName: "AdditionalKM",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 }
          ],
        },
        {
          ItemsName: "MaxCharge",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 },
            { CompareMinMaxValue: true }
          ],
        }
        ];

        var rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        rPromise.then(async response => {
          // Specify the keys for Route and Capacity
          const routeKey = "Location";
          const capacityKey = "Capacity";
          const tableRouteKey = 'lOCNM'
          const tableCapacitykey = 'cPCTNM'
          const tableData = this.existingData.filter(item => item.cNID === this.CurrentContractDetails.cNID)
          // Call the function with the specified keys
          const data = await checkForDuplicatesInBulkUpload(response, tableData, tableRouteKey, tableCapacitykey, routeKey, capacityKey);

          this.OpenPreview(data);
        })
      });
    }
  }
  //#endregion
  //#region to get Existing Data from collection
  async fetchExistingData() {
    const request = {
      companyCode: this.companyCode,
      collectionName: "vendor_contract_lmd_rt",
      filter: {},
    };

    const response = await this.masterService.masterPost("generic/get", request).toPromise();
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
        this.setDropdownData(result)
      }
    });
  }
  //#endregion
  //#region to set dropdown's value
  async setDropdownData(previewResult) {
    try {
      this.IsUploaded = true;
      const vendorContractData: LastMileDelivery[] = [];

      // Process preview data to create vendor contract data
      previewResult.forEach(element => {
        const processedData = this.processData(element, this.locationList, this.rateTypeDropDown, this.mergedCapacity, this.timeFrameList)
        vendorContractData.push(processedData);
      });

      // Generate a new ID based on existing data
      const newId = this.generateNewId(this.existingData);

      // Format the final data with additional information
      const formattedData = this.formatContractData(vendorContractData, newId);

      const createRequest = {
        companyCode: this.companyCode,
        collectionName: "vendor_contract_lmd_rt",
        data: formattedData,
      };

      const createResponse = await firstValueFrom(this.masterService.masterPost("generic/create", createRequest));

      // Display success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Valid Data Uploaded",
        showConfirmButton: true,
      });
      this.IsUploaded = false;
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error("Error:", error);
    }
  }
  //#endregion

  //#region  to process individual preview data
  processData(element, locationList, rateType, mergedData, timeFrame) {
    const updatedLocation = locationList.find(item => item.name.toUpperCase() === element["Location"].toUpperCase());
    const updatedRateType = rateType.find(item => item.name.toUpperCase() === element["RateType"].toUpperCase());
    const updatedTimeFrame = timeFrame.find(item => item.name.toUpperCase() === element["TimeFrame"].toUpperCase())
    const updatedCapacity = mergedData.find(item => item.name.toUpperCase() === element["Capacity"].toUpperCase());

    const processedData = new LastMileDelivery();

    // Add processed location information if available
    if (updatedLocation) {
      processedData.lOCID = updatedLocation.value;
      processedData.lOCNM = updatedLocation.name;
    }

    // Add processed rate type information if available
    if (updatedRateType) {
      processedData.rTTID = updatedRateType.value;
      processedData.rTTNM = updatedRateType.name;
    }

    // Add processed capacity information if available
    if (updatedCapacity) {
      processedData.cPCTID = updatedCapacity.value;
      processedData.cPCTNM = updatedCapacity.name;
    }
    // Add processed timeFrame information if available
    if (updatedTimeFrame) {
      processedData.tMFRMID = updatedTimeFrame.value;
      processedData.tMFRMNM = updatedTimeFrame.name;
    }

    processedData.mIN = element["MinCharge"];
    processedData.mAX = element["MaxCharge"];
    processedData.aDDKM = element["AdditionalKM"];
    processedData.cMTKM = element["CommittedKM"];

    return processedData;
  }

  // Function to format contract data
  formatContractData(processedData, newId) {

    return processedData.map((item, index) => {
      const formattedItem = {
        ...item,
        _id: `${this.companyCode}-${this.CurrentContractDetails.cNID}-${newId + index}`,
        cID: this.companyCode,
        cNID: this.CurrentContractDetails.cNID,
      };

      return formattedItem;
    });
  }

  // Function to generate a new ID based on existing data
  generateNewId(existingData) {
    let newId;

    // Find the contract with the specified cNID
    const existingContract = existingData.filter(x => x.cNID === this.CurrentContractDetails.cNID);

    if (existingContract) {
      // Extract the last vendor code from the existing contract
      const sortedData = existingContract.sort((a, b) => a._id.localeCompare(b._id));
      const lastId = sortedData.length > 0 ? parseInt(sortedData[sortedData.length - 1]._id.split('-')[2], 10) : 0;

      // Check if the extraction was successful
      if (!isNaN(lastId)) {
        // Increment the last vendor code
        newId = lastId + 1;
      } else {
        // If extraction was not successful, set newId to 0
        newId = 0;
      }
    } else {
      newId = 0;
    }

    return newId;
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "LastMileDeliveryTemplate";
    link.href = "assets/Download/LastMileDeliveryTemplate.xlsx";
    link.click();
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()

  }
  //#endregion
}