import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { PayBasisdetailFromApi, productdetailFromApi } from '../../../CustomerContractAPIUtitlity';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';

@Component({
  selector: 'app-freight-charge-upload',
  templateUrl: './freight-charge-upload.component.html'
})
export class FreightChargeUploadComponent implements OnInit {
  fileUploadForm: UntypedFormGroup;
  CurrentContractDetails: any;
  existingData: any;
  capacityList: any[];
  ServiceSelectiondata: any;
  rateTypedata: any;
  arealist: any[];
  transportMode: any;


  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private xlsxUtils: xlsxutilityService,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<FreightChargeUploadComponent>,
    private storage: StorageService,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private objContainerService: ContainerService,
    private objPinCodeService: PinCodeService,
    private objState: StateService
  ) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
      console.log(this.CurrentContractDetails);
    });
    this.fileUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  async ngOnInit(): Promise<void> {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "cust_contract",
      filter: { docNo: this.CurrentContractDetails.cONID },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    this.ServiceSelectiondata = {
      loadType: res.data[0].lTYP,
      rateTypecontrolHandler: res.data[0].rTYP,
    };
  }

  //#region to select filey
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
        const RatData = await PayBasisdetailFromApi(this.masterService, "RTTYP");
        this.rateTypedata = this.ServiceSelectiondata.rateTypecontrolHandler.map(
          (x, index) => {
            return RatData.find((t) => t.value == x);
          }
        );
        const containerData = await this.objContainerService.getContainerList();
        const vehicleData = await PayBasisdetailFromApi(
          this.masterService,
          "VehicleCapacity"
        );
        const containerDataWithPrefix = vehicleData.map((item) => ({
          name: `Veh- ${item.name}`,
          value: item.value,
        }));
        this.capacityList = [...containerDataWithPrefix, ...containerData];
        const pincodeList = await this.objPinCodeService.pinCodeDetail();
        const zonelist = await this.objState.getStateWithZone();
        this.transportMode = await productdetailFromApi(this.masterService);
        console.log(zonelist);

        this.arealist = [...pincodeList, zonelist]
        console.log(this.arealist);

        const validationRules = [
          {
            ItemsName: "From",
            Validations: [{ Required: true },
            {
              TakeFromList: this.arealist.map((x) => {
                return x.PIN, x.ZN, x.STNM;
              }),
            }
            ],
          },
          {
            ItemsName: "To",
            Validations: [{ Required: true },
            {
              TakeFromList: this.arealist.map((x) => {
                return x.PIN, x.ZN, x.STNM;
              }),
            }
            ],
          },
          {
            ItemsName: "RateType",
            Validations: [{ Required: true },
            {
              TakeFromList: this.rateTypedata.map((x) => {
                return x.name;
              }),
            },
            ],
          },
          {
            ItemsName: "Capacity",
            Validations: [{ Required: true }, {
              TakeFromList: this.capacityList.map((x) => {
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
            ItemsName: "TransitDays",
            Validations: [
              // { Required: true },
              { Numeric: true },
              { MinValue: 1 },
              //{ CompareMinMaxValue: true }
            ],
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
        ];
console.log(vehicleData);

        var rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        rPromise.then(async response => {
          console.log(response);
          this.OpenPreview(response);
        })
      });
    }
  }
  //#region to call close function
  Close() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "FreightChargeTemplate";
    link.href = "assets/Download/FreightChargeTemplate.xlsx";
    link.click();
  }
  //#endregion
  //#region to get Existing Data from collection
  async fetchExistingData(filter = {}) {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_contract_freight_charge_matrix",
      filter: filter,
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
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
        // this.saveData(result)
      }
    });
  }
  //#endregion
}
