import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup } from "@angular/forms";
import { fromEvent } from "rxjs";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { SelectionModel } from "@angular/cdk/collections";
import { ModifyTableCollumnsComponent } from "src/app/shared-components/modify-table-collumns/modify-table-collumns.component";

@Component({
  selector: 'app-xlsx-preview-page',
  templateUrl: './xlsx-preview-page.component.html',
})
export class XlsxPreviewPageComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns: MyObject[] = [];
  columnKeys: string[] = [];
  RoutePlanDashboardFilter: FormGroup;
  public dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  maxTextLengths = {};
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<XlsxPreviewPageComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any
  ) {
    super();
    this.SetMaxLength(this.objResult);
  }

  ngOnInit() {
    this.SetList();
    fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
      if (this.dataSource) {
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    });
  }
  SetMaxLength(jsonData) {
    jsonData.forEach(item => {
      for (const key in item) {
        if (typeof item[key] === 'string') {
          const length = item[key].length;
          if (!(key in this.maxTextLengths) || length > this.maxTextLengths[key]) {
            this.maxTextLengths[key] = length;
          }
        }
      }
    });
  }

  CloseDialog() {
    const filteredData = this.selection.selected.map(item => {
      const filteredItem = {};
      this.columnKeys.forEach(key => {
        if (item[key]) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    this.dialogRef.close(filteredData);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.filter(x => x.error == null).length;
    const numRows = this.dataSource.data.filter(x => x.error == null).length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.filter(x => x.error == null).forEach((row) =>
        this.selection.select(row)
      );
  }
  SetList() {
    const tableTitle = Object.keys(this.objResult[0]);
    tableTitle.forEach((value, index) => {
      const Mydata: MyObject = {
        Key: value,
        title: value,
        width: "100",
        className: "matcolumncenter",
        show: true
      };
      if (Mydata.Key == 'error') {
        Mydata.title = "Errors",
          Mydata.width = "300";
      }
      if (this.maxTextLengths.hasOwnProperty(Mydata.Key)) {
        Mydata.width = String(this.maxTextLengths[Mydata.Key] * 8);
      }
      this.displayedColumns.push(Mydata);
    });

    this.columnKeys = this.displayedColumns.map((column) => column.Key);
    const lastElement = this.columnKeys.pop();
    this.columnKeys.unshift(lastElement);
    this.columnKeys.unshift('status')
    this.columnKeys.unshift('select')

    this.dataSource.data = this.objResult;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.data.filter(x => x.error == null).forEach((row) =>
      this.selection.select(row)
    );
  }
  //#endregion
  openDialog(): void {
    const dialogRef = this.matDialog.open(ModifyTableCollumnsComponent, {
      position: {
        top: "50px",
      },
      data: this.displayedColumns,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event) {
        this.displayedColumns = result.data;
        this.columnKeys = result.columnKeys;
        const lastElement = this.columnKeys.pop();
        this.columnKeys.unshift(lastElement);
        this.columnKeys.unshift('status')
        this.columnKeys.unshift('select')

      }
    });
  }
}

export interface MyObject {
  Key: string;
  title: string;
  width: string;
  className: string;
  show: boolean;
}