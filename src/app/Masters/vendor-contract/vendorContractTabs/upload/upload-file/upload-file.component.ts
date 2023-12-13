import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
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
  }

  ngOnInit(): void {
    this.InitializeFormControl();
  }
  //#region  to initialize form Control
  InitializeFormControl() {
    this.fileUpload = new fileUpload();
    this.jsonControlArray = this.fileUpload.getFieldControls();
    this.fileUploadForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  //#endregion
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
    let fileList: FileList = event.eventArgs;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then(async (jsonData) => {
        const routeList = await this.objRouteLocationService.getRouteLocationDetail();
        const rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP');
        const containerData = await this.objContainerService.getContainerList();
        const vehicleData = await PayBasisdetailFromApi(this.masterService, 'VC');
        const containerDataWithPrefix = vehicleData.map((item) => ({
          name: item.name,
          value: item.value,
        }));

        const mergedData = [...containerData, ...containerDataWithPrefix];
        const vendorContractData = []

        await Promise.all(jsonData.map(async (ele) => {
          const updaterateType = rateTypeDropDown.find(item => item.name === ele["Rate Type"]);
          const updatedRoute = routeList.find((TERForm) => TERForm.name === ele["Route"]);
          const updatedCapacity = mergedData.find((TERForm) => TERForm.name === ele["Capacity(Ton)"]);

          const processedData: any = {}; // Create an object to store data for the current element         
          const validationRules = [
            {
              ItemsName: "Rate Type",
              Validations: [{ Required: true }],
            },
            {
              ItemsName: "Route",
              Validations: [{ Required: true }],
            },
            {
              ItemsName: "Capacity(Ton)",
              Validations: [{ Required: true }],
            },
            {
              ItemsName: "Rate(₹)",
              Validations: [{ Required: true }],
            },
            {
              ItemsName: "Min Amount(₹)",
              Validations: [{ Required: true }],
            },
            {
              ItemsName: "Max Amount(₹)",
              Validations: [{ Required: true }],
            }             
          ];
          
          var rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
          rPromise.then(response=> {
            console.log(response);
            
            // this.OpenPreview(response);
            // this.model.containerTableForm.controls["Company_file"].setValue("");
          })
          if (updatedRoute === undefined || updatedRoute === null) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Route is not found in Master`,
            });
            return null;
          } else {
            processedData.rTID = updatedRoute.value;
            processedData.rTNM = updatedRoute.name;
          }

          if (updaterateType === undefined || updaterateType === null) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Rate Type is found in Master`,
            });
            return null;
          } else {
            processedData.rTTID = updaterateType.value;
            processedData.rTTNM = updaterateType.name;
          }

          if (updatedCapacity === undefined || updatedCapacity === null) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Capacity is not found in Master`,
            });
            return null;

          } else {
            processedData.cPCTID = updatedCapacity.value;
            processedData.cPCTNM = updatedCapacity.name;
          }

          vendorContractData.push(processedData);
          // Fetch existing data
          const existingData = await this.fetchExistingData();
          let newId;
          // Find the contract with the specified cNID
          const existingContract = existingData.find(x => x.cNID === this.CurrentContractDetails.cNID);

          if (existingContract) {
            // Sort existing data based on _id for consistency
            const sortedData = existingData.sort((a, b) => a._id.localeCompare(b._id));

            // Extract the last vendor code from the sorted data
            const lastId = sortedData.length > 0 ? parseInt(sortedData[sortedData.length - 1]._id.split('-')[2], 10) : 0;

            // Generate a new _id
            newId = lastId + 1;
          }
          newId = existingContract ? newId : 0

          const formatedData = vendorContractData.map(x => ({
            ...x,
            _id: this.companyCode + "-" + this.CurrentContractDetails.cNID + "-" + newId,
            cID: this.companyCode,
            cNID: this.CurrentContractDetails.cNID,
            rT: ele["Rate(₹)"],
            mIN: ele["Min Amount(₹)"],
            mAX: ele["Max Amount(₹)"],
            eNTBY: localStorage.getItem("UserName"),
            eNTLOC: localStorage.getItem("Branch"),
            eNTDT: new Date(),
          }))
          console.log(formatedData);

        }));

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
}