import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { VendorBillGenerationControl } from 'src/assets/FormControls/Finance/VendorPayment/VendorBillGenerationControl';
import { VendorBillService } from '../../vendor-bill.service';
import { BeneficiaryDetailComponent } from '../../beneficiary-detail/beneficiary-detail.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';

@Component({
  selector: 'app-general-bill-criteria',
  templateUrl: './general-bill-criteria.component.html',
})
export class GeneralBillCriteriaComponent implements OnInit {
  breadScrums = [
    {
      title: "Vendor General Bill Generation",
      items: ["Home"],
      active: "Vendor General Bill Generation",
    },
  ];
  backPath: string;
  jsonvendorBillGenerationArray: any;
  vendorBillGenerationForm: UntypedFormGroup;
  vendorBillGenerationControl: VendorBillGenerationControl;
  vendorList: any;
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private storageService: StorageService,
    private objVendorBillService: VendorBillService,
    private masterService: MasterService,
    private dialog: MatDialog,
    private vendorService: VendorService,
    private encryptionService: EncryptionService,
    private route: Router) {
    this.backPath = "/Finance/VendorPayment/Dashboard"
  }

  ngOnInit(): void {
    this.initializevendorBillGeneration();
  }
  initializevendorBillGeneration() {

    this.vendorBillGenerationControl = new VendorBillGenerationControl();

    this.jsonvendorBillGenerationArray =
      this.vendorBillGenerationControl.getvendorBillGenerationArrayControl();
    this.vendorBillGenerationForm = formGroupBuilder(this.fb, [
      this.jsonvendorBillGenerationArray,
    ]);

    this.SetDropdownData();

    //    this.vendorBillGenerationForm.controls["VendorPANNumber"].setValue("ddf")
  }
  SetDropdownData() {
    this.filter.Filter(
      this.jsonvendorBillGenerationArray,
      this.vendorBillGenerationForm,
      TransactionType,
      "TransactionType",
      false
    );
    //get Vendors List
    const filter = {
      isActive: true,
      companyCode: this.storageService.companyCode,
    };

    this.vendorService.getVendorDetail(filter).then((data) => {
      this.vendorList = data.map((item) => {
        return {
          name: item.vendorName, value: item.vendorCode, panNo: item.panNo
        };
      });
      this.filter.Filter(
        this.jsonvendorBillGenerationArray,
        this.vendorBillGenerationForm,
        this.vendorList,
        "VendorName",
        true
      );
    });
  }
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
  getVendorDetails(event) {
    const panNo = event.eventArgs.option.value?.panNo || "";
    this.vendorBillGenerationForm.controls["VendorPANNumber"].setValue(panNo);
  }
  async getBeneficiaryData() {
    try {
      const vnCode = this.vendorBillGenerationForm.controls["VendorName"].value;

      // Fetch beneficiary details from API
      const beneficiaryModalData = await this.objVendorBillService.getBeneficiaryDetailsFromApi(vnCode.value);

      // Check if beneficiary data is available
      if (beneficiaryModalData.length > 0) {
        // Prepare request object for the dialog
        const request = {
          Details: beneficiaryModalData,
        };

        // Open the BeneficiaryDetailComponent dialog
        const dialogRef = this.dialog.open(BeneficiaryDetailComponent, {
          data: request,
          width: "100%",
          disableClose: true,
          position: {
            top: "20px",
          },
        });

        // Subscribe to dialog's afterClosed event to set tableLoad flag back to true
        dialogRef.afterClosed().subscribe(() => {
        });
      } else {
        // Display a warning if no beneficiary data is available
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please Add Beneficiary Details To View",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error('An error occurred:', error);
    }
  }
  save() {
    const EncriptedData = this.encryptionService.encrypt(JSON.stringify(this.vendorBillGenerationForm.value));
    this.route.navigate(['/Finance/VendorBillGeneration/Details'], {
      queryParams: { data: EncriptedData },
    });
  }
}

const TransactionType = [
  { name: "General Service Payment", value: "G" },
  { name: "Business Associates", value: "B" },
  { name: "Fixed & Varriable", value: "F" },
];
