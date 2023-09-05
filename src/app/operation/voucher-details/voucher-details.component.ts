import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VoucherdetaisControl } from 'src/assets/FormControls/voucher-details-control';
import { calculateTotalField } from '../unbilled-prq/unbilled-utlity';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html'
})
export class VoucherDetailsComponent implements OnInit {

  HandFormControls: VoucherdetaisControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];

  handTableForm: UntypedFormGroup;
  columnHeader = {
    SN: {
      Title: "Sr No",
      class: "matcolumncenter",
      Style: "",
    },
    Voucherno: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "",
    },
    Voucheramount: {
      Title: "Voucher Amount",
      class: "matcolumncenter",
      Style: "",
    },
    Paidto: {
      Title: "Paid to",
      class: "matcolumncenter",
      Style: "",
    },
    VGB: {
      Title: "Voucher Generated By",
      class: "matcolumncenter",
      Style: "",
    },
    VGon: {
      Title: "Voucher Generated on",
      class: "matcolumncenter",
      Style: "",
    },
  };
  staticField = ["SN", "Voucherno", "Voucheramount", "Paidto", "VGB", "VGon"];
  breadScrums = [
    {
      title: "Voucher Details",
      items: ["Home"],
      active: "Voucher Details",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  tableData = [
    {
      SN: 1,
      Voucherno: 1001,
      Voucheramount: 2000,
      Paidto: 2000,
      VGB: "Manan",
      VGon:101,
    },
    {
      SN: 2,
      Voucherno: 1002,
      Voucheramount: 3000,
      Paidto: 3000,
      VGB: "Manan",
      VGon:102,
    },
    {
      SN: 3,
      Voucherno: 1003,
      Voucheramount: 4000,
      Paidto: 4000,
      VGB: "Manan",
      VGon:103,
    }
  ];
  tableLoad: boolean = true;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data =
        this.router.getCurrentNavigation()?.extras?.state.data.columnData;
    }
    this.tableLoad = false;
    const Voucheramount = calculateTotalField(this.tableData, 'Voucheramount');
    this.KPICountData = [
      {
        count: Voucheramount,
        title: "Voucher Amount",
        class: `color-Grape-light`,
      },
    ]
    this.initializeFormControl();
  }

  ngOnInit(): void {}

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

  initializeFormControl() {
    this.HandFormControls = new VoucherdetaisControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.HandFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.handTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    this.goBack(9)
  } 
 
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
  save() {}

}
