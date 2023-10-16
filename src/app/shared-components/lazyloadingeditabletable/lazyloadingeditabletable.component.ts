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
//import { MatTableDataSource } from "@angular/material/table";
import { Observable, fromEvent, map, startWith } from "rxjs";
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
@Component({
  selector: 'app-lazyloadingeditabletable',
  templateUrl: './lazyloadingeditabletable.component.html',
})
export class LazyloadingeditabletableComponent implements OnInit {
  @Input() dataSource: TableVirtualScrollDataSource<any>;
  @Input() tableData;
  @Input() columnHeader;
  @Input() ActionObject: any;
  @Output() DeleteAction: EventEmitter<any> = new EventEmitter();
  @Output() UpdateAction: EventEmitter<any> = new EventEmitter();
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
    if (changes.columnHeader && changes.columnHeader.currentValue) {
      const newColumnHeader = changes.columnHeader.currentValue;
      const dropdownFields = Object.keys(newColumnHeader).filter(
        (keyname) =>
          newColumnHeader[keyname].Key === 'Dropdown' ||
          newColumnHeader[keyname].Key === 'multipleDropdown'
      );

      dropdownFields.forEach((keyname) => {
        if (!this.FormControlsList[keyname]) {
          this.FormControlsList[keyname] = new FormControl();
        }

        this.ObservableControls[keyname] = this.getFormControls(keyname).valueChanges.pipe(
          startWith(''),
          map((value) => {
            const filterValue = value.toLowerCase();
            return this.columnHeader[keyname].Option.filter((item) =>
              item.name.toLowerCase().includes(filterValue)
            );
          })
        );
      });
    }
  }


  ngOnInit() {
    this.dataSource = new TableVirtualScrollDataSource(this.tableData);
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
  onChange($event, item, index, row) {
    if (item == "tripType") {
      this.UpdateEvent($event.value, item, 'city', index)
    }
  }
  public async UpdateEvent(elimentvalue, currenteliment, nexteliment, index) {
    const callback = (result) => {
      this.ObservableControls[nexteliment] = this.ObservableControls[nexteliment].pipe(
        map((data: any[]) => result)
      );
      // this.dataSource._updateChangeSubscription();
    };
    await this.UpdateAction.emit({ elimentvalue, currenteliment, nexteliment, index, callback });
  };


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
    const getdata = await this.DeleteAction.emit({ element, index, callback });
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
