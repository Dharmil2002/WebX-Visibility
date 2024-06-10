import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { max } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { nextKeyCodeByN } from 'src/app/Utility/commonFunction/stringFunctions';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { UploadFieldType } from 'src/app/config/myconstants';
import { customerModel } from 'src/app/core/models/Masters/customerMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-master-upload',
  templateUrl: './customer-master-upload.component.html'
})
export class CustomerMasterUploadComponent implements OnInit {
  customerUploadForm: UntypedFormGroup;
  customerGrpList: any;
  CustomerCategoryList = [
    {
      name: "Primary",
      value: "Primary",
    },
    {
      name: "Secondary",
      value: "Secondary",
    },
  ];
  validationRules: any[] = [
    {
      ItemsName: "CustomerName",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^.{3,200}$" },
        { DuplicateFromList: true }
      ],
    },
    {
      ItemsName: "CustomerCategory",
      Validations: [
        { Required: true },
        {
          TakeFromList: this.CustomerCategoryList.map((x) => {
            return x.name;
          }),
        }
      ],
    },
    {
      ItemsName: "CustomerLocation",
      Type: UploadFieldType.Upload,
      Validations: [
        {
          ExistsInLocationMaster: true,
          IsComaSeparated: true
        }
      ],
    },
    {
      ItemsName: "CustomerEmailID",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" } //for one email id
      ],
    },
    {
      ItemsName: "CustomerMobileNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[1-9][0-9]{9}$" }
      ],
    },
    {
      ItemsName: "ERPCode",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9]{4,100}$" },
      ],
    },

    {
      ItemsName: "PANNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$" }
      ],
    },
    {
      ItemsName: "CINNo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9]{4,100}$" }
      ],
    },
    {
      ItemsName: "RegisteredAddress",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        { Pattern: "^.{4,500}$" }
      ]
    },
    {
      ItemsName: "PinCode",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
        {
          ExistsInPincodeMaster: true,
          IsComaSeparated: false,
        }
      ],
    },
    {
      ItemsName: "City",
      Type: UploadFieldType.Derived,
      BasedOn: "PinCode",
      From: "Pincode",
      Field: "CT",
      Validations: [],
    },
    {
      ItemsName: "StateId",
      Type: UploadFieldType.Derived,
      BasedOn: "PinCode",
      From: "Pincode",
      Field: "ST",
      Validations: [],
    },
    {
      ItemsName: "State",
      Type: UploadFieldType.Derived,
      BasedOn: "StateId",
      From: "State",
      Field: "STNM",
      Validations: [],
    },
    {
      ItemsName: "CountryId",
      Type: UploadFieldType.Derived,
      BasedOn: "StateId",
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
    {
      ItemsName: "MSMENo",
      Type: UploadFieldType.Upload,
      Validations: [
        { Pattern: "^[a-zA-Z0-9]{4,100}$" },
      ],
    },
    {
      ItemsName: "BlackListed",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
      ],
    },
    {
      ItemsName: "Active",
      Type: UploadFieldType.Upload,
      Validations: [
        { Required: true },
      ],
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private dialog: MatDialog,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<CustomerMasterUploadComponent>,
    private storage: StorageService,
    private customerService: CustomerService,
  ) {
    this.customerUploadForm = fb.group({
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
  async selectedFile(event) {
    try {
      const fileList: FileList = event.target.files;
      if (fileList.length !== 1) {
        throw new Error("Cannot use multiple files");
      }
      const file = fileList[0];
      if (!file) return;

      const jsonData = await this.xlsxUtils.readFile(file);
      const customerGroups = [...new Set(jsonData.map((x) => x.CustomerGroup))];

      // Fetch data from various services
      this.customerGrpList = await this.getCustomerGroupList(customerGroups);

      this.validationRules = [
        ...this.validationRules,
        {
          ItemsName: "CustomerGroup",
          Type: UploadFieldType.Upload,
          Validations: [
            { Required: true },
            {
              TakeFromList: this.customerGrpList.map((x) => x.name),
            },
          ],
        }
      ];

      const response = await this.xlsxUtils.validateAllData(jsonData, this.validationRules);
      const existingRecords = await this.getCustomerData(response);

      const customerNames = new Set();
      const ERPCodes = new Set();
      const cinNos = new Set();

      existingRecords.forEach(rec => {
        if (rec.customerName) customerNames.add(rec.customerName.toLowerCase());
        if (rec.ERPcode) ERPCodes.add(rec.ERPcode);
        if (rec.CINnumber) cinNos.add(rec.CINnumber);
      });

      const filteredData = await Promise.all(response.map(async (element) => {
        element.error = element.error || [];

        if (element.CustomerName && customerNames.has(element.CustomerName.toLowerCase())) {
          element.error.push(`CustomerName : ${element.CustomerName} Already exists`);
        }
        if (element.ERPCode && ERPCodes.has(element.ERPCode)) {
          element.error.push(`ERPCode : ${element.ERPCode} Already exists`);
        }
        if (element.CINNo && cinNos.has(element.CINNo)) {
          element.error.push(`CINNo : ${element.CINNo} Already exists`);
        }
        if (element.error.length === 0) {
          element.error = null; // set the error property to null if there are no errors
        }
        return element;
      }));

      this.OpenPreview(filteredData);
    } catch (error) {
      // Handle errors from the API call or other issues
      console.error("Error:", error);
    }
  }
  //#endregion
  //#region to get Existing Data from collection
  async getCustomerData(data) {
    const customerName = [... new Set(data.map((x) => x.CustomerName))];
    const ERPCode = [... new Set(data.map((x) => x.ERPCode))];
    const cinNumber = [... new Set(data.map((x) => x.CINNo))];

    const cusNms = chunkArray(customerName, 25);
    const ERP = chunkArray(ERPCode, 25);
    const cins = chunkArray(cinNumber, 25);

    const totalChunks = max([cusNms.length, ERP.length, cins.length]);
    let results = [];
    for (let i = 0; i < totalChunks; i++) {
      const cn = cusNms[i] || [];
      const ec = ERP[i] || [];
      const cc = cins[i] || [];

      if (cn.length > 0 || ec.length > 0 || cc.length > 0) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: "customer_detail",
          filter: {
            $or: [
              ...(cn.length > 0 ? [{ customerName: { D$in: cn } }] : []),
              ...(ec.length > 0 ? [{ ERPCode: { D$in: ec } }] : []),
              ...(cc.length > 0 ? [{ CINnumber: { D$in: cc } }] : [])
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

    const metaData = {
      data: results,
      hideColumns: this.validationRules.filter(x => x.Type === UploadFieldType.Derived).filter(x => x.ItemsName.includes("Id")),
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
        // console.log(result);
        this.save(result)
      }
    });
  }
  //#endregion
  //#region to get customer Group list
  async getCustomerGroupList(csGrpChunks) {
    if (!csGrpChunks || csGrpChunks.length === 0) return [];

    // Efficiently chunking the array
    const chunks = chunkArray(csGrpChunks, 50)

    try {
      const promises = chunks.map(chunk => {
        const conditions = chunk.map(groupName => ({
          groupName: {
            "$regex": `^${groupName}$`,
            "$options": "i"
          }
        }));

        return this.customerService.getCustomerGroupData({
          "$or": conditions
        });
      });

      const results = await Promise.all(promises);
      return results.flat();  // Merge all results into a single array
    } catch (error) {
      console.error('Error fetching customer group data:', error);
      throw error;  // Re-throw the error after logging it
    }
  }
  //#endregion
  //#region to process and save data
  async save(data: any[]) {

    try {
      const chunkSize = 50;
      let successfulUploads = 0;
      const lastcustomerCode = await this.masterService.getLastId("customer_detail", this.storage.companyCode, 'companyCode', 'customerCode', 'CUST')

      // Process each element in data using processData
      const processedData = data.map((element, i) => this.processData(element, lastcustomerCode, i));

      // Chunk the processedData data recursively
      const chunks = chunkArray(processedData, chunkSize);
      // console.log(chunks);

      const sendData = async (chunks: customerModel[][]) => {
        //console.log(chunks);

        chunks.forEach(async chunk => {
          const request = {
            companyCode: this.storage.companyCode,
            collectionName: "customer_detail",
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
              text: "Valid Customer Data Uploaded",
              showConfirmButton: true,
            });
          }
        });
      };

      await sendData(chunks);

    }
    catch (error) {
      console.error("Error during saving customer data", error);

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving customer Data. Please try again.",
        showConfirmButton: true,
      });
    }
  }

  // Function to process a single element
  processData(element, lastcustomerCode, i) {
    const updateCustomerGrpList = this.customerGrpList.find(item => item.name.toLowerCase() === element.CustomerGroup.toLowerCase());
    const updateCustomerCategory = this.CustomerCategoryList.find(item => item.name.toLowerCase() === element.CustomerCategory.toLowerCase());

    let customerLocations: string[];

    // Check if element.CustomerLocation contains a comma
    if (element.CustomerLocation.includes(',')) {
      // If it contains a comma, split into an array of locations
      customerLocations = element.CustomerLocation.split(',').map(location => location.trim().toUpperCase());
    } else {
      // If it doesn't contain a comma, treat it as a single location
      customerLocations = [element.CustomerLocation.trim()];
    }

    // Create a new customerModel instance to store processed data
    const processedData = new customerModel({});

    // Set basic properties
    const newCustomerCode = nextKeyCodeByN(lastcustomerCode, (i + 1));
    processedData.companyCode = this.storage.companyCode;
    processedData.customerCode = newCustomerCode;
    processedData._id = `${this.storage.companyCode}-${newCustomerCode}`;
    processedData.customerGroup = updateCustomerGrpList.name || '';
    processedData.customerName = element.CustomerName.toUpperCase();
    processedData.CustomerCategory = updateCustomerCategory.name || '';
    processedData.customerLocations = customerLocations || [];
    processedData.Customer_Emails = element.CustomerEmailID;
    processedData.customer_mobile = parseInt(element.CustomerMobileNo);
    processedData.RegisteredAddress = element.RegisteredAddress;
    processedData.PinCode = parseInt(element.PinCode);
    processedData.city = element.City;
    processedData.state = element.State;
    processedData.Country = element.Country;
    processedData.BlackListed = element.BlackListed === 'Y'; // Convert 'Y' to true, else false;
    processedData.activeFlag = element.Active === 'Y';
    processedData.ERPcode = element.ERPCode;
    processedData.TANNumber = element.TANNo;
    processedData.PANnumber = element.PANNo;
    processedData.CINnumber = element.CINNo;
    processedData.MSMENumber = element.MSMENo;
    processedData.updatedBy = this.storage.userName;

    // Return the processed data
    return processedData;
  }
  //#endregion
  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "CustomerMasterTemplate";
    link.href = "assets/Download/CustomerMasterTemplate.xlsx";
    link.click();
  }
  //#endregion
  //#region to call close function
  Close() {
    this.dialogRef.close()
  }
  //#endregion
}