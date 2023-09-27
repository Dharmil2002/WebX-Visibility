import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { AddContractProfileModel, VendorContract } from 'src/app/core/models/Masters/Vendor Contract/VendorContract';
// import { LocationMasterServiceService } from 'src/app/core/service/Masters/Location Master/location-master-service.service';
// import { VendorContractService } from 'src/app/core/service/Masters/Vendor Contract/vendor-contract.service';
// import { SnackBarUtilityService } from 'src/app/core/service/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { AddContractProfile } from 'src/assets/FormControls/VendorContractControls/AddContractProfile';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // set the locale
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class BasicInformationComponent {
  @Input() data: any;
  BasicInformationArray: AddContractProfile;
  VendorDetails: VendorContract;
  BasicInformationForm: UntypedFormGroup;
  AddProfileClass: AddContractProfileModel;
  selectedFile: File = null;
  breadscrums = [
    {
      title: "Basic Information",
      items: ["Vendor Contract"],
      active: "Basic Information",
    },
  ];

  error = "";
  IsUpdate = true;
  LocationListAuto: AutoComplateCommon[];
  addForm: any;
  Location: any;
  location: any;
  locationStatus: any;
  constructor(private router: Router, private fb: UntypedFormBuilder, public ObjSnackBarUtility: SnackBarUtilityService, private filter: FilterUtils) {
  }
  ngOnInit() {
      this.createBasicInformationForm();
      //this.BindContractSigningLocation();

  }
  createBasicInformationForm() {
    debugger
    this.AddProfileClass = new AddContractProfileModel();
    if(this.data){
    // this.AddProfileClass.VendorCode = this.data.vendorCode;
    // this.AddProfileClass.VendorName = this.data.vendorName;
    // this.AddProfileClass.VendorType = this.data.vendorType;
    // this.AddProfileClass.ContractCode = this.data.contractCode
    // this.AddProfileClass.ContractDate = this.formatDate(this.data.contractDate);
    // this.AddProfileClass.EffectiveDateFrom = this.formatDate(this.data.contractStartDate);
    // this.AddProfileClass.ValidUntil = this.formatDate(this.data.validUptoDate);
    // this.AddProfileClass.DocUrl = this.data.docURL;
    // Create an instance of AddContractProfile and initialize its properties
    // with the AddProfileClass instance and a boolean value
    }
    this.BasicInformationArray = new AddContractProfile(this.AddProfileClass, true);
    this.BasicInformationArray.AddContractProfileArray.forEach(x => {
      if (x.name == 'ContractBranchCode') {
        this.location = x.name
        this.locationStatus = x.additionalData.showNameAndValue
      }
    });
    this.addForm = {
      "ContractProfile": this.BasicInformationArray.AddContractProfileArray
    };
    this.BasicInformationForm = formGroupBuilder(this.fb, Object.values(this.addForm));
    this.BasicInformationForm.controls.ContractDate.markAsPristine();
    this.BasicInformationForm.controls.ContractDate.markAsUntouched();
  }
  formatDate(date) {
    // const datePipe = new DatePipe('en-US'); // Create a DatePipe with locale 'en-US'
    // const myFormattedDate = datePipe.transform(date, 'dd/MM/yyyy');
    const dateObj = new Date(date);
    const timeZoneOffset = dateObj.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const adjustedDate = new Date(dateObj.getTime() - timeZoneOffset);
    const isoString = adjustedDate.toISOString().substr(0, 10);
    return isoString;
  }
  // BindContractSigningLocation() {
  //   this.error = "";
  //   const CompanyCode = parseInt(localStorage.getItem("CompanyCode"))
  //   this.ILocationMasterServices
  //     .GetLocationMaster('DMS/Master/User/GetAutoCompleteLocation/', CompanyCode)
  //     .subscribe({
  //       next: (res) => {
  //         if (res.isSuccess) {
  //           this.LocationListAuto = res.ddlist;
  //           if (this.IsUpdate == true) {
  //             this.Location = res.ddlist.find((x) => x.value == this.data.contractBranchCode);
  //             this.BasicInformationForm.controls.ContractBranchCode.setValue(this.Location);
  //           }
  //           this.filter.Filter(
  //             this.BasicInformationArray.AddContractProfileArray,
  //             this.BasicInformationForm,
  //             this.LocationListAuto,
  //             this.location,
  //             this.locationStatus
  //           );
  //         }
  //       },
  //       error: (error) => {
  //         this.error = error;

  //         this.ObjSnackBarUtility.showNotification(
  //           "snackbar-danger",
  //           error,
  //           "top",
  //           "right"
  //         );
  //       },
  //     });
  // }
  CheckContractDate(submittype) {
    const basicInfoControls = this.BasicInformationForm.controls;
    const ContractDate = new Date(basicInfoControls.ContractDate.value);
    const ContractStartDate = new Date(basicInfoControls.ContractStartDate.value);
    const ContractEndDate = new Date(basicInfoControls.ValidUptoDate.value);
    if (ContractStartDate >= ContractDate && ContractStartDate <= ContractEndDate) {
      this.ContractDateChange(submittype);
      return true;
    }
    else {
      Swal.fire({
        title: "Effective date must be between Contract Date and Valid Until date.",
        toast: true,
        icon: "error",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonText: "Yes"
      });
      return false;
    }
  }

  async ContractDateChange(submittype) {
    const ContractStartDate = this.formatDate(this.data.contractStartDate);
    const contractEndDate = this.formatDate(this.data.validUptoDate);
    const newstartdate = this.BasicInformationForm.controls.ContractStartDate.value;
    const newenddate = this.BasicInformationForm.controls.ValidUptoDate.value;


    const request = {
      CompanyCode: localStorage.getItem("CompanyCode"),
      ContractStartDate: this.BasicInformationForm.controls.ContractStartDate.value,
      ValidUptoDate: this.BasicInformationForm.controls.ValidUptoDate.value,
      VendorCode: this.BasicInformationForm.controls.VendorCode.value,
      VendorType: this.data.vendorType,
      ContractCode:this.data.contractCode
    };

    const datePipe = new DatePipe('en-US');
    // if (datePipe.transform(ContractStartDate, 'dd/MM/YYYY') != datePipe.transform(newstartdate, 'dd/MM/YYYY') || datePipe.transform(contractEndDate, 'dd/MM/YYYY') != datePipe.transform(newenddate, 'dd/MM/YYYY')) {
    //   try {
    //     const res: any = await this.VendorContractPost('Master/VendorContract/CheckVendorContractExistOrNot', request).toPromise();

    //     if (!res.isSuccess) {
    //       Swal.fire({
    //         icon: "error",
    //         title: "Contract Already Exists",
    //         text: `Contract between dates  ${datePipe.transform(request.ContractStartDate, 'dd/MM/YYYY')}  and  ${datePipe.transform(request.ValidUptoDate, 'dd/MM/YYYY')}  already exists`,
    //         showConfirmButton: true,
    //       });

    //       this.BasicInformationForm.controls.ContractStartDate.setValue(ContractStartDate);
    //       this.BasicInformationForm.controls.ValidUptoDate.setValue(contractEndDate);

    //     }
    //     else {
    //       this.submitVendorBasicDetails(submittype);
    //     }


    //   } catch (error) {
    //     console.log(error);

    //   }
    // }
    // else {
    //   this.submitVendorBasicDetails(submittype);
    // }


  }
  // submitVendorBasicDetails(submittype) {

  //   const { ContractBranchCode, ...basicInfoWithoutControls } = this.BasicInformationForm.value;

  //   this.BasicInformationForm.patchValue({
  //     ContractBranchCode: ContractBranchCode.value
  //   });

  //   ['Status', 'VendorName', 'VendorTypeCode'].forEach(control => {
  //     this.BasicInformationForm.removeControl(control);
  //   });
  //   Object.values(this.BasicInformationForm.controls).forEach(control => control.setErrors(null));
  //   this.data.contractBranchCode = this.BasicInformationForm.controls.ContractBranchCode.value;
  //   this.data.contractStartDate=this.BasicInformationForm.controls.ContractStartDate.value,
  //   this.data.validUptoDate=this.BasicInformationForm.controls.ValidUptoDate.value,
  //   this.data.contractDate=this.BasicInformationForm.controls.ContractDate.value,
  //   this.IVendorContractService.VendorContractPost('Master/VendorContract/InsertVendorContractSummary', this.BasicInformationForm.value).subscribe({
  //     next: (res: any) => {
  //       if (res.isSuccess) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Successful",
  //           text: `Basic information updated successfully!!`,
  //           showConfirmButton: true,
  //         });
  //         this.uploadContractCopy(this.data.vendorType, this.data.vendorCode, this.data.contractCode)
  //         if (submittype) {
  //           this.router.navigate(['/Masters/VendorContract/VendorContractDone'], { state: { data: this.data } });
  //         }
  //       }
  //     }
  //   });

  //   this.createBasicInformationForm();
  //  // this.BindContractSigningLocation();
  // }
  uploadContractCopy(VendorType, VendorCode, ContractCode) {
    if (this.selectedFile) {
      const fd = new FormData();
      const formData = {
        CompanyCode: localStorage.getItem("CompanyCode"),
        ContractCode,
        VendorCode,
        VendorType,
        UploadBy: localStorage.getItem("UserName"),
        File: this.selectedFile,
        FileName: this.selectedFile.name,
        FileType: this.selectedFile.type,
        FileExtension: this.selectedFile.name.split('.')[1],
      };

      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });


    }
  }
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  onFileSelected(event) {
    this.selectedFile = event.eventArgs[0];
    this.BasicInformationForm.controls["ContractCopy"].setValue(
      this.selectedFile.name
    );
  }
}
