import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { AddManualVoucherControl } from 'src/assets/FormControls/add-manual-voucher-control';
import { addVoucherDetail, updateVoucher } from './manual-utlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';

@Component({
  selector: 'app-add-manual-voucher',
  templateUrl: './add-manual-voucher.component.html', 
})
export class AddManualVoucherComponent implements OnInit {
  breadScrums = [
    {
      title: "Add Manual Voucher",
      items: ["Manual Voucher"],
      active: "Add Manual Voucher",
    },
  ];
  update:boolean;
  jsonControlArray: any;
  manualVoucharTableForm: UntypedFormGroup;
  manualVoucharFormControls: AddManualVoucherControl;
  voucherDetail: any;

  constructor(
    private fb: UntypedFormBuilder,
    private router:Router,
    private _NavigationService: NavigationService,
    private masterService:MasterService
    ) {
      if (this.router.getCurrentNavigation()?.extras?.state != null) {
        this.voucherDetail = router.getCurrentNavigation().extras.state.data;
        this.update=true;
      }
     
      this.initializeFormControl();
     }

  ngOnInit(): void {
  }

  initializeFormControl() {
    this.manualVoucharFormControls = new AddManualVoucherControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.manualVoucharFormControls.getManualVoucharArrayControls();
    // Build the form group using formGroupBuilder function
    this.manualVoucharTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
   if(this.update){
    this.bindVoucherDetail();
    }
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  async save() {
    if(this.update){
      const res=await updateVoucher(this.masterService,this.manualVoucharTableForm.value);
    if(res){
      Swal.fire({
        icon: "success",
        title: "Voucher Update Successfully",
        text: "VoucherNo: " + this.manualVoucharTableForm.controls["voucherNo"].value,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to the desired page after the success message is confirmed.
          this._NavigationService.navigateTotab(
            'Voucher',
            "dashboard/Index"
          );
        }
      });
    }
    }

    else{
    const dynamicValue = localStorage.getItem("Branch");
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(7, "0");
    const voucherNo = `VR/${dynamicValue}/${paddedNumber}`;
    this.manualVoucharTableForm.controls['voucherNo'].setValue(voucherNo);
    this.manualVoucharTableForm.controls['_id'].setValue(voucherNo);
    const controlNames = ["voucherType"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.manualVoucharTableForm.value[controlName])) {
        this.manualVoucharTableForm.controls[controlName].setValue("");
      }
    });
    const res=await addVoucherDetail(this.masterService,this.manualVoucharTableForm.value);
    if(res){
      Swal.fire({
        icon: "success",
        title: "Voucher Generated Successfully",
        text: "VoucherNo: " + this.manualVoucharTableForm.controls["voucherNo"].value,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to the desired page after the success message is confirmed.
          this._NavigationService.navigateTotab(
            'Voucher',
            "dashboard/Index"
          );
        }
      });
    }
  }
  }
  cancel() {
    this.goBack('Management​')
  }
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  bindVoucherDetail(){
    this.manualVoucharTableForm.controls['_id'].setValue(this.voucherDetail?.voucherNo||"")
    this.manualVoucharTableForm.controls['voucherNo'].setValue(this.voucherDetail?.voucherNo||"")
    this.manualVoucharTableForm.controls['voucherType'].setValue(this.voucherDetail?.voucherType||"")
    this.manualVoucharTableForm.controls['amount'].setValue(this.voucherDetail?.amount||"")
    this.manualVoucharTableForm.controls['dueDate'].setValue(this.voucherDetail?.dueDate||"")
  }
}
