import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { vendorContractUpload } from 'src/app/Models/VendorContract/vendorContract';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { fileUpload } from 'src/assets/FormControls/VendorContractControls/fileUpload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {
  fileUpload: fileUpload;
  jsonControlArray: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  fileUploadForm: UntypedFormGroup;
  excelDataList: any;
  previewResult: any;
  CurrentContractDetails: any;
  routeList: any[];
  rateTypeDropDown: any;
  mergedCapacity: any[];
  existingData: any;
  // vendorContractData: vendorContractUpload;
  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private objRouteLocationService: RouteLocationService,
    private objContainerService: ContainerService,
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
        this.routeList = await this.objRouteLocationService.getRouteLocationDetail();
        this.rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP');
        const containerData = await this.objContainerService.getContainerList();
        const vehicleData = await PayBasisdetailFromApi(this.masterService, 'VC');

        console.log("TakeFromList:", this.rateTypeDropDown.map((x) => {
          return x.name;
        }),);
        // Process vehicle data to create a merged list
        const containerDataWithPrefix = vehicleData.map(item => ({
          name: item.name,
          value: item.value,
        }));
        this.mergedCapacity = [...containerData, ...containerDataWithPrefix];
        const validationRules = [{
          ItemsName: "Route",
          Validations: [{ Required: true },
          {
            TakeFromList: this.routeList.map((x) => {
              return x.name;
            }),
          },
          {
            Exists: this.existingData
              .filter(item => item.cNID === this.CurrentContractDetails.cNID)
              .map(item => item.rTNM)
          }],
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
          ItemsName: "Capacity",
          Validations: [{ Required: true }, {
            TakeFromList: this.mergedCapacity.map((x) => {
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
          ItemsName: "MinAmount",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 }
          ],
        },
        {
          ItemsName: "MaxAmount",
          Validations: [
            { Required: true },
            { Numeric: true },
            { MinValue: 1 }
          ],
        }
        ];

        var rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        rPromise.then(response => {

          this.OpenPreview(response);
        })
      });
    }
  }
  async fetchExistingData() {
    // Fetch existing data for creating a new contract
    const request = {
      companyCode: this.companyCode,
      collectionName: "vendor_contract_xprs_rt",
      filter: {},
    };

    const response = await this.masterService.masterPost("generic/get", request).toPromise();
    return response.data;
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
      if (result != undefined) {
        this.previewResult = result;
        // this.containorCsvDetail();
        this.setDropdownData()
      }
    });
  }
  containorCsvDetail() {
    if (this.previewResult.length > 0) {
      // this.tableLoad = true;
      // this.isLoad = true;
      let containerNo = [];
      // console.log(this.previewResult);
    
      const containerDetail = this.previewResult.map((x, index) => {
        // console.log(x, index);

        // if (x) {
        //   const detail = containerNo.includes(x.containerNumber);
        //   const match = this.containerTypeList.find(
        //     (y) => y.name === x.containerType
        //   );
        //   if (match) {
        //     x.containerCapacity = match?.loadCapacity || "";
        //   }
        //   if (detail) {
        //     Swal.fire({
        //       icon: "error",
        //       title: "Error",
        //       text: `Container Id '${x.containerNumber}' is Already exist`,
        //     });
        //     return null; // Returning null to indicate that this element should be removed
        //   }
        //   if (!x.isEmpty) {
        //     Swal.fire({
        //       icon: "error",
        //       title: "Error",
        //       text: `IsEmpty is Required`,
        //     });
        //     return null; // Returning null to indicate that this element should be removed
        //   }
        //   // Modify 'x' if needed
        //   // For example, you can add the index to the element
        //   containerNo.push(x.containerNumber);
        //   x.id = index + 1;
        //   x.actions = ["Edit", "Remove"];
        //   return x;
        // }
        // return x; // Return the original element if no modification is needed
      });
      // Filter out the null values if necessary
      const filteredContainerDetail = containerDetail.filter((x) => x !== null);
      // this.tableData = filteredContainerDetail;
      // this.tableLoad = false;
      // this.isLoad = false;
    }
  }
  async setDropdownData() {
    try {
      // Process preview data to create vendor contract data
      const vendorContractData = this.previewResult.forEach(element =>
        this.processData(element, this.routeList, this.rateTypeDropDown, this.mergedCapacity)
      );

      // Generate a new ID based on existing data
      const newId = this.generateNewId(this.existingData);

      // Format the final data with additional information
      const formattedData = vendorContractData.map(x => this.formatContractData(x, newId));

      // Log the formatted data
      console.log(formattedData);
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error("Error:", error);
    }
  }

  // Function to process individual preview data
  processData(element, routeList, rateTypeDropDown, mergedData) {
    const updaterateType = rateTypeDropDown.find(item => item.name === element["RateType"]);
    const updatedRoute = routeList.find(TERForm => TERForm.name === element["Route"]);
    const updatedCapacity = mergedData.find(TERForm => TERForm.name === element["Capacity"]);

    const processedData = new vendorContractUpload();

    // Add processed route information if available
    if (updatedRoute) {
      processedData.rTID = updatedRoute.value;
      processedData.rTNM = updatedRoute.name;
    }

    // Add processed rate type information if available
    if (updaterateType) {
      processedData.rTTID = updaterateType.value;
      processedData.rTTNM = updaterateType.name;
    }

    // Add processed capacity information if available
    if (updatedCapacity) {
      processedData.cPCTID = updatedCapacity.value;
      processedData.cPCTNM = updatedCapacity.name;
    }

    processedData.rT = element["Rate"];
    processedData.mIN = element["MinAmount"];
    processedData.mAX = element["MaxAmount"];

    return processedData;
  }

  // Function to format contract data
  formatContractData(processedData, newId) {
    return {
      ...processedData,
      _id: `${this.companyCode}-${this.CurrentContractDetails.cNID}-${newId}`,
      cID: this.companyCode,
      cNID: this.CurrentContractDetails.cNID,
    };
  }

  // Function to generate a new ID based on existing data
  generateNewId(existingData) {
    const existingContract = existingData.find(x => x.cNID === this.CurrentContractDetails.cNID);

    // If an existing contract is found, generate a new ID based on the last ID in the sorted data
    if (existingContract) {
      const sortedData = existingData.sort((a, b) => a._id.localeCompare(b._id));
      const lastId = sortedData.length > 0 ? parseInt(sortedData[sortedData.length - 1]._id.split('-')[2], 10) : 0;
      return lastId + 1;
    } else {
      // If no existing contract is found, start with ID 0
      return 0;
    }
  }
}