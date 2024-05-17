import { AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GuiColumn, GuiColumnMenu, GuiPaging, GuiSearching, GuiSorting, GuiTheme } from '@generic-ui/ngx-grid';
import { fromEvent } from 'rxjs';
import { CsvDataServiceService } from "src/app/core/service/Utility/csv-data-service.service";
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-generic-ui-grid',
  templateUrl: './generic-ui-grid.component.html',
})
export class GenericUiGridComponent extends UnsubscribeOnDestroyAdapter implements AfterViewInit {

  @Input() dataSource: MatTableDataSource<any>;
  @Input() formTitle: string = "";
  @Input() showHeader: boolean = true;
  @Input() showCSVButton: boolean;
  @Input() csvFileName: string;
  @Input() source: any[];
  @Input() columns: GuiColumn[];
  @Input() sorting: boolean | GuiSorting;
  @Input() columnMenu: boolean | GuiColumnMenu;
  @Input() maxHeight: number;
  @Input() width: number;
  @Input() paging: GuiPaging;
  @Input() virtualScroll: boolean;
  @Input() searching: GuiSearching;
  @Input() loading: boolean;
  @Input() theme: string | GuiTheme;

  @ViewChild("filter", { static: true }) filter: ElementRef;


  constructor() {
    super()
  }
  ngAfterViewInit(): void {
    // this.loadData()
    this.dataSource = new MatTableDataSource<any>(this.source);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.source);
    this.source = changes.source?.currentValue ?? this.source;

    // this.loadData()
  }

  // Function to Convert Csv File
  exportToCsv(): void {
    if (this.source && this.source.length > 0) {
      const headers = this.columns.map(column => column.header);
      const fields = this.columns.map(column => column.field.toString());
      const formattedData =
        [
          headers,
          ...this.source.map((row) => fields.map((field) => row[field]))
        ];
      CsvDataServiceService.exportToCsv(this.csvFileName, formattedData);
    }
  }


  // loadData() {
  //   this.dataSource = new MatTableDataSource(this.source);
  //   if (this.filter) {
  //     this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
  //       () => {
  //         if (!this.dataSource) {
  //           return;
  //         }
  //         const filterValue = this.filter.nativeElement.value;
  //         if (!filterValue) {
  //           this.dataSource = new MatTableDataSource(this.source);
  //           return;
  //         }
  //         this.dataSource.filter = filterValue
  //         this.source = this.source.filter(item => {
  //           return Object.keys(item).some(key => String(item[key]).includes(filterValue));
  //         });
  //         this.dataSource = new MatTableDataSource(this.source)
  //         console.log(filterValue)
  //         console.log("Data:",this.source);

  //       }
  //     );
  //   }
  // }


}
