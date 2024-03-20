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
import { PayBasisdetailFromApi, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { financialYear } from 'src/app/Utility/date/date-utils';

@Component({
  selector: 'app-upload-opening-balance-ledger-wise',
  templateUrl: './upload-opening-balance-ledger-wise.component.html'
})
export class UploadOpeningBalanceLedgerWiseComponent implements OnInit {
  fileUploadForm: UntypedFormGroup;
  existingData: any;
  capacityList: any[];
  rateTypedata: any;
  arealist: any[];
  transportMode: any;
  BranchCode: any;
  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private xlsxUtils: xlsxutilityService,
    private masterService: MasterService,
    private dialogRef: MatDialogRef<UploadOpeningBalanceLedgerWiseComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any,
    private storage: StorageService,
    private route: ActivatedRoute,
  ) {
    this.fileUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  async ngOnInit() {
    this.BranchCode = this.objResult.filterRequest.bRCD;
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

        const validationRules = [
          {
            ItemsName: "AccountCode",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "AccountName",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "MainGroupCode",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "MainGroupName",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "GroupCode",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "GroupName",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "CategoryCode",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "CategoryName",
            Validations: [{ Required: true },
            ],
          },
          {
            ItemsName: "DebitAmount",
            Validations: [
            ],
          },
          {
            ItemsName: "CreditAmount",
            Validations: [
            ],
          },
        ];

        const rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));

        rPromise.then(async response => {
          // STEP 1 : check for the duplicates

          const uniqueEntries = new Set();

          response.forEach(tableEntry => {
            const key = `${tableEntry['AccountCode']}`;
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
          const AccountList = objectsWithoutErrors.map((item, index) => {
            const _id = `${this.storage.companyCode}-${item.AccountCode}-${this.BranchCode}`;
            return _id;
          });

          const filters = [
            {
              "D$match": {
                "_id": {
                  "D$in": AccountList
                }
              }
            }
          ];
          this.existingData = await this.fetchExistingData(filters);

          AccountList.forEach((element, index) => {
            const data = this.existingData.find(item => item._id === element);
            if (data) {
              objectsWithoutErrors[index]['Operation'] = "Update";
            } else {
              objectsWithoutErrors[index]['Operation'] = "Insert";
            }
          });

          // STEP 3 : Validate Credit And Debit Amount
          objectsWithoutErrors.forEach(element => {
            const debitAmountExists = element.DebitAmount !== undefined && element.DebitAmount !== null;
            const creditAmountExists = element.CreditAmount !== undefined && element.CreditAmount !== null;

            // Check if at least one of DebitAmount or CreditAmount exists and if one is 0 while the other is greater than 0
            if ((debitAmountExists || creditAmountExists) && ((element.DebitAmount === 0 && element.CreditAmount > 0) || (element.DebitAmount > 0 && element.CreditAmount === 0))) {
              // No error in this case
            } else if (!debitAmountExists && !creditAmountExists) {
              element.error = element.error || [];
              element.error.push(`At least one field should have a value`);
            } else if (debitAmountExists && creditAmountExists) {
              element.error = element.error || [];
              element.error.push(`Both Debit And Credit Amount Exist`);
            }
          });



          const objectsWithErrors = response.filter(obj => obj.error != null);
          const sortedValidatedData = [...objectsWithoutErrors, ...objectsWithErrors];
          this.OpenPreview(sortedValidatedData);
        });

      });
    }
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
    link.download = "LedgerwiseOpeningBalanceUploadFormate";
    link.href = "assets/Download/LedgerwiseOpeningBalanceUploadFormate.xlsx";
    link.click();
  }
  //#endregion
  //#region to get Existing Data from collection
  async fetchExistingData(filters) {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: `acc_opening_${financialYear}`,
      filters
    };

    const response = await firstValueFrom(this.masterService.masterPost("generic/query", request));
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
      const DataForUpdate = result.filter(x => x.Operation === "Update");

      if (DataForUpdate.length > 0) {
        const updateRequests = DataForUpdate.map(element => {
          const updateData = {
            dAMT: element.DebitAmount ? element.DebitAmount : 0,
            cAMT: element.CreditAmount ? element.CreditAmount : 0,
            mODDT: moment().format("YYYY-MM-DD"),
            mODBY: this.storage.userName,
            mODLOC: this.storage.branch,
          };

          const req = {
            companyCode: this.storage.companyCode,
            filter: { _id: `${this.storage.companyCode}-${element.AccountCode}-${this.BranchCode}` },
            collectionName: `acc_opening_${financialYear}`,
            update: updateData
          };

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
      const DataForInsert = result.filter(x => x.Operation === "Insert");
      if (DataForInsert.length > 0) {
        const insertRequests = DataForInsert.map(element => {
          const insertData = {
            _id: `${this.storage.companyCode}-${element.AccountCode}-${this.BranchCode}`,
            cID: this.storage.companyCode,
            bRCD: this.BranchCode,
            aCCD: element.AccountCode,
            aCNM: element.AccountName,
            mATCD: element.MainGroupCode,
            mRPNM: element.MainGroupName,
            gRPCD: element.GroupCode,
            gRPNM: element.GroupName,
            cATCD: element.CategoryCode,
            cATNM: element.CategoryName,
            dAMT: element.DebitAmount ? element.DebitAmount : 0,
            cAMT: element.CreditAmount ? element.CreditAmount : 0,
            eNTDT: moment().format("YYYY-MM-DD"),
            eNTBY: this.storage.userName,
            eNTLOC: this.storage.branch,
          };

          const req = {
            companyCode: this.storage.companyCode,
            collectionName: `acc_opening_${financialYear}`,
            data: insertData
          };

          return this.masterService.masterPost("generic/create", req).pipe(
            catchError(error => {
              console.error("Error inserting account:", error);
              return []; // Return empty array to continue with forkJoin
            })
          );
        });

        forkJoin(insertRequests).subscribe(
          (responses: any[]) => {
            responses.forEach((res, index) => {
              if (res) {
                Swal.fire({
                  icon: "success",
                  title: "Successful",
                  text: `Account Opening Inserted Successfully`,
                  showConfirmButton: true,
                });

                // Update isSelected property to false for the processed item
              } else {
                console.error("Failed to insert account:", res);
                // Handle failed insert if necessary
              }
            });
          },
          error => {
            console.error("Error inserting accounts:", error);
            // Handle error if necessary
          }
        );
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

}