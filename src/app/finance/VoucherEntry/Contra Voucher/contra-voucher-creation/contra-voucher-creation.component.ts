import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ContraVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/ContraVouchercontrol';

@Component({
  selector: 'app-contra-voucher-creation',
  templateUrl: './contra-voucher-creation.component.html',
})
export class ContraVoucherCreationComponent implements OnInit {
  breadScrums = [
    {
      title: "Contra Voucher",
      items: ["Finance"],
      active: "Contra Voucher",
    },
  ];
  ContraVoucherControl: ContraVoucherControl;

  ContraVoucherSummaryForm: UntypedFormGroup;
  jsonControlContraVoucherSummaryArray: any;

  ContraVoucherPaymentForm: UntypedFormGroup;
  jsonControlContraVoucherPaymentArray: any;



  AccountGroupList: any;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private router: Router,
    private matDialog: MatDialog,
    private filter: FilterUtils,) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.ContraVoucherControl = new ContraVoucherControl("");
    this.jsonControlContraVoucherSummaryArray = this.ContraVoucherControl.getContraVoucherSummaryArrayControls();
    this.ContraVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlContraVoucherSummaryArray]);

    this.jsonControlContraVoucherPaymentArray = this.ContraVoucherControl.getContraVoucherPaymentArrayControls();
    this.ContraVoucherPaymentForm = formGroupBuilder(this.fb, [this.jsonControlContraVoucherPaymentArray]);

  }


  Submit() {
    console.log(this.ContraVoucherSummaryForm.value);
    console.log(this.ContraVoucherPaymentForm.value);

  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
