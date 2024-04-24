import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild, } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { fromEvent } from "rxjs";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import moment from "moment";
import { CsvDataServiceService } from "src/app/core/service/Utility/csv-data-service.service";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { ModifyTableCollumnsComponent } from "../../modify-table-collumns/modify-table-collumns.component";
import { ImagePreviewComponent } from "../../image-preview/image-preview.component";
import { GenericService } from "src/app/core/service/generic-services/generic-services";
import { ConvertToNumber, isValidDate, isValidNumber } from "src/app/Utility/commonFunction/common";

@Component({
  selector: "app-generic-table-v2",
  templateUrl: "./generic-table-v2.component.html",
})
export class GenericTableV2Component
  extends UnsubscribeOnDestroyAdapter
  implements AfterViewInit {
  // properties declaration to receive data from parent component
  @Input() dataSource: MatTableDataSource<any>;
  @Input() tableData;
  @Input() columnGroup;
  @Input() csvData;
  @Input() columnHeader = [];
  @Input() TableStyle;
  @Input() TableContainerStyle;
  @Input() addAndEditPath;
  @Input() disbleCheckbox;
  @Input() uploadComponent;
  @Input() csvHeaders; // csvHeader contains object in form of 'column id: column Title' in a particular order
  @Input() viewComponent;
  @Input() csvFileName;
  @Input() headercode;
  @Input() IscheckBoxRequired;
  @Input() Link;
  @Input() toggleArray;
  @Input() dynamicControls;
  @Input() menuItems: any;
  @Input() HeaderMenuItems: any;
  @Input() menuItemFlag;
  @Input() boxData: any;
  @Input() TitleBoxData: any;
  @Input() AddNewButton: any = false;
  @Output() AddNewButtonEvent = new EventEmitter<any>();
  @Output() SubmitButtonEvent = new EventEmitter<any>();
  @Output() menuItemClicked = new EventEmitter<any>();
  @Output() selectAllClicked = new EventEmitter<any>();
  @Output() DeleteFunction = new EventEmitter<any>();
  @Output() functionCallEmitter = new EventEmitter();
  @Output() uploadEvent = new EventEmitter<any>();
  @Input() height;
  @Input() FilterButton;
  @Input() width;
  @Input() maxWidth;
  @Input() extraData;
  @Input() EventButton;
  @Input() FormTitle: string = "";
  @Input() stickyHeader: boolean = false;
  @Input() btndisabled: boolean = false;
  @Input() refreshbtn: boolean = false;
  @Input() showHeader: boolean = true;
  @Input() showPaginator: boolean = true;
  @Input() DisplayAddNewButton: boolean = false;
  @Input() DisplaySaveButton: boolean = false;
  @Input() DisplayCheckbox: boolean = false;
  @Input() staticField = [];
  @Input() allColumnFilter = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() onFlagChangeGetAll: boolean = false;
  triggered: boolean = false;
  objectKeys = Object.keys;
  // @Input() checkBoxRequired;
  // @Input() selectAllorRenderedData;
  @Input() metaData;
  @Input() addFlag;
  @Input() filterColumn = false;
  @ViewChild("table") table1: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @Input() activeFunction: Function;
  tableLoad: boolean = true;
  @Output() onFlagChange: EventEmitter<any> = new EventEmitter();
  @Output() dialogClosed = new EventEmitter<any>();
  @Output() addEmitter = new EventEmitter<any>();
  selectedItems: any[] = [];
  AllChack = false
  @Input() centerAligned;
  @Input() selectAllRequired;

  displayedHeaders: string[];
  ngOnChanges(changes: SimpleChanges) {
    this.tableData = changes.tableData?.currentValue ?? this.tableData;
    this.extraData = changes.extraData?.currentValue ?? this.extraData;
    this.columnGroup = changes.columnGroup?.currentValue ?? this.columnGroup;
    this.maxWidth = changes.extraData?.currentValue ?? this.maxWidth;
    this.width = changes.width?.currentValue ?? this.width;
    this.height = changes.height?.currentValue ?? this.height;
    this.menuItems = changes.menuItems?.currentValue ?? this.menuItems;
    this.addFlag = changes.addFlag?.currentValue ?? this.addFlag;
    this.displayedHeaders = (changes?.columnGroup?.currentValue ?? this.columnGroup ?? []).map(g => g.Name);
    if (changes.tableData?.currentValue) {
      this.refresh();
    }
  }
  constructor(
    public ObjSnackBarUtility: SnackBarUtilityService,
    private router: Router,
    public dialog: MatDialog,
    private genericService: GenericService,
  ) {
    super();
    this.showPaginator = this.showHeader;
  }

  ngOnInit() {
    if (this.metaData == undefined) {
      this.metaData = {};
      this.metaData["noColumnSort"] = [];
      this.metaData["checkBoxRequired"] = false;
      this.metaData["selectAllorRenderedData"] = false;
    }
    if (this.metaData.checkBoxRequired) {
      this.tableData = this.tableData.map((obj) => {
        // obj['isSelected'] = false;
        return obj;
      });
    }

    // initialize matTable datasource , using data coming from parent component,
    // "tableData" in this case.
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.loadData();
    this.dataSource = new MatTableDataSource<any>(this.tableData);

    if(this.showPaginator){
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
  }

  //#region Refresh funtion to reload tha data
  refresh() {
    const sortState: MatSortable = {
      id: "",
      start: "asc",
      disableClear: false,
    };
    if (this.sort) {
      this.sort.sort(sortState);
    }
    this.loadData();
  }
  //#endregion

  //#region  funtion to send required data to parent component to execute isactive function
  isActive(rowData: any) {
    this.onFlagChange.emit(rowData);
  }
  //#endregion

  //#region function to reload data, in case of any change.
  loadData() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
   if(this.showPaginator){
      this.dataSource.paginator = this.paginator;
    }
    if (this.filter) {
      this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
        () => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        }
      );
    }
  }
  //#endregion

  // this function is called, when add button is clicked.
  // it navigates to the Add page using the url provided, from parent
  addNew() {
    if (this.addAndEditPath) {
      this.router.navigateByUrl(this.addAndEditPath);
    }
    if (this.addFlag) {
      this.addEmitter.emit();
    }
  }
  //#region this function is called when rendering data in table and returns formatted data if required.
  formatData(val: any, key: string) {   
    const colDef = this.columnHeader[key];
    if (colDef && colDef.datatype) {
      switch (colDef.datatype) {
        case "date":
          return isValidDate(val) ? moment(new Date(val)).format(colDef.format || "DD MMM YY") : "";
        case "datetime":
          return isValidDate(val) ? moment(new Date(val)).format(colDef.format || "DD MMM YY HH:mm") : "";
        case "time":
          return isValidDate(val) ? moment(new Date(val)).format(colDef.format || "HH:mm") : "";
        case "currency":
          return ConvertToNumber(val || 0).toFixed(2);
        case "number":
          return ConvertToNumber(val || 0).toFixed(colDef.decimalPlaces || 0);
        default:
          return val;
      }
    }
    
    if(val) {      
      if (typeof val !== 'boolean' && isValidNumber(val)) {
        return Number(val);
      } else if (typeof val === 'string' && isValidDate(val)) {
        return moment(new Date(val)).format("DD MMM YY HH:mm");
      }
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
    const dialogref = this.dialog.open(this.viewComponent, {
      width: "600px",
      height: "425px",
      data: item,
    });
    dialogref.afterClosed().subscribe((result) => {
      this.dialogClosed.emit(result);
    });
  }
  addNewGeneral() {
    const dialogref = this.dialog.open(this.viewComponent, {
      width: "600px",
      height: "425px",
      data: this.headercode,
    });
    dialogref.afterClosed().subscribe((result) => {
      this.dialogClosed.emit(result);
    });
  }
  //#region Funtion to open Dialog to view
  View(item) {
    this.dialog.open(this.viewComponent, {
      width: "800px",
      height: "500px",
      data: item,
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

    return (
      this.Link && this.Link.some((item) => item.Row && item.Row == tableData)
    );
  }

  //#region Funtion to send data for edit
  drillDownData(item, tableData, title = "") {
    debugger
    let drillDownLink = this.Link.find((x) => x.Row == tableData);
    if (drillDownLink.Path) {
      this.router.navigate([drillDownLink.Path], {
        state: {
          data: { columnData: item, extraData: this.extraData, title: drillDownLink?.title || "" },
        },
      });
    }
    else if (this.menuItems && this.menuItems.length>0) {
      let navigateToComponent;
      if (tableData === "Action") {
        let action = item.Action;
        navigateToComponent = this.menuItems.find((x) => x.label === action);
      } else {
        navigateToComponent = this.menuItems.find(
          (x) => x.label === tableData
        );
      }
      if (navigateToComponent) {
        this.GeneralMultipleView(item, navigateToComponent.componentDetails);
      }
    }
    else if (!drillDownLink.Path && drillDownLink.componentDetails) {
      this.GeneralMultipleView(item, drillDownLink.componentDetails, drillDownLink.title);
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
    var columns = this.csvHeaders ? Object.keys(this.csvHeaders) : Object.keys(this.columnHeader);
    var headers = this.csvHeaders ? Object.values(this.csvHeaders) : Object.keys(this.columnHeader).map(m => { return this.columnHeader[m].Title; });
    const formattedData = [
      headers,
      ...jsonCsv.map((row) => {
        return columns.map((col) => {
          let value = row[col];
          return this.formatData(value, col);
        });
      }),
    ];
    CsvDataServiceService.exportToCsv(this.csvFileName, formattedData);
  }
  //#endregion
  //#region  Function to select all rows on table by selecting checkbox
  selectAll(event: MatCheckboxChange) {
    this.dataSource.filteredData.forEach(
      (obj) => (obj.isSelected = event.checked)
    );
    this.AllChack = event.checked
    this.selectAllClicked.emit(this.dataSource.filteredData);
  }

  //#endregion

  getSelecteditems() {
    return this.dataSource.filteredData.filter(
      (item) => item["isSelected"] == true
    );
  }
  getCheckData(data) {
    //this.onFlagChange.emit(data)
    this.AllChack = this.dataSource.filteredData.every((t) => t.isSelected)
    if (this.onFlagChangeGetAll) {
      this.onFlagChange.emit(this.dataSource.filteredData);
    } else {
      this.onFlagChange.emit(this.getSelecteditems());
    }

    this.selectAllClicked.emit(this.dataSource.filteredData);
    // console.log(this.getSelecteditems());
    //get data on single selection
  }
  handleMenuItemClick(item, element) {
    let functionName = item.function;
    let Data = { label: item, data: element };
    if (!functionName) {
      this.menuItemClicked.emit(Data);
    } else {
      this[functionName](element, item.componentDetails);
    }
  }
  GeneralMultipleView(item, viewComponent, title = "") {
    //this.s
    this.genericService.setSharedData({ title: title });
    const dialogref = this.dialog.open(viewComponent, {
      width: this.width,
      height: this.height,
      maxWidth: this.maxWidth,
      data: item
    });
    dialogref.afterClosed().subscribe((result) => {
      this.dialogClosed.emit(result);
    });
  }
  isNumeric(value: any): boolean {
    return typeof value === "number";
  }
  centerAlignClass(tableData: string): string {
    const centerAlignColumns = this.centerAligned;
    if (centerAlignColumns && centerAlignColumns.includes(tableData)) {
      return "matcolumncenter";
    }
    return "matcolumnleft";
  }

  someComplete() {
    if (this.dataSource == null) {
      return false;
    }
    return (
      this.dataSource.filteredData.filter((t) => t.isSelected).length > 0 &&
      !this.AllChack
    );
  }
  getMenuItems(labels: string[]): any[] {

    // Check if this.menuItems is defined and is an array before filtering
    if (Array.isArray(this.menuItems)) {
      return this.menuItems.filter(item => labels.includes(item.label));
    } else {
      // Handle the case where this.menuItems is undefined or not an array
      return [];
    }
  }

  AddNew() {
    if (this.addAndEditPath) {
      this.router.navigateByUrl(this.addAndEditPath);
    } else {
      this.AddNewButtonEvent.emit()
    }
  }
  Submit() {
    if (this.addAndEditPath) {
      this.router.navigateByUrl(this.addAndEditPath);
    } else {
      this.SubmitButtonEvent.emit()
    }
  }
  Delete(element) {
    this.DeleteFunction.emit({ element })
  }
  functionHandle(name, element, columnData = null, value = null) {
    this.functionCallEmitter.emit({ functionName: name, data: element, columnData: columnData, value: value})
  }
  OnChangeToggle(event) {
    let context = { event };
    context['functionName'] = 'OnChangeToggle';
    this.functionCallEmitter.emit(context)
  }
  /*below code add for the edit column*/
  openDialog(): void {
    // Convert the initial object into the desired array structure
    const desiredArray = Object.entries(this.allColumnFilter).map(([key, value]) => ({
      Key: key,
      title: value.Title,
      width: value.Style ? value.Style.split(':')[1] : "", // Extracting width from Style
      className: value.class,
      show: value,
    }));
    const dialogRef = this.dialog.open(ModifyTableCollumnsComponent, {
      position: {
        top: "50px",
      },
      data: desiredArray,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event) {
        const filteredData = result.data.filter(column => result.columnKeys.includes(column.Key));
        this.columnHeader = filteredData.filter((x) => x).reduce((acc, curr) => {
          const style = Object.entries(this.allColumnFilter)
            .find(([key, value]) => key === curr.Key)
          [1];
          acc[curr.Key] = {
            Title: curr.title,
            class: curr.className,
            Style: style.Style, // Creating Style property
            type: style.type
          };
          return acc;
        }, {});
      }

    });
  }
  openImageDialog(data) {
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: data.pod },
      width: '30%',
      height: '50%',
    });
  }
}
