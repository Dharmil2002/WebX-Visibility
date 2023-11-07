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
  @Input() csvData;
  @Input() columnHeader = [];
  @Input() TableStyle;
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
  @Input() height;
  @Input() FilterButton;
  @Input() width;
  @Input() maxWidth;
  @Input() extraData;
  @Input() EventButton;
  @Input() FormTitle: string = "";
  @Input() btndisabled: boolean = false;
  @Input() refreshbtn: boolean = false;
  @Input() showHeader: boolean = true;
  @Input() DisplayAddNewButton: boolean = false;
  @Input() DisplaySaveButton: boolean = false;
  @Input() DisplayCheckbox: boolean = false;
  @Input() staticField = [];
  @Input() allColumnFilter = [];
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
  ngOnChanges(changes: SimpleChanges) {
    this.tableData = changes.tableData?.currentValue ?? this.tableData;
    this.extraData = changes.extraData?.currentValue ?? this.extraData;
    this.maxWidth = changes.extraData?.currentValue ?? this.maxWidth;
    this.width = changes.width?.currentValue ?? this.width;
    this.height = changes.height?.currentValue ?? this.height;
    this.menuItems = changes.menuItems?.currentValue ?? this.menuItems;
    this.addFlag = changes.addFlag?.currentValue ?? this.addFlag;
    if (changes.tableData?.currentValue) {
      this.refresh();
    }
  }
  constructor(
    public ObjSnackBarUtility: SnackBarUtilityService,
    private router: Router,
    public dialog: MatDialog
  ) {
    super();
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
    this.dataSource.paginator = this.paginator;
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
    this.dataSource.paginator = this.paginator;
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
  formatData(val: string, key: string) {
    if (key === "valdity_dt" && val !== null) {
      let dt = new Date(val);
      return moment(dt).format("DD/MM/YYYY");
      // return this.datePipe.transform(dt, "dd/MM/yyyy");
    }
    return val;
  }
  //#endregion

  //#region Funtion to open Dialog for bulkUpload
  onUploadClick() {
    this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
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
  drillDownData(item, tableData) {
    let drillDownLink = this.Link.find((x) => x.Row == tableData);
    if (drillDownLink.Path) {
      this.router.navigate([drillDownLink.Path], {
        state: {
          data: { columnData: item, extraData: this.extraData },
        },
      });
    } else {
      if (this.menuItems) {
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
    const formattedData = [
      Object.values(this.csvHeaders),
      ...jsonCsv.map((row) => {
        return Object.keys(this.csvHeaders).map((col) => {
          let value =
            col.toLowerCase().includes("date") ||
              col.toLowerCase().includes("dob") ||
              col.toLowerCase().includes("dt")
              ? moment(new Date(row[col])).format("DD-MM-YYYY") ===
                "Invalid date"
                ? row[col]
                : moment(new Date(row[col])).format("DD-MM-YYYY")
              : row[col];
          return value;
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
    this.onFlagChange.emit(this.getSelecteditems());
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
  GeneralMultipleView(item, viewComponent) {
    const dialogref = this.dialog.open(viewComponent, {
      width: this.width,
      height: this.height,
      maxWidth: this.maxWidth,
      data: item,
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
  FunctionHendel(name, element) {
    this.functionCallEmitter.emit({ functionName: name, data: element })
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
}
