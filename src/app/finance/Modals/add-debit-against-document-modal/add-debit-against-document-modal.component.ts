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
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class AddDebitAgainstDocumentModalComponent implements OnInit {
  DebitVoucherControl: DebitVoucherControl;

  DebitVoucherDocumentDebitsForm: UntypedFormGroup;
  jsonControlDebitVoucherDocumentDebitsArray: any;
  DocumentDebitsDisplayedColumns = GetLedgerDocument()
  staticFieldForLedgerDocument = ['DocumentType', 'Document', 'DebitAmountAgaintsDocument']
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
  DisplayOnlyDocumentDebits: any = [];

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

    const DocumentType = [
      {
        value: "Consignment",
        name: "Consignment",
      }, {
        value: "THC",
        name: "THC",
      }, {
        value: "DRS",
        name: "DRS",
      }, {
        value: "PRS",
        name: "PRS",
      },
      {
        value: "JOB",
        name: "JOB",
      },
    ];
    this.filter.Filter(
      this.jsonControlDebitVoucherDocumentDebitsArray,
      this.DebitVoucherDocumentDebitsForm,
      DocumentType,
      "DocumentType",
      false
    );
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
      this.DisplayOnlyDocumentDebits = this.DisplayOnlyDocumentDebits.filter((x) => x.id !== data.data.id);
    }
    else {
      const LedgerDetails = this.DocumentDebits.find(x => x.id == data.data.id);
      this.addDocumentDebits(LedgerDetails)
    }
  }
  DocumentFieldChanged(event) {
    const DocumentType = this.DebitVoucherDocumentDebitsForm.value.DocumentType;
    this.CalculateTotalAmountBasedOnDocumentType(DocumentType.value)

  }
  addDocumentDebits(event) {
    const EditableId = event?.id
    const DocumentType = this.DebitVoucherDocumentDebitsForm.value.DocumentType;
    const request = {
      DocumentType: DocumentType,
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
          this.DisplayOnlyDocumentDebits = this.DisplayOnlyDocumentDebits.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.DocumentDebits.length + 1,
          Document: result?.Document,
          DocumentHdn: result?.DocumentHdn,
          DebitAmountAgaintsDocument: result?.DebitAmountAgaintsDocument,
          DocumentType: result?.DocumentType,
          actions: ['Edit', 'Remove']
        }
        this.DocumentDebits.push(json);
        this.CalculateTotalAmountBasedOnDocumentType(result?.DocumentType)
      }
      this.LoadDocumentDebitsDetails = true
    });

  }
  CalculateTotalAmountBasedOnDocumentType(DocumentType) {
    this.DisplayOnlyDocumentDebits = this.DocumentDebits.filter(item => item.DocumentType == DocumentType);
    const totalDebitAmountAgaintsDocument = this.DisplayOnlyDocumentDebits.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['DebitAmountAgaintsDocument']);
    }, 0);
    this.DebitVoucherDocumentDebitsForm.get("TotalDebit").setValue(totalDebitAmountAgaintsDocument)

  }
  async AddNewDocumentDebits() {
    this.addDocumentDebits('');
  }
  save() {
    this.dialogRef.close(this.DocumentDebits)
  }
}
