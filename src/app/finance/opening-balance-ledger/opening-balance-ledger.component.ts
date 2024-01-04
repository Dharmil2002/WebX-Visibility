import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { openingbalanceControls } from 'src/assets/FormControls/Finance/opening balance/openingbalanceControls';

@Component({
  selector: 'app-opening-balance-ledger',
  templateUrl: './opening-balance-ledger.component.html'
})
export class OpeningBalanceLedgerComponent implements OnInit {
  breadScrums = [
    {
      title: "opening balance Ledger wise",
      items: ["Home"],
      active: "opening-balance",
    },
  ];
  openingbalanceForm: any;
  jsonControlopeningbalanceArray: any;
  constructor(
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.initializeFormControl()
  }

  initializeFormControl() {
    const openingbalance = new openingbalanceControls();
    this.jsonControlopeningbalanceArray = openingbalance.getOpeningBalanceArrayControls();
    console.log('jsonControlopeningbalanceArray' , this.jsonControlopeningbalanceArray)
    this.openingbalanceForm = formGroupBuilder(this.fb, [
      this.jsonControlopeningbalanceArray,
    ]);
    console.log('openingbalanceForm' , this.openingbalanceForm)

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
