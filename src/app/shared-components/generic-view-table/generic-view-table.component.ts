import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-view-table',
  templateUrl: './generic-view-table.component.html'
})
export class GenericViewTableComponent implements OnInit {
  /*  below the declare the property which is used is code  */
@Input() tableData:any;
@Input() headerColumn:any;
@Input() staticField=[''];
@Input() menuItem=[];
metaData = {
  checkBoxRequired: true,
  noColumnSort: ["checkBoxRequired"],
};
dynamicControls = {
  add: false,
  edit: true,
  csv: false,
};
  constructor(public dialogRef: MatDialogRef<GenericViewTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.tableData=data?.tableData||"";
      this.headerColumn=data?.jsonColumn||"";
      this.staticField=data?.staticField||"";
    }

  ngOnInit(): void {
  }
  onSelectAllClicked(event){

  }
   // Implement this method
   onCloseButtonClick(): void {
    // Add logic to close the MatDialog
    this.dialogRef.close();
  }
}
