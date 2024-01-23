import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import moment from 'moment';
import { CsvDataServiceService } from 'src/app/core/service/Utility/csv-data-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';

@Component({
  selector: 'generic-table-webxpress',
  templateUrl: './generic-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent extends UnsubscribeOnDestroyAdapter implements AfterViewInit {

  // properties declaration to receive data from parent component
  @Input() dataSource: MatTableDataSource<any>;
  @Input() tableData;
  @Input() csvData;
  @Input() columnHeader;
  @Input() addAndEditPath;
  @Input() uploadComponent;
  @Input() csvHeaders;  // csvHeader contains object in form of 'column id: column Title' in a particular order
  @Input() viewComponent;
  @Input() csvFileName;
  @Input() headercode;
  @Input() backPath;
  @Input() TableStyle;
  @Input() IscheckBoxRequired;
  @Input() Link;
  @Input() toggleArray;
  @Input() dynamicControls;
  @Input() hyperlinkControls;
  @Input() menuItems: any;
  @Input() menuItemFlag;
  @Output() menuItemClicked = new EventEmitter<any>();
  @Input() height;
  @Input() width;
  @Input() maxWidth;
  @Input() FormTitle: string = "";
  @Input() extraData;
  triggered: boolean = false;
  objectKeys = Object.keys;
  @Output() selectAllClicked = new EventEmitter<any>();
  // @Input() checkBoxRequired;
  // @Input() selectAllorRenderedData;
  @Input() metaData;
  @ViewChild('table') table1: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>
  @Input() activeFunction: Function;
  tableLoad: boolean = true;
  @Output() onFlagChange: EventEmitter<any> = new EventEmitter();
  @Output() dialogClosed = new EventEmitter<any>();
  selectedItems: any[] = [];
  @Input() centerAligned;
  @Input() columnWidths: { [key: string]: string };
  @Output() functionCallEmitter = new EventEmitter();
  @Output() uploadEvent = new EventEmitter<any>();
  ngOnChanges(changes: SimpleChanges) {
    this.tableData = changes.tableData?.currentValue ?? this.tableData;
    this.extraData = changes.extraData?.currentValue ?? this.extraData;
    this.maxWidth = changes.extraData?.currentValue ?? this.maxWidth;
    this.width = changes.width?.currentValue ?? this.width;
    this.height = changes.height?.currentValue ?? this.height;
    this.centerAligned = changes.centerAligned?.currentValue ?? this.centerAligned;
    if (changes.tableData?.currentValue) {
      this.refresh();
    }

  }
  constructor(public ObjSnackBarUtility: SnackBarUtilityService,
    private router: Router, public dialog: MatDialog) {
    super();
  }


  ngOnInit() {

    if (this.metaData == undefined) {
      this.metaData = {};
      this.metaData['noColumnSort'] = [];
      this.metaData['checkBoxRequired'] = false;
      this.metaData['selectAllorRenderedData'] = false;
    }
    if (this.metaData.checkBoxRequired) {

      this.tableData = this.tableData.map(obj => {
        // obj['isSelected'] = false;
        return obj;
      })
    }

    // initialize matTable datasource , using data coming from parent component, 
    // "tableData" in this case.
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;


  }

  ngAfterViewInit() {
    this.loadData();
    this.dataSource = new MatTableDataSource<any>(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  //#region Refresh funtion to reload tha data
  refresh() {
    const sortState: MatSortable = { id: '', start: 'asc', disableClear: false };
    if (this.sort) {
      this.sort.sort(sortState);
    }
    this.loadData();
  }
  //#endregion

  //#region  funtion to send required data to parent component to execute isactive function
  isActive(rowData: any) {
    this.onFlagChange.emit(rowData)
  }
  //#endregion

  //#region function to reload data, in case of any change.
  loadData() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (this.filter) {
      this.subs.sink = fromEvent(
        this.filter.nativeElement,
        "keyup"
      ).subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    }
  }
  //#endregion

  // this function is called, when add button is clicked.
  // it navigates to the Add page using the url provided, from parent
  addNew() {
    this.router.navigateByUrl(this.addAndEditPath);
  }
  cancel() {
    this.router.navigateByUrl(this.backPath);
  }

  //#region this function is called when rendering data in table and returns formatted data if required.
  formatData(val: string, key: string) {
    if (key.includes('Date') && val !== null) {
      let dt = new Date(val);
      return moment(dt).format('DD-MM-YYYY HH:mm'); // <-- Use 'DD-MM-YYYY HH:mm' instead of 'DD/MM/YYYY HH:MM'
    }
    return val;
  }
  //#endregion

  //#region to emit function to open Dialog for bulkUpload
  onUploadClick() {
    if (this.uploadComponent) {
      this.uploadEvent.emit()
    }
  }
  //#endregion

  GeneralView(item) {
    const dialogref = this.dialog.open(
      this.viewComponent,
      {
        width: this.width,
        height: this.height, data: item
      });
    dialogref.afterClosed().subscribe(result => {
      this.dialogClosed.emit(result);
    })
  }
  addNewGeneral() {
    const dialogref = this.dialog.open(
      this.viewComponent,
      {
        width: this.width,
        height: this.height,
        data: this.headercode
      });
    dialogref.afterClosed().subscribe(result => {
      this.dialogClosed.emit(result);
    })

  }
  //#region Funtion to open Dialog to view
  View(item) {
    this.dialog.open(
      this.viewComponent,
      {
        width: this.width ? this.width : '800px',
        height: this.height ? this.height : '500px',
        data: item
      });
  }
  //#endregion
  //#region Funtion to send data for edit
  editCall(item) {
    if (!this.menuItemFlag) {
      this.router.navigate([this.addAndEditPath], {
        state: {
          data: item,

        },
      });
    }
  }
  //#endregion
  shouldDisplayLink(tableData: string): boolean {
    if (this.triggered) {
      return false;
    }

    return this.Link && this.Link.some(item => item.Row && item.Row == tableData);
  }


  //#region Funtion to send data for edit
  drillDownData(item, tableData) {
    let drillDownLink = this.Link.find((x) => x.Row == tableData)
    if (drillDownLink.Path) {
      this.router.navigate([drillDownLink.Path], {
        state: {
          data: { columnData: item, extraData: this.extraData }
        },
      });
    }
    else {
      if (this.menuItems) {
        let navigateToComponent;
        if (tableData === 'Action') {
          let action = item.Action;
          navigateToComponent = this.menuItems.find((x) => x.label === action);
        } else {
          navigateToComponent = this.menuItems.find((x) => x.label === tableData);
        }
        if (navigateToComponent) {
          this.GeneralMultipleView(item, navigateToComponent.componentDetails);
        }
      }
    }
  }
  //#endregion
  // #region  to Convert to Csv File 
  // csvData is 2D array , where first list id of csv headers and later whole table data is pushed row wise.
  ExportToCsv() {
    let jsonCsv = null;
    if (this.csvData && this.csvData.length > 0) {
      // Download CSV data if it exists
      jsonCsv = [...this.csvData];
    } else {
      // Download table data if no CSV data exists
      jsonCsv = [...this.tableData];
    }
    const formattedData = [Object.values(this.csvHeaders), ...jsonCsv.map(row => {
      return Object.keys(this.csvHeaders).map(col => {
        let value = (col.toLowerCase().includes('date') || col.toLowerCase().includes('dob') || col.toLowerCase().includes('dt')) ? moment(new Date(row[col])).format('DD-MM-YYYY') === 'Invalid date' ? row[col] : moment(new Date(row[col])).format('DD-MM-YYYY') : row[col];
        return value
      })
    })]
    CsvDataServiceService.exportToCsv(this.csvFileName, formattedData);
  }
  //#endregion
  //#region  Function to select all rows on table by selecting checkbox
  selectAll(event: MatCheckboxChange) {
   
    // Get the current page size and index from the paginator
    const pageSize = this.paginator.pageSize;
    const pageIndex = this.paginator.pageIndex;

    // Calculate the start and end index of the rows to be selected
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    // Check or uncheck all rows based on the header checkbox state
    if (event.checked) {
      // Check if selectAllorRenderedData is true (both checkboxes enabled)
      if (this.metaData?.checkBoxRequired && !this.metaData?.selectAllorRenderedData) {
        // Only select the data rendered on the current page
        for (let i = startIndex; i < endIndex; i++) {
          this.dataSource.filteredData[i]['isSelected'] = true;
        }
        console.log(this.dataSource.filteredData);//selected/deselected data
      } else {
        // Select all rows in the data source
        this.dataSource.filteredData = this.dataSource.filteredData.map(obj => {
          obj['isSelected'] = true;
          return obj;
        });
        this.selectAllClicked.emit(this.getSelecteditems());
      }
    } else {
      // Deselect all rows in the data source
      this.dataSource.filteredData = this.dataSource.filteredData.map(obj => {
        obj['isSelected'] = false;
        return obj;
      });
      this.selectAllClicked.emit(this.getSelecteditems());
    }
  }

  //#endregion

  getSelecteditems() {
    return this.dataSource.filteredData.filter(item => item['isSelected'] == true);
  }

  getCheckData(data) {
    //this.onFlagChange.emit(data)
    this.onFlagChange.emit(this.getSelecteditems())
    // console.log(this.getSelecteditems());
    //get data on single selection
  }
  handleMenuItemClick(item, element) {
    let functionName = item.function;
    let Data = { label: item, data: element }
    if (!functionName) {
      this.menuItemClicked.emit(Data);
    }
    else {
      this[functionName](element, item.componentDetails);
    }
  }
  GeneralMultipleView(item, viewComponent) {
    const dialogref = this.dialog.open(
      viewComponent,
      {
        width: this.width,
        height: this.height,
        maxWidth: this.maxWidth,
        data: item
      });
    dialogref.afterClosed().subscribe(result => {
      this.dialogClosed.emit(result);
    })
  }
  isNumeric(value: any): boolean {
    return typeof value === 'number';
  }
  centerAlignClass(tableData: string): string {
    const centerAlignColumns = this.centerAligned;
    if (centerAlignColumns && centerAlignColumns.includes(tableData)) {
      return 'matcolumncenter';
    }
    return 'matcolumnleft';
  }
  hyperlinkFunction(functionName,data){
    this.functionCallEmitter.emit({ functionName, data })
  }
}