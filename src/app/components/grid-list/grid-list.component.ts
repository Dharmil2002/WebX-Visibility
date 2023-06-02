import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { CsvDataServiceService } from 'src/app/core/service/Utility/csv-data-service.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html'
})
export class GridListComponent extends UnsubscribeOnDestroyAdapter implements AfterViewInit {

  // divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  // displayedColumns: string[] = ['Docket', 'Count', 'TotalPackage', 'TotalWeight', 'TotalCFT', 'VehicleCapacity'];
  // dataSource = [
  //   { Docket: 'Docket 1', Count: 10, TotalPackage: 20, TotalWeight: 200, TotalCFT: 50, VehicleCapacity: '50 tons' },
  //   { Docket: '4553', Count: 'Hydrogen', TotalPackage: 1.0079, TotalWeight: 4, TotalCFT: 56, VehicleCapacity: 'H' },
  //   { Docket: '546', Count: 'Helium', TotalPackage: 4.0026, TotalWeight: 5, TotalCFT: 56, VehicleCapacity: 'He' },
  // ];
  // columnDefinitions = [
  //   { columnDef: 'Docket', header: 'Docket' },
  //   { columnDef: 'Count', header: 'Count' },
  //   { columnDef: 'TotalPackage', header: 'Total Package' },
  //   { columnDef: 'TotalWeight', header: 'Total Weight' },
  //   { columnDef: 'TotalCFT', header: 'Total CFT' },
  //   { columnDef: 'VehicleCapacity', header: 'Vehicle Capacity' }
  // ];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() tableData;
  @Input() dropDownValue;
  @Input() csvData;
  @Input() columnHeader;
  @Input() addAndEditPath;
  @Input() uploadComponent;
  @Input() csvHeaders;  // csvHeader contains object in form of 'column id: column Title' in a particular order
  @Input() viewComponent;
  @Input() csvFileName;
  @Input() headercode;
  objectKeys = Object.keys;
  @Input() metaData;



  @ViewChild('table') table1: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>
  @Input() activeFunction: Function;
  tableLoad: boolean = true;
  @Output() onFlagChange: EventEmitter<any> = new EventEmitter();
  @Output() onChecked: EventEmitter<any> = new EventEmitter();
  @Output() dialogClosed = new EventEmitter<any>();
  selectedItems: any[] = [];
  ngOnChanges(changes: SimpleChanges) {
    this.tableData = changes.tableData.currentValue;
    this.refresh();
  }
  constructor(
    private router: Router, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {

    if(this.metaData == undefined){
      this.metaData = {};
      this.metaData['noColumnSort'] = [];
      this.metaData['checkBoxRequired'] = false;
      this.metaData['selectAllorRenderedData'] = false;
    }
    if (this.metaData.checkBoxRequired) {

      this.tableData = this.tableData.map(obj => {
        obj['isSelected'] = false;
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
    this.sort.sort(sortState);
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
  //#endregion

  // this function is called, when add button is clicked.
  // it navigates to the Add page using the url provided, from parent
  addNew() {
    this.router.navigateByUrl(this.addAndEditPath);
  }

  //#region this function is called when rendering data in table and returns formatted data if required.
  formatData(val: string, key: string) {
    if (key === 'valdity_dt' && val !== null) {
      let dt = new Date(val)
      return moment(dt).format('DD/MM/YYYY');
      // return this.datePipe.transform(dt, "dd/MM/yyyy");
    }
    return val
  }
  //#endregion

  //#region Funtion to open Dialog for bulkUpload
  onUploadClick() {
    this.dialog.open(
      this.uploadComponent,
      {
        width: '800px',
        height: '500px',
      });
  }
  //#endregion

  GeneralView(item) {
    const dialogref = this.dialog.open(
      this.viewComponent,
      {
        width: '600px',
        height: '425px', data: item
      });
    dialogref.afterClosed().subscribe(result => {
      this.dialogClosed.emit(result);
    })

  }
  addNewGeneral() {
    const dialogref = this.dialog.open(
      this.viewComponent,
      {
        width: '600px',
        height: '425px',
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
        width: '800px',
        height: '500px', data: item
      });
  }
  //#endregion
  //#region Funtion to send data for edit
  editCall(item) {
    this.router.navigate([this.addAndEditPath], {
      state: {
        data: item,
      },
    });
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
      if (this.metaData?.checkBoxRequired && this.metaData?.selectAllorRenderedData) {
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
        this.getCheckData()
      }
    } else {
      
      // Deselect all rows in the data source
      this.dataSource.filteredData = this.dataSource.filteredData.map(obj => {
        obj['isSelected'] = false;
        return obj;
      });
      this.getCheckData()
    }
  }

  //#endregion

  getSelecteditems() {
    return this.dataSource.filteredData.filter(item => item['isSelected'] == true);
  }

  getCheckData() {
    this.onChecked.emit(this.getSelecteditems())
  }
  onChanged(item){
    this.router.navigate([this.addAndEditPath], {
      state: {
        data: {data:item,dropDownValue:this.dropDownValue},
      },
    });
  }
}
