import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { catchError, firstValueFrom, forkJoin } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { locationEntitySearch } from 'src/app/Utility/locationEntitySearch';
import Swal from 'sweetalert2';
import moment from 'moment';
import { GetGeneralMasterData, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { stateFromApi } from 'src/app/operation/pending-billing/filter-billing/filter-utlity';
import { locationFromApi } from 'src/app/operation/prq-entry-page/prq-utitlity';

@Component({
  selector: 'app-set-opening-balance-vendor-wise',
  templateUrl: './set-opening-balance-vendor-wise.component.html',
})
export class SetOpeningBalanceVendorWiseComponent implements OnInit {
  breadscrums = [
    {
      title: "Upload Vendor Wise Opening Balance",
      items: ["FA Masters"],
      active: "Upload Vendor Wise Opening Balance",
    },
  ];
  fileUploadForm: UntypedFormGroup;
  BranchCode: any;
  existingData: any;
  customerList: any;
  locationDropDown: any;


  constructor(

    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private storage: StorageService,
    private masterService: MasterService,
    private dialog: MatDialog,
    private objCustomerService: CustomerService,

  ) {
    this.fileUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {
  }


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

  //#region to select file
  selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    // this.customerList = await this.fetchAllCustomerData(customerItems);

    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then(async (jsonData) => {

        this.locationDropDown = await locationFromApi(this.masterService);
        const stateDetail = await stateFromApi(this.masterService);

        const locationValue = this.locationDropDown.map((x) => x.name);
        const locationName = this.locationDropDown.map((x) => x.value);

        const mergelocations = [...locationValue, ...locationName];

        const customer = [...new Set(jsonData.map((x) => x.CustomerCode))];
        const customerItems = String(customer)
          .split(",")
          .map((item) => item.trim().toUpperCase());

        // Fetch data from DB
        this.customerList = await this.fetchAllCustomerData(customerItems);
        const validationRules = [
          {
            ItemsName: "ManualBillNo",
            Validations: [{ Required: true }, { Type: "text" }],
          },
          {
            ItemsName: "BillDate",
            Validations: [{ Required: true }, { Type: "date" }],
          },
          {
            ItemsName: "DueDate",
            Validations: [{ Required: true }, { Type: "date" }],
          },
          {
            ItemsName: "CustomerCode",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.customerList.map((x) => {
                return x.customerCode;
              }),
            }
            ]
          },
          {
            ItemsName: "AgreementNo",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "BillingBranch",
            Validations: [{ Required: true }, { TakeFromList: mergelocations }],
          },
          {
            ItemsName: "SubmissionBranch",
            Validations: [{ Required: true }, { TakeFromList: mergelocations }],
          },
          {
            ItemsName: "CollectionBranch",
            Validations: [{ Required: true }, { TakeFromList: mergelocations }],
          },
          {
            ItemsName: "Narration",
            Validations: [{ Required: true }, { Type: "text" }],
          },
          {
            ItemsName: "CreditAccount",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "Amount",
            Validations: [{ Required: true }, { Numeric: true }, { MinValue: 1 }],
          },
          {
            ItemsName: "GSTApplicable",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "GSTRate",
            Validations: [{ Required: true }, { Numeric: true }],
          },
          {
            ItemsName: "RCM",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "SACCode",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "StateofSupply",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "StateofBilling",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "CustomerGSTNo",
            Validations: [{ Required: true }, { Pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" }],
          },
          {
            ItemsName: "CompanyGSTNo",
            Validations: [{ Required: true }, { Pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" }],
          },
        ];

        const rPromise = firstValueFrom(this.xlsxUtils.validateData(jsonData, validationRules));

        rPromise.then(async response => {
          // STEP 1 : check for the duplicates

          const uniqueEntries = new Set();

          response.forEach(tableEntry => {
            const key = `${tableEntry['ManualBillNo']}`;
            // Check if the key is already in the set (duplicate entry)
            if (uniqueEntries.has(key)) {
              // Push an error message to the 'error' array
              tableEntry.error = tableEntry.error || [];
              tableEntry.error.push(`Duplicate entry`);
            } else {
              // Add the key to the set if it's not a duplicate
              uniqueEntries.add(key);
            }
          });

          // Filter out objects with errors
          const objectsWithoutErrors = response.filter(obj => obj.error == null || obj.error.length === 0);


          // STEP 2 : Get the data from the DB if Exist onlu Uniq Records
          const billNo = objectsWithoutErrors.map((item, index) => {
            // const _id = `${this.storage.companyCode}-${item.ManualBillNo}-${this.BranchCode}`;
            const _id = `${this.storage.companyCode}-${item.ManualBillNo}`;
            return _id;
          });


          const filters = [
            {
              "D$match": {
                "_id": {
                  "D$in": billNo
                }
              }
            }
          ];

          this.existingData = await this.fetchExistingData(filters);

          billNo.forEach((element, index) => {
            const data = this.existingData.find(item => item._id === element);
            if (data) {
              objectsWithoutErrors[index]['Operation'] = "Update";

            } else {
              objectsWithoutErrors[index]['Operation'] = "Insert";
            }
          });

          const objectsWithErrors = response.filter(obj => obj.error != null);
          const sortedValidatedData = [...objectsWithoutErrors, ...objectsWithErrors];
          this.OpenPreview(sortedValidatedData);
        });

      });
    }
  }

  async fetchExistingData(filters) {
    debugger
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filters
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/query", request));
    return response.data;
  }

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
        console.log("Save Data", result);

        // this.saveData(result)
      }
    });
  }



  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "CustomerWiseOpeningBalanceUploadFormate";
    link.href = "assets/Download/CustomerWiseOpeningBalance.xlsx";
    link.click();
  }

  async saveData(result) {
    try {
      const DataForUpdate = result.filter(x => x.Operation === "Update");

      if (DataForUpdate.length > 0) {
        const updateRequests = DataForUpdate.map(element => {
          const updateData = {
            // dAMT: element.DebitAmount ? element.DebitAmount : 0,
            // cAMT: element.CreditAmount ? element.CreditAmount : 0,
            //mODDT: moment().format("YYYY-MM-DD"),
            // mODBY: this.storage.userName,
            // mODLOC: this.storage.branch,
            bLOC: element.CollectionBranch,
            cUST: {

              cD: "CUST00014",
              nM: "DTDC",
              tEL: 78711411414,
              aDD: "Ahmedabad",
              eML: "DTDC@gmail.com",
              cT: "AHMEDABAD",
              sT: "Gujarat",
              gSTIN: "24ABCDE5678F2Z1",
              cGCD: "CUGR0011",
              cGNM: "LOGISTICS",
            }
          };
          console.log("updateData", updateData);

          const req = {
            companyCode: this.storage.companyCode,
            filter: { _id: `${this.storage.companyCode}-${element.ManualBillNo}` },
            collectionName: `cust_bill_headers`,
            update: updateData
          };
          console.log("req", req);

          return this.masterService.masterPut("generic/update", req).pipe(
            catchError(error => {
              console.error("Error updating account:", error);
              return []; // Return empty array to continue with forkJoin
            })
          );
        });

        forkJoin(updateRequests).subscribe(
          (responses: any[]) => {
            responses.forEach((res, index) => {
              if (res) {
                Swal.fire({
                  icon: "success",
                  title: "Successful",
                  text: `Account Opening Updated Successfully`,
                  showConfirmButton: true,
                });

                // Update isSelected property to false for the processed item
              } else {
                console.error("Failed to update account:", res);
                // Handle failed update if necessary
              }
            });
          },
          error => {
            console.error("Error updating accounts:", error);
            // Handle error if necessary
          }
        );
      }
      // const DataForInsert = result.filter(x => x.Operation === "Insert");
      // if (DataForInsert.length > 0) {
      //   const insertRequests = DataForInsert.map(element => {
      //     const insertData = {
      //       _id: `${this.storage.companyCode}-${element.AccountCode}-${this.BranchCode}`,
      //       cID: this.storage.companyCode,
      //       bRCD: this.BranchCode,
      //       aCCD: element.AccountCode,
      //       aCNM: element.AccountName,
      //       mATCD: element.MainGroupCode,
      //       mRPNM: element.MainGroupName,
      //       gRPCD: element.GroupCode,
      //       gRPNM: element.GroupName,
      //       cATCD: element.CategoryCode,
      //       cATNM: element.CategoryName,
      //       dAMT: element.DebitAmount ? element.DebitAmount : 0,
      //       cAMT: element.CreditAmount ? element.CreditAmount : 0,
      //       eNTDT: moment().format("YYYY-MM-DD"),
      //       eNTBY: this.storage.userName,
      //       eNTLOC: this.storage.branch,
      //     };

      //     console.log("insertData",insertData);

      //     // const req = {
      //     //   companyCode: this.storage.companyCode,
      //     //   collectionName: `acc_opening_${financialYear}`,
      //     //   data: insertData
      //     // };

      //     // return this.masterService.masterPost("generic/create", req).pipe(
      //     //   catchError(error => {
      //     //     console.error("Error inserting account:", error);
      //     //     return []; // Return empty array to continue with forkJoin
      //     //   })
      //     // );
      //   });

      //   forkJoin(insertRequests).subscribe(
      //     (responses: any[]) => {
      //       responses.forEach((res, index) => {
      //         if (res) {
      //           Swal.fire({
      //             icon: "success",
      //             title: "Successful",
      //             text: `Account Opening Inserted Successfully`,
      //             showConfirmButton: true,
      //           });

      //           // Update isSelected property to false for the processed item
      //         } else {
      //           console.error("Failed to insert account:", res);
      //           // Handle failed insert if necessary
      //         }
      //       });
      //     },
      //     error => {
      //       console.error("Error inserting accounts:", error);
      //       // Handle error if necessary
      //     }
      //   );
      // }

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
}