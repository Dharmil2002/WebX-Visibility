import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { AddressMaster } from "src/app/core/models/Masters/address-master";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { StorageService } from "src/app/core/service/storage.service";
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { nextKeyCodeByN } from 'src/app/Utility/commonFunction/stringFunctions';
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { max } from 'lodash';
import Swal from 'sweetalert2';
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StateService } from "src/app/Utility/module/masters/state/state.service";

@Component({
  selector: "app-address-master-upload",
  templateUrl: "./address-master-upload.component.html",
})
export class AddressMasterUploadComponent implements OnInit {
  AddressUploadForm: UntypedFormGroup;
  pincodeList: any;
  customerList: any;
  zonelist: any;
  constructor(
    private dialogRef: MatDialogRef<AddressMasterUploadComponent>,
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private storage: StorageService,
    private objPinCodeService: PinCodeService,
    private objCustomerService: CustomerService,
    private masterService: MasterService,
    private objState: StateService
  ) {
    this.AddressUploadForm = fb.group({
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

  //#region processData
  processData(element, lastAddressCode: string, i: number) {
    const updatepincode = this.pincodeList.find(item => item.PIN === parseInt(element.pincode));
    let customer: string[];
    // Check if element.customer contains a comma
    if (element.customer.includes(',')) {
      // If it contains a comma, split into an array of locations
      customer = element.customer.split(',').map(customer => customer.trim().toUpperCase());
    } else {
      // If it doesn't contain a comma, treat it as a single location
      customer = [element.customer.trim()];
    }
    // Find the matching locations in locationList
    const updatecustomerList = this.customerList.filter(item => customer.includes(item.customerCode.toUpperCase()));
    // Create a new VendorModel instance to store processed data
    const processedData = new AddressMaster({});
    // Set basic properties
    const newAddressCode = nextKeyCodeByN(lastAddressCode, (i + 1));
    processedData.addressCode = newAddressCode;
    processedData._id = newAddressCode;
    processedData.companyCode = this.storage.companyCode;
    processedData.manualCode = element.manualCode;
    processedData.phone = element.phone;
    processedData.email = element.email;
    processedData.address = element.address;
    processedData.cityName = updatepincode.CT;
    processedData.stateName = element.stateName;
    processedData.pincode =  updatepincode.PIN;
    processedData.customer = updatecustomerList.map((x) => {
      return x.customerCode;
    }) || [];
    // Set timestamp and user information
    processedData['eNTDT'] = new Date();
    processedData['eNTBY'] = this.storage.userName;
    processedData['eNTLOC'] = this.storage.branch;
    // Return the processed data
    return processedData;
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
    async fetchAllCustomerData(customerChunks) {
      const chunks = chunkArray(customerChunks, 50);

      const promises = chunks.map(chunk =>
        this.objCustomerService.getCustomer({
          companyCode: this.storage.companyCode,
          customerCode: { D$in: chunk },
          activeFlag: true
        }, { _id: 0, customerCode: 1, customerName: 1 })
      );
      const result = await Promise.all(promises);
      return result.flat();  // This will merge all results into a single array
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
        const pincodes = [...new Set(jsonData.map((x) => x.pincode))];
        const customer = [...new Set(jsonData.map((x) => x.customer))];
        const customerItems = String(customer)
          .split(",")
          .map((item) => item.trim().toUpperCase());
        // Fetch data from DB
        this.pincodeList = await this.fetchAllPincodeData(pincodes);
        this.customerList = await this.fetchAllCustomerData(customerItems);
        const states = [...new Set(this.pincodeList.map((x) => x.ST))];
        this.zonelist = await this.objState.getStateWithZone({ ST: { D$in: states } });
        const validationRules = [
          {
            ItemsName: "manualCode",
            Validations: [
              { Required: true },
              { Pattern: "^[a-zA-Z0-9]{4,10}$" },
              { DuplicateFromList: true },
            ],
          },
          {
            ItemsName: "phone",
            Validations: [{ Pattern: "^[1-9][0-9]{9}$" }],
          },
          {
            ItemsName: "email",
            Validations: [
              { Pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" }, //for one email id
            ],
          },
          {
            ItemsName: "address",
            Validations: [{ Required: true }, { Pattern: "^.{1,500}$" }],
          },
          {
            ItemsName: "pincode",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.pincodeList.map((x) => {
                  return x.PIN;
                })
              }
            ]
          },
          {
            ItemsName: "customer",
            Validations: [
              { Required: true },
              {
                TakeFromArrayList: this.customerList.map((x) => {
                  return x.customerCode;
                }),
              }
            ],
          },
        ];
        try {
          const response = await firstValueFrom(
            this.xlsxUtils.validateData(jsonData, validationRules)
          );
          const existingRecords = await this.getAddressData(response);

          // Creating lookup tables
          const manualCode = new Set();
          const address = new Set();

          existingRecords.forEach(rec => {
            if (rec.manualCode) manualCode.add(rec.manualCode);
            if (rec.address && rec.address !== "") address.add(rec.address);
          });

          const filteredData = await Promise.all(
            response.map(async (element) => {
              element.error = element.error || [];

              if (manualCode.has(element.manualCode)) {
                element.error.push(
                  `manualCode : ${element.manualCode} Already exists`
                );
              }
              if (address.has(element.address)) {
                element.error.push(`address : ${element.address} Already exists`);
              }
              const cityName = this.pincodeList.find(x => x.PIN === parseInt(element.pincode));
              if (cityName) {
                element["cityName"] = cityName.CT;
                // const state = this.pincodeList.find(x => x.ST === city.ST);
                const stateName = this.zonelist.find(x => x.ST === cityName.ST);
                if (stateName) {
                  element["stateName"] = stateName.STNM;
                }
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

  //#region getAddressData
  async getAddressData(data) {
    const manualCode = [... new Set(data.map((x) => x.manualCode))];
    const address = [... new Set(data.map((x) => x.address))];

    const mncod = chunkArray(manualCode, 25);
    const addrs = chunkArray(address, 25);

    const totalChunks = max([mncod.length, addrs.length]);
    let results = [];
    for (let i = 0; i < totalChunks; i++) {
      const mc = mncod[i] || [];
      const ad = addrs[i] || [];

      if (mc.length > 0 || ad.length > 0) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: "address_detail",
          filter: {
            $or: [
              ...(mc.length > 0 ? [{ manualCode: { D$in: mc } }] : []),
              ...(ad.length > 0 ? [{ address: { D$in: ad } }] : []),
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

  //#region save
  async save(data: any[]) {
    try {
      const chunkSize = 50;
      let successfulUploads = 0;
      const lastAddressCode = await this.masterService.getLastId("address_detail", this.storage.companyCode, 'companyCode', 'addressCode', 'A')

      // Process each element in data using processData
      const processedData = data.map((element, i) => this.processData(element, lastAddressCode, i));

      // Chunk the processedData data recursively
      const chunks = chunkArray(processedData, chunkSize);
      const sendData = async (chunks: AddressMaster[][]) => {
        chunks.forEach(async chunk => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "address_detail",
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
              text: "Valid Address Data Uploaded",
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
        text: "An error occurred while saving address Data. Please try again.",
        showConfirmButton: true,
      });
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
    link.download = "AddressMasterTemplate";
    link.href = "assets/Download/AddressMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
}
