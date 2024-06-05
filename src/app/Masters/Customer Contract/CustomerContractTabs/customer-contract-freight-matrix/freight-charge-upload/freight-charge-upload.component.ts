import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GetGeneralMasterData, checkForDuplicatesInFreightUpload, productdetailFromApi } from '../../../CustomerContractAPIUtitlity';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { locationEntitySearch } from 'src/app/Utility/locationEntitySearch';
import Swal from 'sweetalert2';
import moment from 'moment';

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
    private objlocationEntitySearch: locationEntitySearch
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
      companyCode: this.storage.companyCode,
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
        const RateData = await GetGeneralMasterData(this.masterService, "RTTYP");
        this.rateTypedata = this.ServiceSelectiondata.rateTypecontrolHandler.map(
          (x, index) => {
            return RateData.find((t) => t.value == x);
          }
        );
        const containerData = await this.objContainerService.getContainerList();
        const vehicleData = await GetGeneralMasterData(
          this.masterService,
          "VEHSIZE"
        );
        const containerDataWithPrefix = vehicleData.map((item) => ({
          name: `Veh- ${item.name}`,
          value: item.value,
        }));
        this.capacityList = [...containerDataWithPrefix, ...containerData];
        const stateReqBody = {
          companyCode: this.storage.companyCode,
          filter: {},
          collectionName: "state_master",
        };
        const pincodeReqBody = {
          companyCode: this.storage.companyCode,
          filter: {},
          collectionName: "pincode_master",
        };
        const zonelist = await firstValueFrom(
          this.masterService.masterPost("generic/get", stateReqBody)
        );
        const pincodeList = await firstValueFrom(
          this.masterService.masterPost("generic/get", pincodeReqBody)
        );

        this.transportMode = await productdetailFromApi(this.masterService);
        this.arealist = await this.objlocationEntitySearch.GetMergedData(
          pincodeList,
          zonelist,
          "ST",
          this.masterService,
          true,
          true
        );

        const validationRules = [
          {
            ItemsName: "From",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "To",
            Validations: [{ Required: true },
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
            Validations: [
              {
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
              { Required: true },
              { Numeric: true },
              { MinValue: 1 },
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
          {
            ItemsName: "ValidFromDate",
            Validations: [
              { Required: true },
              { range: 1 },
            ],
          },
          {
            ItemsName: "ValidToDate",
            Validations: [
              { Required: true },
              { range: 1 },
            ],
          },
        ];

        const rPromise = firstValueFrom(this.xlsxUtils.validateData(jsonData, validationRules));

        rPromise.then(async response => {

          const validateAndFilter = (element, property) => {
            element.error = element.error || [];

            const propertiesToCheck = ['PIN', 'CT', 'STNM', 'ZN', 'AR', 'LOC'];
            const foundMatch = this.arealist.find(x =>
              propertiesToCheck.some(prop =>
                typeof x[prop] === 'string' &&
                x[prop].toLowerCase() === element[property].toLowerCase()
              )
            );

            if (!foundMatch) {
              element.error.push(`${property} is not in the allowed list.`);
            } else {

              // Find the matched property
              const matchedProperty = propertiesToCheck.find(prop =>
                typeof foundMatch[prop] === 'string' &&
                foundMatch[prop].toLowerCase() === element[property].toLowerCase()
              );

              // Set element[property] and element[property + 'TYPE']
              element[property] = foundMatch[matchedProperty];
              element[property + 'TYPE'] = matchedProperty;
            }
          };

          const filteredData = response.map(element => {
            validateAndFilter(element, 'From');
            validateAndFilter(element, 'To');
            if (element.error.length < 1) {
              element.error = null;
            }
            return element;
          });

          const fromKey = "From";
          const toKey = "To";
          const capacityKey = 'Capacity';
          const tblfromKey = "fROM";
          const tbltoKey = "tO";
          const tblcapacityKey = 'cAP';

          // Call the function with the specified keys
          const data = await checkForDuplicatesInFreightUpload(filteredData, this.existingData, fromKey, toKey, capacityKey, tblfromKey, tbltoKey, tblcapacityKey);

          if (data) {
            this.ReValidateData(data, this.existingData);
          }
        });

      });
    }
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()
  }
  ReValidateData(data, existingData) {
    const contractStartDateString = moment(this.CurrentContractDetails.cSTARTDT, 'DD MMM YY').format('DD/MM/YYYY');
    const contractStartDate = moment(contractStartDateString, 'DD/MM/YYYY');
    const contractEndDateString = moment(this.CurrentContractDetails.cENDDT, 'DD MMM YY').format('DD/MM/YYYY');
    const contractEndDate = moment(contractEndDateString, 'DD/MM/YYYY');

    let validData = data.filter(x => {
      const validFromDate = moment(x.ValidFromDate, 'DD/MM/YYYY');
      const validToDate = moment(x.ValidToDate, 'DD/MM/YYYY');
      return validFromDate.isSameOrAfter(contractStartDate) && validToDate.isSameOrBefore(contractEndDate);
    });

    const invalidData = data.filter(x => {
      const validFromDate = moment(x.ValidFromDate, 'DD/MM/YYYY');
      const validToDate = moment(x.ValidToDate, 'DD/MM/YYYY');
      return validFromDate.isBefore(contractStartDate) || validToDate.isAfter(contractEndDate);
    });

    existingData = existingData || [];

    // Assuming existingData is an array of objects
    const OldData = existingData.map(element => {
      // Transform each element and return the transformed object
      return {
        ...element,
        RecordType: "existing",
        ValidFromDate: moment(element.vFDT).format('DD MMM YY'),
        ValidToDate: moment(element.vEDT).format('DD MMM YY'),
        From: element.fROM,
        To: element.tO,
        Capacity: element.cAP,
        error: []
      };
    });
    validData = validData.map(element => {
      element.RecordType = "new"
      return element;
    });
    validData = OldData.concat(validData);

    const previousEntries = [];
    for (const entry of validData) {
      if (this.isOverlapping(previousEntries, entry)) {
        entry.error.push("Overlapping with existing data");
      } else {
        previousEntries.push(entry);
      }
    }
    //console.log(data);
    const FilteredData = validData.filter(x => x.RecordType === "new");

    invalidData.forEach(element => {
      element.error = ["Invalid Date Range"];
    });
    FilteredData.push(...invalidData);
    this.OpenPreview(FilteredData);
  }
  isOverlapping(previousEntries, newEntry) {
    const startDate2 = this.parseDate(newEntry.ValidFromDate);
    const endDate2 = this.parseDate(newEntry.ValidToDate);

    for (const entry of previousEntries) {
      const startDate1 = this.parseDate(entry.ValidFromDate);
      const endDate1 = this.parseDate(entry.ValidToDate);

      // Check if the date ranges overlap and the locations are the same
      if (
        entry.From === newEntry.From &&
        entry.To === newEntry.To &&
        entry.Capacity === newEntry.Capacity &&
        startDate1 <= endDate2 &&
        endDate1 >= startDate2
      ) {
        return true; // Overlapping found
      }
    }
    return false; // No overlapping found
  }
  parseDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-based in Date objects
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
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
      filter: { cONID: this.CurrentContractDetails.cONID },
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
        this.saveData(result)
      }
    });
  }
  //#endregion
  //#region to save data
  async saveData(result) {
    try {

      const freightChargeData = [];

      // Generate a new ID based on existing data
      const newId = this.generateNewId(this.existingData);

      // Process preview data to create vendor contract data
      result.forEach(element => {
        const processedData = this.processData(element, this.rateTypedata, this.capacityList, this.transportMode)
        freightChargeData.push(processedData);
      });

      // Format the final data with additional information
      const formattedData = this.formatFreightData(freightChargeData, newId);

      if (formattedData.length === 0) {
        // Display success message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No Valid Data to Upload",
          showConfirmButton: true,
        });
        return;
      }

      const createRequest = {
        companyCode: this.storage.companyCode,
        collectionName: "cust_contract_freight_charge_matrix",
        data: formattedData,
      };

      const response = await firstValueFrom(this.masterService.masterPost("generic/create", createRequest));
      if (response) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Valid Data Uploaded",
          showConfirmButton: true,
        });
      }

    } catch (error) {
      // Handle any errors that occurred during the process
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        showConfirmButton: true,
      });
      return;
    }
  }

  // function to generate new _id
  generateNewId(existingData) {
    let newId;

    if (existingData) {
      // Extract the last vendor code from the existing contract
      const sortedData = existingData.sort((a, b) => a._id.localeCompare(b._id));
      const lastId = sortedData.length > 0 ? parseInt(sortedData[sortedData.length - 1]._id.split('-')[2], 10) : 0;

      // Check if the extraction was successful
      if (!isNaN(lastId)) {
        // Increment the last vendor code
        newId = lastId + 1;
      } else {
        // If extraction was not successful, set newId to 0
        newId = 0;
      }
    } else {
      newId = 0;
    }

    return newId;
  }

  // function to process data and prepare request body
  processData(element, rateTypedata, capacityList, transportMode) {
    const processedData: any = {};

    const updaterateType = rateTypedata.find(item => item.name.toUpperCase() === element.RateType.toUpperCase());
    const updatetransportMode = transportMode.find(item => item.name.toUpperCase() === element.TransportMode.toUpperCase());

    // Set basic properties
    processedData.cONID = this.CurrentContractDetails.cONID;
    processedData.cID = this.storage.companyCode;
    processedData.fROM = element.From
    processedData.fTYPE = element.FromTYPE
    processedData.tO = element.To
    processedData.tTYPE = element.ToTYPE

    // Add processed rate type information if available
    if (updaterateType) {
      processedData.rTYP = updaterateType.name;
    }

    // Add processed rate type information if available
    if (element.Capacity) {
      const updatecAP = capacityList.find(item => item.name.toUpperCase() === element.Capacity.toUpperCase());
      processedData.cAP = updatecAP.name;
    }
    // Add processed rate type information if available
    if (updatetransportMode) {
      processedData.tMODNM = updatetransportMode.name;
      processedData.tMODID = updatetransportMode.value;
    }
    processedData.tRDYS = element.TransitDays
    processedData.rT = parseFloat(element.Rate);
    processedData.lTYPE = this.ServiceSelectiondata.loadType;

    // SET Start Date And End Date
    processedData.vFDT = moment(element.ValidFromDate, 'DD MMM YY').toDate();
    processedData.vEDT = moment(element.ValidToDate, 'DD MMM YY').toDate();

    // Set timestamp and user information
    processedData.eNTDT = new Date();
    processedData.eNTBY = this.storage.userName;
    processedData.eNTLOC = this.storage.branch;

    // Return the processed data
    return processedData;

  }

  // Function to format contract data
  formatFreightData(processedData, newId) {

    return processedData.map((item, index) => {
      const formattedItem = {
        _id: `${this.storage.companyCode}-${this.CurrentContractDetails.cONID}-${newId + index}`,
        fCID: newId + index,
        ...item,
      };

      return formattedItem;
    });
  }
  //#endregion
}