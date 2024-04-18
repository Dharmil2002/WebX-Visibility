import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { chunkArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { nextKeyCodeByN } from "src/app/Utility/commonFunction/stringFunctions";
import { ContainerService } from "src/app/Utility/module/masters/container/container.service";
import { VendorService } from "src/app/Utility/module/masters/vendor-master/vendor.service";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { StorageService } from "src/app/core/service/storage.service";
import { max } from "lodash";
import Swal from "sweetalert2";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: "app-container-master-upload",
  templateUrl: "./container-master-upload.component.html",
})
export class ContainerMasterUploadComponent implements OnInit {
  ContainerUploadForm: UntypedFormGroup;
  ContainerList: any[];
  customerList: any[];
  vendorList: any[];
  containerList: any;
  VendorList: any[];

  constructor(
    private dialogRef: MatDialogRef<ContainerMasterUploadComponent>,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private objContainerService: ContainerService,
    private objVendorService: VendorService,
    private masterService: MasterService,
    private storage: StorageService
  ) {
    this.ContainerUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {}

  //#region to fetch all Container data
  async fetchAllContainerData(contChunks) {
    const chunks = chunkArray(contChunks, 50);
    const promises = chunks.map((chunk) =>
      this.objContainerService.ContainerDetail({
        containerCode: { D$in: chunk },
      })
    );
    const results = await Promise.all(promises);
    return results.flat(); // This will merge all results into a single array
  }
  //#endregion

  //#region to fetchAllVendorData
  async fetchAllVendorData(venChunks) {
    const chunks = chunkArray(venChunks, 50);
    const promises = chunks.map((chunk) =>
      this.objVendorService.VendorDetail({ vendorName: { D$in: chunk } })
    );
    const results = await Promise.all(promises);
    return results.flat(); // This will merge all results into a single array
  }
  //#endregion

  //#region processData
  processData(element, lastcontainerCode: string, i: number) {
    const updateContainer = this.ContainerList.find(
      (item) =>
        item.containerCode.toLowerCase() === element.ContainerType.toLowerCase()
    );
    const updatevendor = this.VendorList.find(
      (item) =>
        item.vendorName.toLowerCase() === element.VendorName.toLowerCase()
    );
    const newcontainerCode = nextKeyCodeByN(lastcontainerCode, i + 1);
    const data = {
      _id: `${this.storage.companyCode}-${newcontainerCode}`,
      cNTYPNM: updateContainer.containerName, // container type name
      cNTYPCD: updateContainer.containerCode, // container type code
      cNNO: element.ContainerNumber, // container number
      vNTYP: "Own",
      vNTYPCD: "VENDTYPE-0001", // vendor type "VENDTYPE-0001:Own"
      vNNM: updatevendor.vendorName, // vendor name
      vNCD: updatevendor.vendorCode, // vendor code
      gRW: parseFloat(element.GrossWeight).toFixed(2), // gross weight
      tRW: parseFloat(element.TareWeight).toFixed(2), // Tare weight
      nETW: parseFloat(element.NetWeight).toFixed(2), // net weight
      cNCD: newcontainerCode, //container code
      companyCode: this.storage.companyCode,
      eNTDT: new Date(),
      eNTBY: this.storage.userName,
      eNTLOC: this.storage.branch,
    };
    // Return the processed data
    return data;
  }
  //#endregion

  //#region select file
  selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then(async (jsonData) => {
        const cNTYPCD = [...new Set(jsonData.map((x) => x.ContainerType))];
        const vNNM = [...new Set(jsonData.map((x) => x.VendorName))];
        // Fetch data from DB
        this.ContainerList = await this.fetchAllContainerData(cNTYPCD);
        this.VendorList = await this.fetchAllVendorData(vNNM);
        const validationRules = [
          {
            ItemsName: "ContainerType",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.ContainerList.map((x) => {
                  return x.containerCode;
                }),
              },
            ],
          },
          {
            ItemsName: "ContainerNumber",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "VendorType",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "VendorName",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.VendorList.map((x) => {
                  return x.vendorName;
                }),
              },
            ],
          },
          {
            ItemsName: "GrossWeight",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "TareWeight",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "NetWeight",
            Validations: [{ Required: true }],
          },
        ];
        try {
          const response = await firstValueFrom(
            this.xlsxUtils.validateData(jsonData, validationRules)
          );
          const existingRecords = await this.getContainerData(response);
          //Creating lookup tables
          const cNNO = new Set();
          existingRecords.forEach((rec) => {
            if (rec.cNNO) cNNO.add(rec.cNNO);
          });
          const filteredData = await Promise.all(
            response.map(async (element) => {
              element.error = element.error || [];
              if (cNNO.has(element.ContainerNumber)) {
                element.error.push(
                  `ContainerNumber : ${element.ContainerNumber} Already exists`
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
      });
    }
  }
  //#endregion

  //#region to get container data
  async getContainerData(data) {
    const cNNO = [...new Set(data.map((x) => x.ContainerNumber))];
    const mncod = chunkArray(cNNO, 25);
    const totalChunks = max([mncod.length]);
    let results = [];
    for (let i = 0; i < totalChunks; i++) {
      const mc = mncod[i] || [];
      if (mc.length > 0) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: "address_detail",
          filter: {
            $or: [...(mc.length > 0 ? [{ cNNO: { D$in: mc } }] : [])],
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
        this.save(result);
      }
    });
  }
  //#endregion

  //#region  save
  async save(data: any[]) {
    try {
      const chunkSize = 50;
      let successfulUploads = 0;
      const lastcontainerCode = await this.masterService.getLastId(
        "container_detail_master",
        this.storage.companyCode,
        "companyCode",
        "cNCD",
        "C"
      );
      // Process each element in data using processData
      const processedData = data.map((element, i) =>
        this.processData(element, lastcontainerCode, i)
      );
      // Chunk the processedData data recursively
      const chunks = chunkArray(processedData, chunkSize);
      // console.log(chunks);
      const sendData = async (chunks: [][]) => {
        chunks.forEach(async (chunk) => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "container_detail_master",
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
              text: "Valid Container Data Uploaded",
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
        text: "An error occurred while saving Container Data. Please try again.",
        showConfirmButton: true,
      });
    }
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

  //#region to call close function
  Close() {
    this.dialogRef.close();
  }
  //#endregion

  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "ContainerMasterTemplate";
    link.href = "assets/Download/ContainerMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
}
