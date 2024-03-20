import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { prqUpload } from "src/app/Models/prq-model/prqsummary.model";
import { finYear } from "src/app/Utility/date/date-utils";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { EncryptionService } from "src/app/core/service/encryptionService.service";
import {containerFromApi, customerFromApi,locationFromApi} from "src/app/operation/prq-entry-page/prq-utitlity";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-prq-bulk-upload",
  templateUrl: "./prq-bulk-upload.component.html",
})
export class PrqBulkUploadComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  IsUploaded: boolean;
  fileUploadForm: UntypedFormGroup;
  existingData: any;
  routeList: any[];
  mergedCapacity: any[];
  prqDetails: any;
  customerDropDown: any;
  locationDropDown: any;
  containerDropDown: any;
  carrierData: any;
  vehicleTypeData: any;
  paymentBaseData: any;
  carrierType:any;
  vehicleType: any;
  paymentBase: any;

  constructor(
    private dialogRef: MatDialogRef<PrqBulkUploadComponent>,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private objGeneralService: GeneralService
  ) // private objprqLocationService: RouteLocationService,
  {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params["data"]; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.prqDetails = JSON.parse(decryptedData);
    });
    this.fileUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {}

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
        this.locationDropDown = await locationFromApi(this.masterService);
        this.customerDropDown = await customerFromApi(this.masterService);
        this.containerDropDown = await containerFromApi(this.masterService);
          const carrierData = await this.objGeneralService.getGeneralMasterData("CARTYP");
          const vehicleTypeData = await this.objGeneralService.getGeneralMasterData("VEHSIZE");
          const paymentBaseData = await this.objGeneralService.getGeneralMasterData("PAYTYP");
          this.vehicleType=vehicleTypeData
          this.carrierType=carrierData
          this.paymentBase=paymentBaseData
          //set name and value
          const locationValue = this.locationDropDown.map((x) => x.name);
          const locationName = this.locationDropDown.map((x) => x.value);
          const customerValue = this.customerDropDown.map((x) => x.value);
          const customerName = this.customerDropDown.map((x) => x.name);
          const containerValue = this.containerDropDown.map((x) => x.value);
          const containerName = this.containerDropDown.map((x) => x.name);
          const carrierValue = carrierData.map((x) => x.value);
          const carrierName = carrierData.map((x) => x.name);
          const vehicleTypeValue = vehicleTypeData.map((x) => x.value);
          const vehicleTypeName = vehicleTypeData.map((x) => x.name);
          const paymentBaseValue = paymentBaseData.map((x) => x.value);
          const paymentBaseName = paymentBaseData.map((x) => x.name);
          // margedata name and value
          const mergelocations = [...locationValue, ...locationName];
          const mergecustomers = [...customerValue, ...customerName];
          const mergecontainer = [...containerValue, ...containerName];
          const mergecarrierData = [...carrierValue, ...carrierName];
          const mergevehicleTypeData = [...vehicleTypeValue, ...vehicleTypeName];
          const mergepaymentBaseData = [...paymentBaseValue, ...paymentBaseName];
        // Process vehicle data to create a merged list
        this.mergedCapacity = [
          ...mergecustomers,
          ...mergecarrierData,
          ...mergevehicleTypeData,
          ...mergepaymentBaseData
        ];
        const validationRules = [
          {
            ItemsName: "BillingParty",
            Validations: [
              { Required: true },
              {
                TakeFromList: mergecustomers
              },
            ],
          },
          {
            ItemsName: "PickupDateTime",
            Validations: [
              { Required: true },
              { dateLimit: true },
              { range:1}
            ],
          },
          {
            ItemsName: "CarrierType",
            Validations: [
              { Required: true },
              {
                TakeFromList: mergecarrierData
              },
            ],
          },
          {
            ItemsName: "TypeofContainer",
            Validations: [
              {
                TakeFromList: mergecontainer
              }
            ],
          },
          {
            ItemsName: "ContainerCapacity",
            Validations: [{ Numeric: true }],
          },
          {
            ItemsName: "TruckCapacity",
            Validations: [
              {
                TakeFromList: mergevehicleTypeData
              },
            ],
          },
          {
            ItemsName: "ContactNo",
            Validations: [{ Numeric: true }],
          },
          {
            ItemsName: "PickupAddres",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "FromCity",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.locationDropDown.map((x) => {
                  return x.city;
                }),
              },
            ],
          },
          {
            ItemsName: "ToCity",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.locationDropDown.map((x) => {
                  return x.city;
                }),
              },
            ],
          },
          {
            ItemsName: "PRQBranch",
            Validations: [
              { Required: true },
              {
                TakeFromList: mergelocations
              },
            ],
          },
          {
            ItemsName: "PaymentMode",
            Validations: [
              { Required: true },
              {
                TakeFromList: mergepaymentBaseData
              },
            ],
          },
          {
            ItemsName: "ContractAmount",
            Validations: [
              { Required: true },
              { Numeric: true },
              { MinValue: 1 },
            ],
          },
          {
            ItemsName: "OrderNo",
            Validations: [{ Pattern: "^.{4,25}$" }],
          },
          {
            ItemsName: "OrderDateTime",
            Validations: [
              { Required: true },
              { range: 1 },
            ],
          },
          {
            ItemsName: "OrderBy",
            Validations: [{ Pattern: "^[a-z A-Z]{4,100}$" }],
          },
          {
            ItemsName: "Remarks",
            Validations: [{ Pattern: "^.{4,300}$" }],
          },
        ];
        (async () => {
          try {
            const result = await firstValueFrom(
              this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules)
            );
            this.OpenPreview(result);
          } catch (error) {
            console.error("Error during validation or opening preview:", error);
            // Handle the error appropriately, e.g., show an error message to the user.
          }
        })();
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
        this.saveData(result);
      }
    });
  }
  //#endregion

  //#region to set dropdown's value
  async saveData(previewResult) {
    try {
      const prqData: prqUpload[] = [];
      // Process preview data to create vendor contract data
      previewResult.forEach((element) => {
        const processedData = this.processData
        (element,this.customerDropDown,this.locationDropDown,this.containerDropDown);
        prqData.push(processedData);
      });
      const createRequest = {
        companyCode: this.companyCode,
        collectionName: "prq_summary",
        data: prqData,
        finyear:finYear
      };

      const createResponse = await firstValueFrom(this.masterService.masterPost("operation/prq/upload", createRequest));

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
  processData(element, customerDropDown, locationDropDown, containerDropDown) {
    const updateCustomer = customerDropDown.find(
      (item) => item.name.toUpperCase() === element["BillingParty"].toUpperCase()
    );
    const updateCarrierType = this.carrierType.find(
      (item) => item.name.toUpperCase() === element["CarrierType"].toUpperCase()
    );
    const updatecontainerType = containerDropDown.find(
      (item) => item.name.toUpperCase() === element["TypeofContainer"].toUpperCase()
    );
    const updateTruckCapacity = this.vehicleType.find(
      (item) => item.name.toUpperCase() === element["TruckCapacity"].toUpperCase()
    );
    const updateFromCity = locationDropDown.find(
      (item) => item.city.toUpperCase() === element["FromCity"].toUpperCase()
    );
    const updateToCity = locationDropDown.find(
      (item) => item.city.toUpperCase() === element["ToCity"].toUpperCase()
    );
    const updatelocation = locationDropDown.find(
      (item) => item.value.toUpperCase() === element["PRQBranch"].toUpperCase()
    );
    const updatePaymentMode = this.paymentBase.find(
      (item) => item.name.toUpperCase() === element["PaymentMode"].toUpperCase()
    );

    const processedData = new prqUpload();

    // Add processed BillingParty information if available
    if (updateCustomer) {
      processedData.bPARTY = updateCustomer.value;
      processedData.bPARTYNM = updateCustomer.name;
    }
    // Add processed CarrierType information if available
    if (updateCarrierType) {
      processedData.cARTYP = updateCarrierType.value;
      processedData.cARTYPNM = updateCarrierType.name;
    }
    // Add processed ContainerType information if available
    if (updatecontainerType) {
      processedData.cNTYP = updatecontainerType.value;
      processedData.cNTYPNM = updatecontainerType.name;
      processedData.sIZE = element["ContainerCapacity"];
    }
    // Add processed TruckCapacity information if available
    if (updateTruckCapacity) {
      processedData.vEHSIZE = updateTruckCapacity.value;
      processedData.vEHSIZENM = updateTruckCapacity.name;
      processedData.sIZE = updateTruckCapacity.value;
    }
     // Add processed FromCity information if available
     if (updateFromCity) {
      processedData.fCITY = updateFromCity.name;
    }
     // Add processed ToCity information if available
     if (updateToCity) {
      processedData.tCITY = updateToCity.name;
    }
    // Add processed PRQBranch information if available
    if (updatelocation) {
      processedData.bRCD = updatelocation.value;
    }
    // Add processed PaymentMode information if available
    if (updatePaymentMode) {
      processedData.pAYTYP = updatePaymentMode.value;
      processedData.pAYTYPNM = updatePaymentMode.name;
    }

      processedData.pICKDT = new Date(element["PickupDateTime"]);
      processedData.cNTSIZE = element["ContainerCapacity"];
      processedData.pHNO = element["ContactNo"];
      processedData.pADD = "A8888";
      processedData.pADDNM = element["PickupAddres"];
      processedData.cONTRAMT = element["ContractAmount"];
      processedData.oDRNO = element["OrderNo"];
      processedData.oDRDT = new Date(element["OrderDateTime"]);
      processedData.oDRBY = element["OrderBy"];
      processedData.rMKS = element["Remarks"];
    return processedData;
  }
  //#endregion

  //#region to get Existing Data from collection
  async fetchExistingData() {
    const request = {
      companyCode: this.companyCode,
      collectionName: "prq_summary",
      filter: {},
    };

    const response = await firstValueFrom(
      this.masterService.masterMongoPost("generic/get", request)
    );
    return response.data;
  }
  //#endregion

  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "PRQTemplate";
    link.href = "assets/Download/PRQTemplate.xlsx";
    link.click();
  }
  //#endregion

  //#region to call close function
  Close() {
    this.dialogRef.close();
    //window.history.back();
  }
  //#endregion
}
