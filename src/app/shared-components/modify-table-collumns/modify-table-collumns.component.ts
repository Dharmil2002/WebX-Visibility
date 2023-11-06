import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modify-table-collumns',
  templateUrl: './modify-table-collumns.component.html',
})
export class ModifyTableCollumnsComponent {
  CheckBoox = new FormControl([]);
  constructor(
    public dialogRef: MatDialogRef<ModifyTableCollumnsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const Detaildata= this.data;
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      if (element.show) {
        this.CheckBoox.value.push(element.Key);
      }
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  onSaveClick(value): void {
    
    if (value.event) {
      const TempcolumnKeys = [];
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];
        if (this.CheckBoox.value.includes(element.Key)) {
          TempcolumnKeys.push(element.Key);
          this.data[index].show = true;
        } else {
          this.data[index].show = false;
        }
      }
      this.dialogRef.close({
        data: this.data,
        columnKeys: TempcolumnKeys,
        event: true,
      });
    } else {
      this.dialogRef.close({
        event: false,
      });
    }
  }
}