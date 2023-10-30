import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GetLedgerDocument } from '../../credit-debit-voucher/debitvoucherCommonUtitlity';
import { AddDetailsDebitAgainstDocumentModalComponent } from '../add-details-debit-against-document-modal/add-details-debit-against-document-modal.component';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';

@Component({
  selector: 'app-add-debit-against-document-modal',
  templateUrl: './add-debit-against-document-modal.component.html',

})
export class AddDebitAgainstDocumentModalComponent implements OnInit {
  DebitVoucherControl: DebitVoucherControl;

  DebitVoucherDocumentDebitsForm: UntypedFormGroup;
  jsonControlDebitVoucherDocumentDebitsArray: any;
  DocumentDebitsDisplayedColumns = GetLedgerDocument()
  staticFieldForLedgerDocument = ['Document', 'DebitAmountAgaintsDocument']
  LoadDocumentDebitsDetails = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  DocumentDebits: any = [];
  DocumentList = [
    {
      value: "Test1",
      name: "Test1",
    },
    {
      value: "Test2",
      name: "Test2",
    },

  ];
  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<AddDebitAgainstDocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl()
  }
  initializeFormControl() {
    this.DebitVoucherControl = new DebitVoucherControl("");

    this.jsonControlDebitVoucherDocumentDebitsArray = this.DebitVoucherControl.getDebitVoucherDocumentDebitsArrayControls();
    this.DebitVoucherDocumentDebitsForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherDocumentDebitsArray]);

  } Close() {
    this.dialogRef.close()
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.DocumentDebits = this.DocumentDebits.filter((x) => x.id !== data.data.id);
    }
    else {

      const LedgerDetails = this.DocumentDebits.find(x => x.id == data.data.id);
      this.addDocumentDebits(LedgerDetails)
    }
  }
  addDocumentDebits(event) {
    const EditableId = event?.id
    const request = {
      DocumentList: this.DocumentList,
      Details: event,
    }


    this.LoadDocumentDebitsDetails = false
    const dialogRef = this.matDialog.open(AddDetailsDebitAgainstDocumentModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          this.DocumentDebits = this.DocumentDebits.filter((x) => x.id !== EditableId);
        }

        const json = {
          id: this.DocumentDebits.length + 1,
          Document: result?.Document,
          DocumentHdn: result?.DocumentHdn,
          DebitAmountAgaintsDocument: result?.DebitAmountAgaintsDocument,
          actions: ['Edit', 'Remove']
        }
        this.DocumentDebits.push(json);
      }
      this.LoadDocumentDebitsDetails = true
    });

  }
  async AddNewDocumentDebits() {
    this.addDocumentDebits('');
  }
  save() {
    this.DocumentDebits.close()
  }
}
