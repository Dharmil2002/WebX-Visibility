import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, fromEvent, map, startWith } from "rxjs";

@Component({
  selector: 'app-table-boilerplate',
  templateUrl: './edit-able-table.component.html',
})
export class EditAbleTableComponent implements OnInit {
  @Input() title: any;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() tableData;
  @Input() columnHeader;
  @Input() ActionObject: any;
  @Input() showsubmit: boolean
  @Input() FormTitle: string = "";
  @Input() showHeader: boolean = true;
  @Input() centerAligned;
  @Output() DeleteAction: EventEmitter<any> = new EventEmitter();
  @Output() Submit: EventEmitter<any> = new EventEmitter();
  @Output() AddRow: EventEmitter<any> = new EventEmitter();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter();
  @Output() functionCallEmitter = new EventEmitter();
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  objKey = Object.keys;
  SelectArry: any = [];
  allComplete = false;
  FormControlsList: { [key: string]: FormControl } = {};
  ObservableControls: { [key: string]: Observable<any[]> } = {};
  columnKey: any[]
  constructor(private HTTP: HttpClient) {


  }
  ngOnChanges(changes: SimpleChanges) {
    this.tableData = changes.tableData?.currentValue ?? this.tableData;
    this.centerAligned = changes.centerAligned?.currentValue ?? this.centerAligned;
    if (changes.tableData?.currentValue) {
      this.ngOnInit();
    }
    if (changes.columnHeader && changes.columnHeader.currentValue) {
      const newColumnHeader = changes.columnHeader.currentValue;
      const dropdownFields = Object.keys(newColumnHeader).filter(
        (keyname) =>
          newColumnHeader[keyname].key === 'Dropdown' ||
          newColumnHeader[keyname].key === 'multipleDropdown'
      );

      dropdownFields.forEach((keyname) => {
        if (!this.FormControlsList[keyname]) {
          this.FormControlsList[keyname] = new FormControl();
        }

        this.ObservableControls[keyname] = this.getFormControls(keyname).valueChanges.pipe(
          startWith(''),
          map((value) => {
            const filterValue = value.toLowerCase();
            return this.columnHeader[keyname].option.filter((item) =>
              item.name.toLowerCase().includes(filterValue)
            );
          })
        );
      });
    }
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.columnKey = Object.keys(this.columnHeader)
    let keys = Object.keys(this.columnHeader)
    keys.forEach((keyname) => {
      if (this.columnHeader[keyname].key == 'Dropdown' || this.columnHeader[keyname].key == 'multipleDropdown') {
        this.FormControlsList[keyname] = new FormControl();
        this.ObservableControls[keyname] = this.getFormControls(keyname).valueChanges
          .pipe(
            startWith(''),
            map(value => {
              const filterValue = value.toString().toLowerCase(); // Convert to string
              return this.columnHeader[keyname].option.filter(item => {
                if (typeof item.name === 'number') {
                  return item.name.toString().includes(filterValue); // Check for integer values
                }
                return item.name.toLowerCase().includes(filterValue);
              });
            })
          );
      }
    });

    // fromEvent(
    //   this.filter.nativeElement,
    //   "keyup"
    // ).subscribe(() => {
    //   if (!this.dataSource) {
    //     return;
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // });
  }


  getFormControls(key): FormControl {
    return this.FormControlsList[key]
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }
  selectCheck() {
    this.allComplete =
      this.dataSource != null &&
      this.dataSource.filteredData.every((t) => t.Check);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectAll(checked) {
    this.dataSource.filteredData.forEach((element) => {
      element.Check = checked;
    });
  }

  someComplete() {
    if (this.dataSource == null) {
      return false;
    }
    return (
      this.dataSource.filteredData.filter((t) => t.Check).length > 0 &&
      !this.allComplete
    );
  }

  public async DeleteEvent(element) {
    const index = this.dataSource.filteredData.indexOf(element);
    const callback = (result) => {
      if (result) {
        // Deletion was confirmed
        this.dataSource._updateChangeSubscription();
        // Perform additional actions or logic here
      }
    };
    const getdata = await this.DeleteAction.emit({ element, index, callback });
  };
  SubmitData() {
    this.Submit.emit(this.dataSource);
  }
  AddRowData() {
    this.AddRow.emit();
    this.dataSource._updateChangeSubscription();
  }

  functionCalled(context) {
    // console.log(context, "from form components");
    if ((context.functionName !== undefined || context.functionName != null) && context.functionName?.length > 0) {
      this.functionCallEmitter.emit(context)
    }
  }
}
