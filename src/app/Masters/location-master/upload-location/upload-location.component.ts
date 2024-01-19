import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';

@Component({
  selector: 'app-upload-location',
  templateUrl: './upload-location.component.html'
})
export class UploadLocationComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  fileUploadForm: UntypedFormGroup;
  CurrentContractDetails: any;
  routeList: any[];
  rateTypeDropDown: any;
  mergedCapacity: any[];
  existingData: any;
  hierachy: any[];
  locOwnerShipList: any[];
  pincodeList: any[];
  cityList: any;
  stateList: any[];
  constructor(
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<UploadLocationComponent>,
    private objGeneralService: GeneralService,
    private objState: StateService,
    private objPinCodeService: PinCodeService,


  ) {

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
        console.log(jsonData);

        // Fetch data from various services
        this.existingData = await this.fetchExistingData();
        this.hierachy = await this.objGeneralService.getGeneralMasterData("HRCHY");
        this.locOwnerShipList = await this.objGeneralService.getGeneralMasterData("LOC_OWN");
        this.pincodeList = await this.objPinCodeService.pinCodeDetail();
        this.cityList = await this.objPinCodeService.getCityDetails();
        this.stateList = await this.objState.getState();

        // Fetch state details by state name


        const validationRules = [
          {
            ItemsName: "LocationCode",
            Validations: [
              { Required: true },
              { Pattern: "^[.a-zA-Z0-9,-]{0,5}$" }
            ],
          },
          {
            ItemsName: "LocationName",
            Validations: [
              { Required: true },
              { Pattern: "^[a-zA-Z ]{3,25}$" }
            ],
          },

          {
            ItemsName: "LocationHirarchay",
            Validations: [

              { Required: true },
              {
                TakeFromList: this.hierachy.map((x) => {
                  return x.name;
                }),
              }
            ],
          },
          {
            ItemsName: "Reportingto",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.hierachy.map((x) => {
                  return x.name;
                }),
              },],
          },
          {
            ItemsName: "ReportingLocation",
            Validations: [
              { Required: true },
              // {
              //   TakeFromList: this.rateTypeDropDown.map((x) => {
              //     return x.name;
              //   }),
              // },
            ],
          },
          {
            ItemsName: "PinCode",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.pincodeList.map((x) => {
                  return x.name;
                }),
              },],
          },
          {
            ItemsName: "Address",
            Validations: [
              { Required: true },
            ],
          },
          {
            ItemsName: "LocationOwnership",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.locOwnerShipList.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
          {
            ItemsName: "Lat",
            Validations: [

              { Numeric: true },
              //{ MinValue: 0.0 },
            ],
          },
          {
            ItemsName: "Log",
            Validations: [

              { Numeric: true },
              //{ MinValue: 1 },
            ],
          },
          {
            ItemsName: "MappedAreaCity",
            Validations: [

              {
                TakeFromList: this.cityList.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
          {
            ItemsName: "MappedAreaState",
            Validations: [

              {
                TakeFromList: this.stateList.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
          {
            ItemsName: "GSTNumber",
            Validations: [
              { Pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" }
            ],
          }
        ];
        const response = await firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        console.log('response = ', response);
        this.OpenPreview(response);

        // var rPromise = await firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        // console.log(rPromise);

        // rPromise.then(async response => {
        //   console.log('response =  ');
        //   console.log(response);
        //   this.OpenPreview(response)        
        // })
      });
    }
  }
  //#endregion
  //#region to get Existing Data from collection
  async fetchExistingData() {
    const request = {
      companyCode: this.companyCode,
      collectionName: "location_detail",
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
        // this.setDropdownData(result)
      }
    });
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "ExpressRoutebasedTemplate";
    link.href = "assets/Download/ExpressRoutebasedTemplate.xlsx";
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
