import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PayBasisdetailFromApi, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { BusinessAssociate } from 'src/app/Models/VendorContract/vendorContract';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';
import { checkForDuplicatesInBulkUpload } from '../../../vendorContractApiUtility';

@Component({
  selector: 'app-business-associate-bulk-upload',
  templateUrl: './business-associate-bulk-upload.component.html'
})
export class BusinessAssociateBulkUploadComponent implements OnInit {

  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  fileUploadForm: UntypedFormGroup;
  CurrentContractDetails: any;
  existingData: any;
  IsUploaded: boolean;
  locationList: any;
  operationList: any;
  payBasisList: any;
  rateTypeList: any;
  transportMode: any;
  //@ViewChild(VendorTERDetailComponent) tableComponent: VendorTERDetailComponent
  // vendorContractData: BusinessAssociate;
  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private objLocationService: LocationService,
    private dialogRef: MatDialogRef<BusinessAssociateBulkUploadComponent>,
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
        this.locationList = await this.objLocationService.getLocationList();
        this.operationList = await PayBasisdetailFromApi(this.masterService, 'OPT');
        this.payBasisList = await PayBasisdetailFromApi(this.masterService, 'PAYTYP');
        this.rateTypeList = await PayBasisdetailFromApi(this.masterService, 'RTTYP');
        this.transportMode = await productdetailFromApi(this.masterService);

        const validationRules = [{
          ItemsName: "ControlLocation",
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
            TakeFromList: this.rateTypeList.map((x) => {
              return x.name;
            }),
          },],
        },
        {
          ItemsName: "Operation",
          Validations: [{ Required: true },
          {
            TakeFromList: this.operationList.map((x) => {
              return x.name;
            }),
          },],
        },
        {
          ItemsName: "TransportMode",
          Validations: [{ Required: true }, {
            TakeFromList: this.transportMode.map((x) => {
              return x.name;
            }),
          },
          ],
        },
        {
          ItemsName: "PayBasis",
          Validations: [{ Required: true }, {
            TakeFromList: this.payBasisList.map((x) => {
              return x.name;
            }),
          },
          ],
        },
        {
          ItemsName: "Rate",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 }
          ],
        },
        {
          ItemsName: "Min",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 },
            { CompareMinMaxValue: true }

          ],
        },
        {
          ItemsName: "Max",
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
          const routeKey = "ControlLocation";
          const capacityKey = "PayBasis";
          const tableRouteKey = 'lOCNM'
          const tableCapacitykey = 'pBSNM'
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
      collectionName: "vendor_contract_ba",
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
      const vendorContractData: BusinessAssociate[] = [];

      // Process preview data to create vendor contract data
      previewResult.forEach(element => {
        const processedData = this.processData(element, this.operationList, this.locationList, this.transportMode, this.payBasisList, this.rateTypeList)
        vendorContractData.push(processedData);
      });

      // Generate a new ID based on existing data
      const newId = this.generateNewId(this.existingData);

      // Format the final data with additional information
      const formattedData = this.formatContractData(vendorContractData, newId);
      // Log the formatted data
      //console.log(formattedData);

      const createRequest = {
        companyCode: this.companyCode,
        collectionName: "vendor_contract_ba",
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
  processData(element, operationList, locationList, transportMode, payBasisList, rateTypeList) {
    const updatedOperation = operationList.find(item => item.name.toUpperCase() === element["Operation"].toUpperCase());
    const updatedLocation = locationList.find(item => item.name.toUpperCase() === element["ControlLocation"].toUpperCase());
    const updatedTransportMode = transportMode.find(item => item.name.toUpperCase() === element["TransportMode"].toUpperCase());
    const updatedPayBasis = payBasisList.find(item => item.name.toUpperCase() === element["PayBasis"].toUpperCase());
    const updatedRateType = rateTypeList.find(TERForm => TERForm.name.toUpperCase() === element["RateType"].toUpperCase());

    const processedData = new BusinessAssociate();

    // Add processed route information if available
    if (updatedOperation) {
      processedData.oPID = updatedOperation.value;
      processedData.oPNM = updatedOperation.name;
    }

    // Add processed location information if available
    if (updatedLocation) {
      processedData.lOCID = updatedLocation.value;
      processedData.lOCNM = updatedLocation.name;
    }

    // Add processed Transport Mode information if available
    if (updatedTransportMode) {
      processedData.mDID = updatedTransportMode.value;
      processedData.mDNM = updatedTransportMode.name;
    }

    // Add processed PayBasis information if available
    if (updatedPayBasis) {
      processedData.pBSID = updatedPayBasis.value;
      processedData.pBSNM = updatedPayBasis.name;
    }

    // Add processed rate Type information if available
    if (updatedRateType) {
      processedData.rTID = updatedRateType.value;
      processedData.rTNM = updatedRateType.name;
    }

    processedData.rT = element["Rate"];
    processedData.mIN = element["Min"];
    processedData.mAX = element["Max"];

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
    link.download = "BusinessAssociateTemplate";
    link.href = "assets/Download/BusinessAssociateTemplate.xlsx";
    link.click();
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()
    //window.history.back();
  }
  //#endregion
}