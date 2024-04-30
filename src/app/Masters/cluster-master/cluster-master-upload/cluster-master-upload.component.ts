import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { chunkArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { nextKeyCodeByN } from "src/app/Utility/commonFunction/stringFunctions";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { UploadFieldType } from "src/app/config/myconstants";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { StorageService } from "src/app/core/service/storage.service";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import { max } from "lodash";
import Swal from "sweetalert2";
import { ClusterMaster } from "src/app/core/models/Masters/cluster-master";

@Component({
  selector: "app-cluster-master-upload",
  templateUrl: "./cluster-master-upload.component.html",
})
export class ClusterMasterUploadComponent implements OnInit {
  clusterUploadForm: UntypedFormGroup;

  //#region to define validation rules
  validationRules: any[] = [
    {
      ItemsName: "ClusterName",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^.{1,100}$" },
        { DuplicateFromList: true },
      ],
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
      ItemsName: "ClusterType",
      Validations: [
        { Required: true },
        {
          ExistsInGeneralMaster: true,
          IsComaSeparated: false,
          CodeType: "CLSTYP",
        },
      ],
    },
    {
      ItemsName: "ClusterTypeId",
      Type: UploadFieldType.Derived,
      BasedOn: "ClusterType",
      From: "General",
      Field: "codeId",
      CodeType: "CLSTYP",
      Validations: [],
    },
  ];
  //#endregion

  //#region constructor
  constructor(
    private dialogRef: MatDialogRef<ClusterMasterUploadComponent>,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private storage: StorageService,
    private masterService: MasterService,
    private fb: UntypedFormBuilder
  ) {
    this.clusterUploadForm = fb.group({
      singleUpload: [""],
    });
  }
  //#endregion

  ngOnInit(): void {}

  //#region to select file
  async selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];
    if (file) {
        let jsonData = await this.xlsxUtils.readFile(file);
      try {
        const response = await this.xlsxUtils.validateAllData(jsonData,this.validationRules);
        const existingRecords = await this.getClusterData(response);
        // Creating lookup tables
        const clusterName = new Set();
        existingRecords.forEach((rec) => {
          if (rec.clusterName) clusterName.add(rec.clusterName.toLowerCase());
        });
        const filteredData = await Promise.all(
          response.map(async (element) => {
            element.error = element.error || [];
            if (clusterName.has(element.ClusterName.toLowerCase())) {
              element.error.push(
                `ClusterName : ${element.ClusterName} Already exists`
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
      const lastClusterCode = await this.masterService.getLastId(
        "cluster_detail",
        this.storage.companyCode,
        "companyCode",
        "clusterCode",
        "C"
      );
      // Process each element in data using processData
      const processedData = data.map((element, i) =>
        this.processData(element, lastClusterCode, i)
      );
      // Chunk the processedData data recursively
      const chunks = chunkArray(processedData, chunkSize);
      const sendData = async (chunks: ClusterMaster[][]) => {
        chunks.forEach(async (chunk) => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "cluster_detail",
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
              text: "Valid Cluster Data Uploaded",
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
        text: "An error occurred while saving cluster Data. Please try again.",
        showConfirmButton: true,
      });
    }
  }
  //#endregion

  //#region to process data
  processData(element, lastClusterCode: string, i: number) {
    let pincodes: number[];
    // Check if element.vendorLocation contains a comma
    if (element.PinCode.includes(",")) {
      // If it contains a comma, split into an array of locations
      pincodes = element.PinCode.split(",").map((Pin) => Pin.trim());
    } else {
      // If it doesn't contain a comma, treat it as a single location
      pincodes = [element.PinCode.trim()];
    }
    // Create a new VendorModel instance to store processed data
    const processedData = new ClusterMaster({});
    // Set basic properties
    const newClusterCode = nextKeyCodeByN(lastClusterCode, i + 1);
    processedData._id = `${newClusterCode}`;
    processedData.clusterCode = newClusterCode;
    processedData.clusterName = element.ClusterName.toUpperCase();
    processedData.pincode = pincodes || [];
    processedData.cLSTYPNM = element.ClusterType || '';
    processedData.cLSTYP = element.ClusterTypeId || '';
    processedData.activeFlag = true;
    processedData.companyCode = this.storage.companyCode;
    // Set timestamp and user information
    processedData["eNTDT"] = new Date();
    processedData["eNTBY"] = this.storage.userName;
    processedData["eNTLOC"] = this.storage.branch;
    // Return the processed data
    return processedData;
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
    link.download = "ClusterMasterTemplate";
    link.href = "assets/Download/ClusterMasterTemplate.xlsx";
    link.click();
  }
  //#endregion

  //#region to get Existing Data from collection
  async getClusterData(data) {
    const clusterName = [...new Set(data.map((x) => x.ClusterName))];
    const cluNms = chunkArray(clusterName, 25);
    const totalChunks = max([cluNms.length]);
    let results = [];
    for (let i = 0; i < totalChunks; i++) {
      const cn = cluNms[i] || [];
      if (cn.length > 0) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: "cluster_detail",
          filter: {
            $or: [...(cn.length > 0 ? [{ clusterName: { D$in: cn } }] : [])],
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
}
