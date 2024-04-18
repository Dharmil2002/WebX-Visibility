import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { GetGeneralMasterData } from '../../Customer Contract/CustomerContractAPIUtitlity';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import Swal from 'sweetalert2';
import { VendorMaster } from 'src/app/core/models/Masters/vendor-master';
import { nextKeyCodeByN } from 'src/app/Utility/commonFunction/stringFunctions';
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { max } from 'lodash';
import { Code } from 'angular-feather/icons';
import { UploadFieldType } from 'src/app/config/myconstants';

@Component({
  selector: 'app-vendor-master-upload',
  templateUrl: './vendor-master-upload.component.html'
})
export class VendorMasterUploadComponent implements OnInit {
  vendorUploadForm: UntypedFormGroup;
  pincodeList: any;
  zonelist: any;
  countryList: any;
  vendorTypeList: any;
  locationList: any;

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
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,    
    private dialog: MatDialog,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<VendorMasterUploadComponent>,
    private objState: StateService,
    private objPinCodeService: PinCodeService,
    private storage: StorageService,
    private locationService: LocationService
  ) {
    this.vendorUploadForm = fb.group({
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
  //#region to fetch all pincode data
  async fetchAllPincodeData(pinChunks) {
    const chunks = chunkArray(pinChunks, 50);

    const promises = chunks.map(chunk =>
      this.objPinCodeService.pinCodeDetail({ PIN: { D$in: chunk } })
    );

    const results = await Promise.all(promises);
    return results.flat();  // This will merge all results into a single array
  }
  //#endregion
  //#region to fetch all location data
  async fetchAllLocationData(locationChunks) {
    const chunks = chunkArray(locationChunks, 50);

    const promises = chunks.map(chunk =>
      this.locationService.getLocations({
        companyCode: this.storage.companyCode,
        locCode: { D$in: chunk },
        activeFlag: true
      }, { _id: 0, locCode: 1, locName: 1 })
    );
    const result = await Promise.all(promises);
    return result.flat();  // This will merge all results into a single array
  }
  //#endregion
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
        const existingRecords = await this.getVendorData(response);

        // Creating lookup tables
        const vendorNames = new Set();
        const panNos = new Set();
        const cinNos = new Set();

        existingRecords.forEach(rec => {
          if (rec.vendorName) vendorNames.add(rec.vendorName.toLowerCase());
          if (rec.panNo && rec.panNo !== "") panNos.add(rec.panNo);
          if (rec.cinNumber && rec.cinNumber !== "") cinNos.add(rec.cinNumber);
        });

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

      const sendData = async (chunks: VendorMaster[][]) => {
        //console.log(chunks);

        chunks.forEach(async chunk => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "vendor_detail",
            data: chunk,
          };
          try {
            const response = await firstValueFrom(this.masterService.masterPost("generic/create", request));
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
              text: "Valid Vendor Data Uploaded",
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
    const processedData = new VendorMaster({});

    // Set basic properties
    const newVendorCode = nextKeyCodeByN(lastVendorCode, (i + 1));
    processedData.vendorCode = newVendorCode;
    processedData._id = `${this.storage.companyCode}-${newVendorCode}`;
    processedData.companyCode = this.storage.companyCode;
    processedData.vendorName = element.VendorName.toUpperCase();
    processedData.vendorManager = element.VendorManager;
    processedData.vendorType = element.VendorTypeId || '';
    processedData.vendorTypeName = element.VendorType || '';
    processedData.vendorAddress = element.VendorAddress;
    processedData.vendorLocation = vendorLocations || [];
    processedData.vendorPinCode = element.VendorPinCode;
    processedData.vendorCity = element.VendorCity;
    processedData.vendorState = element.VendorState;
    processedData.vendorCountry = element.Country;
    processedData.vendorPhoneNo = element.VendorContactNo;
    processedData.emailId = element.VendorEmailID;
    processedData.panNo = element.PANNo;
    processedData.cinNumber = element.CINNo;
    processedData.itrnumber = element.ITRNo;
    processedData.vendorAdvance = parseFloat(element['VendorAdvance%']).toFixed(2);
    processedData['otherdetails'] = []

    // Set timestamp and user information
    processedData['eNTDT'] = new Date();
    processedData['eNTBY'] = this.storage.userName;
    processedData['eNTLOC'] = this.storage.branch;

    // Return the processed data
    return processedData;
  }
  //#endregion
  //#region to get Existing Data from collection
  async getVendorData(data) {
    const vendorName = [... new Set(data.map((x) => x.VendorName))];
    const panNo = [... new Set(data.map((x) => x.PANNo))];
    const cinNumber = [... new Set(data.map((x) => x.CINNo))];

    const venNms = chunkArray(vendorName, 25);
    const pans = chunkArray(panNo, 25);
    const cins = chunkArray(cinNumber, 25);

    const totalChunks = max([venNms.length, pans.length, cins.length]);
    let results = [];
    for (let i = 0; i < totalChunks; i++) {
      const vc = venNms[i] || [];
      const pc = pans[i] || [];
      const cc = cins[i] || [];

      if (vc.length > 0 || pc.length > 0 || cc.length > 0) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: "vendor_detail",
          filter: {
            $or: [
              ...(vc.length > 0 ? [{ vendorName: { D$in: vc } }] : []),
              ...(pc.length > 0 ? [{ panNo: { D$in: pc } }] : []),
              ...(cc.length > 0 ? [{ cinNumber: { D$in: cc } }] : [])
            ]
          },
        };
        const response = await firstValueFrom(this.masterService.masterPost("generic/get", request));
        results = [...results, ...response.data];
      }
    }
    return results;
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
    link.download = "VendorMasterTemplate";
    link.href = "assets/Download/VendorMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
}