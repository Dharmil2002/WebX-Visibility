import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { nextKeyCodeByN } from 'src/app/Utility/commonFunction/stringFunctions';
import { UploadFieldType } from 'src/app/config/myconstants';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cluster-master-upload',
  templateUrl: './cluster-master-upload.component.html'
})
export class ClusterMasterUploadComponent implements OnInit {

  clusterUploadForm: UntypedFormGroup;

  validationRules: any[] = [
    // {
    //   Type: UploadFieldType.Key,
    //   Fields: ["",""], // string or string[]
    //   Items: ["", ""], // string or string[]
    // },
    {
      ItemsName: "VendorName",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^[a-zA-Z0-9 -/]{3,150}$" },
        // {
        //   Unique: true,
        //   From: "vendor_detail",
        //   Field: "vendorName",
        // },
        { DuplicateFromList: true }
      ],
    },
    {
      ItemsName: "VendorManager",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z - a-zA-Z]{3,25}$" }
      ]
    },
    {
      ItemsName: "VendorType",
      Validations: [
        { Required: true },
        {
          ExistsInGeneralMaster: true,
          IsComaSeparated: false,
          CodeType: "VENDTYPE",
          //TakeFromArrayList: this.vendorTypeList.map((x) => {return x.name;})
        }
      ]
    },
    {
      ItemsName: "VendorAddress",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^.{1,500}$" }
      ]
    },
    {
      ItemsName: "VendorLocation",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        {
          ExistsInLocationMaster: true,
          IsComaSeparated: true
          //TakeFromArrayList: this.locationList.map((x) => { return x.locCode; }),
        }
      ],
    },
    {
      ItemsName: "VendorPinCode",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        {
          ExistsInPincodeMaster: true,
          IsComaSeparated: false,
          //TakeFromList: this.pincodeList.map((x) => { return x.PIN; }),
        }
      ],
    },
    {
      ItemsName: "VendorContactNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[1-9][0-9]{9}$" }
      ],
    },
    {
      ItemsName: "VendorEmailID",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" } //for one email id
      ],
    },

    {
      ItemsName: "PANNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$" },
        {
          Unique: true,
          From: "vendor_detail",
          Field: "panNo",
        },
        //{ DuplicateFromList: true }
      ],
    },
    {
      ItemsName: "CINNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9]{4,100}$" },
        {
          Unique: true,
          From: "vendor_detail",
          Field: "cinNumber",
        },
        //{ DuplicateFromList: true }
      ],
    },
    {
      ItemsName: "ITRNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9]{4,100}$" }
      ],
    },
    {
      ItemsName: "VendorAdvance%",
      Type: UploadFieldType.Upload,
      Validations: [
        { Numeric: true },
      ],
    },
    {
      ItemsName: "VendorTypeId",
      Type: UploadFieldType.Derived,
      BasedOn: "VendorType",
      From: "General",
      Field: "codeId",
      CodeType: "VENDTYPE",
      Validations: [],
    },
    {
      ItemsName: "VendorCity",
      Type: UploadFieldType.Derived,
      BasedOn: "VendorPinCode",
      From: "Pincode",
      Field: "CT",
      Validations: [],
    },
    {
      ItemsName: "VendorStateId",
      Type: UploadFieldType.Derived,
      BasedOn: "VendorPinCode",
      From: "Pincode",
      Field: "ST",
      Validations: [],
    },
    {
      ItemsName: "VendorState",
      Type: UploadFieldType.Derived,
      BasedOn: "VendorStateId",
      From: "State",
      Field: "STNM",
      Validations: [],
    },
    {
      ItemsName: "CountryId",
      Type: UploadFieldType.Derived,
      BasedOn: "VendorStateId",
      From: "State",
      Field: "CNTR",
      Validations: [],
    },
    {
      ItemsName: "Country",
      Type: UploadFieldType.Derived,
      BasedOn: "CountryId",
      From: "Country",
      Field: "Country",
      Validations: [],
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<ClusterMasterUploadComponent>,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private storage: StorageService,
    private masterService: MasterService

  ) { }

  ngOnInit(): void {
  }


      //#region to select file
  async selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      const jsonData = await this.xlsxUtils.readFile(file);

      // const pincodes = [...new Set(jsonData.map((x) => x.VendorPinCode))];
      // const locations = [...new Set(jsonData.map((x) => x.VendorLocation))];
      // const locationItems = String(locations).split(',').map(item => item.trim().toUpperCase());

      // //Fetch data from DB
      // this.vendorTypeList = await GetGeneralMasterData(this.masterService, "VENDTYPE");
      // this.pincodeList = await this.fetchAllPincodeData(pincodes);
      // this.locationList = await this.fetchAllLocationData(locationItems);

      // const states = [...new Set(this.pincodeList.map((x) => x.ST))];
      // this.zonelist = await this.objState.getStateWithZone({ ST: { D$in: states } });
      // this.countryList = await firstValueFrom(this.masterService.getJsonFileDetails("countryList"));

      try {

        const response = await this.xlsxUtils.validateAllData(jsonData, this.validationRules);
        // const existingRecords = await this.getVendorData(response);

        // Creating lookup tables
        const vendorNames = new Set();
        const panNos = new Set();
        const cinNos = new Set();

        // existingRecords.forEach(rec => {
        //   if (rec.vendorName) vendorNames.add(rec.vendorName.toLowerCase());
        //   if (rec.panNo && rec.panNo !== "") panNos.add(rec.panNo);
        //   if (rec.cinNumber && rec.cinNumber !== "") cinNos.add(rec.cinNumber);
        // });

        const filteredData = await Promise.all(response.map(async (element) => {
          element.error = element.error || [];

          if (vendorNames.has(element.VendorName.toLowerCase())) {
            element.error.push(`VendorName : ${element.VendorName} Already exists`);
          }
          if (panNos.has(element.PANNo)) {
            element.error.push(`PANNo : ${element.PANNo} Already exists`);
          }
          if (cinNos.has(element.CINNo)) {
            element.error.push(`CINNo : ${element.CINNo} Already exists`);
          }

          // const city = this.pincodeList.find(x => x.PIN === parseInt(element.PinCode));
          // if (city) {
          //   element.VendorCity = city.CT;
          //   const state = this.zonelist.find(x => x.ST === city.ST);
          //   if (state) {
          //     element.VendorState = state.STNM;
          //     const country = this.countryList.find(x => x.Code.toLowerCase() === state.CNTR.toLowerCase());
          //     if (country) {
          //       element.Country = country.Country;
          //     }
          //   }
          // }

          if (element.error.length === 0) {
            element.error = null // set the error property null if there are no errors;
          }
          return element;
        }));


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
        hideColumns: this.validationRules.filter(x => x.Type === UploadFieldType.Derived).map(x => x.ItemsName),
      }
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
          //console.log(result);
          this.save(result)
        }
      });
    }
    //#endregion
      //#region to process and save data
  async save(data: any[]) {
    try {
      const chunkSize = 50;
      let successfulUploads = 0;
      const lastVendorCode = await this.masterService.getLastId("vendor_detail", this.storage.companyCode, 'companyCode', 'vendorCode', 'V')

      // Process each element in data using processData
      const processedData = data.map((element, i) => this.processData(element, lastVendorCode, i));

      // Chunk the processedData data recursively
      const chunks = chunkArray(processedData, chunkSize);
      // console.log(chunks);

      // const sendData = async (chunks: VendorMaster[][]) => {
      //   //console.log(chunks);

      //   chunks.forEach(async chunk => {
      //     const request = {
      //       companyCode: this.storage.companyCode,
      //       collectionName: "vendor_detail",
      //       data: chunk,
      //     };
      //     try {
      //       const response = await firstValueFrom(this.masterService.masterPost("generic/create", request));
      //       if (response.success) {

      //         successfulUploads++;
      //       }
      //     } catch (error) {
      //       console.log(error);
      //     }

      //     // Check if all chunks were successfully uploaded
      //     if (successfulUploads === chunks.length) {
      //       Swal.fire({
      //         icon: "success",
      //         title: "Success",
      //         text: "Valid Vendor Data Uploaded",
      //         showConfirmButton: true,
      //       });
      //     }
      //   });
      // };

      // await sendData(chunks);

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

  processData(element, lastVendorCode: string, i: number) {

    let vendorLocations: string[];

    // Check if element.vendorLocation contains a comma
    if (element.VendorLocation.includes(',')) {
      // If it contains a comma, split into an array of locations
      vendorLocations = element.VendorLocation.split(',').map(location => location.trim().toUpperCase());
    } else {
      // If it doesn't contain a comma, treat it as a single location
      vendorLocations = [element.VendorLocation.trim().toUpperCase()];
    }

    // Create a new VendorModel instance to store processed data
    // const processedData = new VendorMaster({});

    // Set basic properties
    const newVendorCode = nextKeyCodeByN(lastVendorCode, (i + 1));
    // processedData.vendorCode = newVendorCode;
    // processedData._id = `${this.storage.companyCode}-${newVendorCode}`;
    // processedData.companyCode = this.storage.companyCode;
    // processedData.vendorName = element.VendorName.toUpperCase();
    // processedData.vendorManager = element.VendorManager;
    // processedData.vendorType = element.VendorTypeId || '';
    // processedData.vendorTypeName = element.VendorType || '';
    // processedData.vendorAddress = element.VendorAddress;
    // processedData.vendorLocation = vendorLocations || [];
    // processedData.vendorPinCode = element.VendorPinCode;
    // processedData.vendorCity = element.VendorCity;
    // processedData.vendorState = element.VendorState;
    // processedData.vendorCountry = element.Country;
    // processedData.vendorPhoneNo = element.VendorContactNo;
    // processedData.emailId = element.VendorEmailID;
    // processedData.panNo = element.PANNo;
    // processedData.cinNumber = element.CINNo;
    // processedData.itrnumber = element.ITRNo;
    // processedData.vendorAdvance = parseFloat(element['VendorAdvance%']).toFixed(2);
    // processedData['otherdetails'] = []

    // // Set timestamp and user information
    // processedData['eNTDT'] = new Date();
    // processedData['eNTBY'] = this.storage.userName;
    // processedData['eNTLOC'] = this.storage.branch;

    // // Return the processed data
    // return processedData;
  }
    //#endregion
    //#region to call close function
    Close() {
      this.dialogRef.close()
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
}
