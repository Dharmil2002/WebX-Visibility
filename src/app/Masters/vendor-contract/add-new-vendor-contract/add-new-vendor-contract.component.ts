import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { AddContractProfile } from 'src/assets/FormControls/VendorContractControls/add-contract-profile';
import { productdetailFromApi } from '../../Customer Contract/CustomerContractAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { GetContractBasedOnVendorAndProduct, getContractList } from '../vendorContractApiUtility';
import { financialYear } from 'src/app/Utility/date/date-utils';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-add-new-vendor-contract',
  templateUrl: './add-new-vendor-contract.component.html'
})
export class AddNewVendorContractComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  VendorBasicInformationControls: AddContractProfile;
  jsonControlArray: any;
  vendorContractForm: UntypedFormGroup;
  vendorName: any;
  vendorStatus: any;
  breadscrums: { title: string; items: string[]; active: string }[];
  backPath: string;
  displayedColumns = [
    { Key: "vNNM", title: "Vendor", width: "180", className: "matcolumnfirst", show: true },
    { Key: "cNID", title: "Contract Id", width: "180", className: "matcolumncenter", show: true },
    { Key: "pDTNM", title: "Product", width: "70", className: "matcolumncenter", show: true },
    { Key: "cNSDT", title: "Start Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "eNDDT", title: "End Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "expiringin", title: "Expiring In", width: "150", className: "matcolumncenter", show: true },
  ];
  columnKeys = this.displayedColumns.map((column) => column.Key);
  tableData: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) Tablefilter: ElementRef;
  isTblLoading = false;
  public ModeldataSource = new MatTableDataSource<any>();
  constructor(private fb: UntypedFormBuilder,
    private route: Router,
    private objVendorService: VendorService,
    private filter: FilterUtils,
    private masterService: MasterService,
  ) {
    super();
    this.breadscrums = [
      {
        title: 'Add New Vendor Contract',
        items: ['Home'],
        active: 'AddNewVendorContract',
        // generatecontrol: true,
        // toggle: false
      },
    ];
    this.columnKeys.push('status')
    // this.columnKeys.push('actions')
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.getVendorList();
    this.backPath = "/Masters/VendorContract/VendorContractList";
  }
  //#region to initialize form control
  initializeFormControl() {
    // Create the 'VendorBasicInformationControls' using 'AddContractProfile' with 'data'
    const vendorBasicInformationControls = new AddContractProfile('');

    // Get the array of form controls from 'VendorBasicInformationControls'
    this.jsonControlArray = vendorBasicInformationControls.getAddnewVendorContractControls();

    // Create the 'ProductsForm' using 'formGroupBuilder' with 'jsonControlArray'
    this.vendorContractForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    // Find the 'vendor' control in the form control array and set related properties
    const vendorControl = this.jsonControlArray.find(control => control.name === 'VNID');

    // Store the name of the 'vendor' control
    this.vendorName = vendorControl.name;

    // Store the showNameAndValue property
    this.vendorStatus = vendorControl.additionalData.showNameAndValue;
  }
  //#endregion 
  //#region functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  //#region of cancel function
  cancel() {
    this.route.navigateByUrl('/Masters/VendorContract/VendorContractList');
  }
  //#endregion
  //#region to save new Vendor contract
  async save() {
    const IsValidContract = await this.checkIsValidContract();
    if (IsValidContract) {
      try {
        // Clear validators and validate the form
        clearValidatorsAndValidate(this.vendorContractForm);

        let existingVendorContracts = await getContractList(this.masterService);
        existingVendorContracts = existingVendorContracts.sort((a, b) => a.cNID.localeCompare(b.cNID))
        if (existingVendorContracts) {

          // Generate a new vendor code
          const lastContract = existingVendorContracts[existingVendorContracts.length - 1];
          const lastVendorCode = lastContract ? parseInt(lastContract.cNID.substring(6), 10) : 0;

          // Use template literals for better readability
          const newVendorCode = `VT${financialYear}${(lastVendorCode + 1).toString().padStart(5, '0')}`;

          const data = {
            "_id": this.companyCode + "-" + newVendorCode,
            "cNID": newVendorCode,
            'cID': this.companyCode,
            "vNID": this.vendorContractForm.value.VNID.value,
            "vNNM": this.vendorContractForm.value.VNID.name,
            "pDTID": this.vendorContractForm.value.PDTID.value,
            "pDTNM": this.vendorContractForm.value.PDTID.name,
            "cNSDT": this.vendorContractForm.value.CNSDT,
            "eNDDT": this.vendorContractForm.value.ENDDT,
            "eNTLOC": localStorage.getItem("Branch"),
            "eNTDT": new Date(),
            "eNTBY": this.vendorContractForm.value.ENBY
          }
          // Prepare request for creating a new vendor contract
          const createVendorContractRequest = {
            companyCode: this.companyCode,
            collectionName: "vendor_contract",
            data: data,
          };

          // Create a new vendor contract
          const createResponse = await this.masterService.masterPost("generic/create", createVendorContractRequest).toPromise();
          const existingContracts = await getContractList(this.masterService);

          if (createResponse) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Contract Created Successfully",
              text: "Contract Id: " + existingContracts[0].cNID,
              showConfirmButton: true,
            });

            // Navigate to the vendor contract list page
            this.route.navigateByUrl('/Masters/VendorContract/VendorContractList');
          }
        }
      } catch (error) {
        // Handle errors appropriately (e.g., log, display error message)
        console.error("An error occurred:", error);
      }
    }
    else {
      Swal.fire({
        title: 'Already Contract Exists Between This Date Ranges',
        toast: false,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
      // Reset the values of 'cNSDT' and 'cNSDT' in the vendorContractForm to an empty string
      this.vendorContractForm.patchValue({
        ENDDT: '',
        CNSDT: ''
      });
    }
  }
  //#endregion
  //#region to get vendor List
  async getVendorList() {
    // Fetch the vendor list using the 'objVendorService' service
    const vendorList = await this.objVendorService.getVendorDetail('');

    // Filter the vendor list based on the 'isActive' property
    const vendor = vendorList
      .filter((item) => item.isActive && parseInt(item.vendorType, 10) !== 4)
      //item.vendorType) === 4 for Market vendor type
      .map(e => ({
        name: e.vendorName, // Map the name to the specified nameKey
        value: e.vendorCode // Map the value to the specified valueKey
      }));

    // Call the 'Filter' function with the filtered 'vendor' array and other parameters
    this.filter.Filter(this.jsonControlArray, this.vendorContractForm, vendor, this.vendorName, this.vendorStatus);
    const productdetail = await productdetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlArray,
      this.vendorContractForm,
      productdetail,
      "PDTID",
      false
    );
  }
  //#endregion
  //#region to validate contract dates
  onContractStartDateChanged(event) {
    const startDate = this.vendorContractForm.get('CNSDT')?.value;
    const endDate = this.vendorContractForm.get('ENDDT')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        title: 'Contract End date must be greater than or equal to start date.',
        toast: false,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
      this.vendorContractForm.controls.ENDDT.setValue('');
      this.vendorContractForm.controls.CNSDT.setValue('');
    }
  }
  //#endregion
  //#region to get vendor contract data based on vendor and product selection
  async getTableData(event) {
    const vendorId = this.vendorContractForm.value?.VNID?.value;
    const productId = this.vendorContractForm.value?.PDTID?.value;

    if (vendorId) {
      this.tableData = await GetContractBasedOnVendorAndProduct(this.masterService, vendorId, productId);

      this.tableData.forEach((item: any) => {
        const startDate: Date = new Date(item.cNSDT);
        const endDate: Date = new Date(item.eNDDT);

        item.cNSDT = moment(startDate).format('DD-MM-YYYY');
        item.eNDDT = moment(endDate).format('DD-MM-YYYY');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeDiff: number = endDate.getTime() - startDate.getTime();
        const daysDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (endDate.toDateString() === today.toDateString()) {
          item.expiringin = `Expiring Today`;
        }
        else if (endDate < today) {
          const ExpiredDiff: number = today.getTime() - endDate.getTime();
          const ExpireddaysDiff: number = Math.floor(ExpiredDiff / (1000 * 60 * 60 * 24));
          item.status = "Expired";
          item.expiringin = `Expired ${ExpireddaysDiff} Days Ago`;
        }
        else {
          item.expiringin = `${daysDiff} Days Left`;
        }
      });

      this.ModeldataSource = new MatTableDataSource(
        this.tableData
      );
      this.ModeldataSource.paginator = this.paginator;
      this.ModeldataSource.sort = this.sort;

      this.subs.sink = fromEvent(
        this.Tablefilter.nativeElement,
        "keyup"
      ).subscribe(() => {
        if (!this.ModeldataSource) {
          return;
        }
        this.ModeldataSource.filter = this.Tablefilter.nativeElement.value;
      });

    }
  }
  //#endregion
  //#region to checks whether the provided contract dates overlap with any existing contracts.
  async checkIsValidContract() {
    // Extract vendorId and productId from the form controls
    const vendorId = this.vendorContractForm.value?.VNID?.value;
    const productId = this.vendorContractForm.value?.PDTID?.value;

    // Fetch existing contracts based on vendorId and productId
    const existingContracts = await GetContractBasedOnVendorAndProduct(this.masterService, vendorId, productId);

    // Extract start and end dates from the form controls and strip the time component
    const startDate = stripTimeFromDate(new Date(this.vendorContractForm.value?.CNSDT));
    const endDate = stripTimeFromDate(new Date(this.vendorContractForm.value?.ENDDT));

    // Check for date overlaps with existing contracts using Array.some
    const isOverlap = existingContracts.some(item => {
      const jsonStartDate = stripTimeFromDate(new Date(item.cNSDT));
      const jsonEndDate = stripTimeFromDate(new Date(item.eNDDT));

      return (
        (startDate <= jsonEndDate && endDate >= jsonStartDate) ||
        (endDate >= jsonStartDate && startDate <= jsonEndDate)
      );
    });

    // If there is an overlap, the contract is invalid
    return !isOverlap;
  }
  //#endregion
}
// This utility function removes the time component from a given date
function stripTimeFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}