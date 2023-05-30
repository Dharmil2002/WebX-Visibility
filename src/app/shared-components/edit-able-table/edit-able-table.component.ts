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
  @Input() dataSource: MatTableDataSource<any>;
  @Input() tableData;
  @Input() columnHeader;
  @Input() ActionObject: any;
  @Output() DeleteAction: EventEmitter<any> = new EventEmitter();
  @Output() Submit: EventEmitter<any> = new EventEmitter();
  @Output() AddRow: EventEmitter<any> = new EventEmitter();
  @Output() functionCallEmitter = new EventEmitter();
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  objKey = Object.keys;
  SelectArry: any = [];
  allComplete = false;
  FormControlsList: { [key: string]: FormControl } = {};
  ObservableControls: { [key: string]: Observable<any[]> } = {};
  constructor(private HTTP: HttpClient) {


  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableData);
    let keys = Object.keys(this.columnHeader)
    keys.forEach((keyname) => {
      if (this.columnHeader[keyname].Key == 'Dropdown' || this.columnHeader[keyname].Key == 'multipleDropdown') {
        this.FormControlsList[keyname] = new FormControl();
        this.ObservableControls[keyname] = this.getFormControls(keyname).valueChanges
          .pipe(
            startWith(''),
            map(value => {
              const filterValue = value.toLowerCase();
              return this.columnHeader[keyname].Option.filter(item => item.name.toLowerCase().includes(filterValue));
            })
          );
      }
    })

    fromEvent(
      this.filter.nativeElement,
      "keyup"
    ).subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
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
        console.log("Deletion confirmed");
        this.dataSource._updateChangeSubscription();
        // Perform additional actions or logic here
      } else {
        // Deletion was canceled or not confirmed
        console.log("Deletion canceled or not confirmed");
        // Perform alternative actions or logic here
      }
    };
    const getdata = await this.DeleteAction.emit({ element, index,callback });
  };
  Delete(element) {
    this.DeleteEvent(element)
    this.dataSource._updateChangeSubscription();
  }
  SubmitData() {
    this.Submit.emit();
  }
  AddRowData() {
    this.AddRow.emit();
    this.dataSource._updateChangeSubscription();
  }
  functionCalled(context: any) {

    const functionName = context.functionName;
    if (functionName !== undefined && functionName !== null && functionName.length > 0) {
      this.functionCallEmitter.emit(context); // Emit an event with the row and index
    }
  }
}
