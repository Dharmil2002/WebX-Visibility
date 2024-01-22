import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { locationFromApi } from '../../prq-entry-page/prq-utitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterControl } from 'src/assets/FormControls/filter.controls';
import { customerFromApi, stateFromApi } from './filter-utlity';

@Component({
  selector: 'app-filter-billing',
  templateUrl: './filter-billing.component.html'
})
export class FilterBillingComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  jsonFilterArray: any;
  filterTableForm: UntypedFormGroup;
  filterControls: FilterControl;
  locationName: string;
  userLocationStatus: boolean;
  stateName: string;
  stateStatus: boolean;
  customerName: string;
  protected _onDestroy = new Subject<void>();
  customerStatus: boolean;
  breadScrums = [{
    title: "filter billing",
    items: ["filter"],
    active: "filter",
  }];
  stateDetail: any;
  locationDetail: any;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<FilterBillingComponent>
  ) {
    this.initializeFormControl();
    this.bindDropdown();
  }

  ngOnInit(): void {
    this.getDropdownDetail();
  }
  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.filterControls = new FilterControl();
    // Get form controls for Driver Details section
    this.jsonFilterArray = this.filterControls.getFormControls();
    // Build the form group using formGroupBuilder function
    this.filterTableForm = formGroupBuilder(this.fb, [this.jsonFilterArray]);
  }

  bindDropdown() {
    const propertyMappings = {
      bookLoc: { property: 'locationName', statusProperty: 'userLocationStatus' },
      state: { property: 'stateName', statusProperty: 'stateStatus' },
      customer: { property: 'customerName', statusProperty: 'customerStatus' }
    };

    this.jsonFilterArray.forEach((data) => {
      const mapping = propertyMappings[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
  }
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  async getDropdownDetail() {
    const locDetail = await locationFromApi(this.masterService);
    const stateDetail = await stateFromApi(this.masterService);
    const customerDetail = await customerFromApi(this.masterService);
    this.stateDetail=stateDetail;
    this.locationDetail=locDetail.map((x)=>{return{name:x.value,value:x.value}});
    this.filter.Filter(this.jsonFilterArray, this.filterTableForm,this.locationDetail, this.locationName, this.userLocationStatus);
    this.filter.Filter(this.jsonFilterArray, this.filterTableForm, stateDetail, this.stateName, this.stateStatus);
    this.filter.Filter(this.jsonFilterArray, this.filterTableForm, customerDetail, this.customerName, this.customerStatus);
  }

  close() {
    this.dialogRef.close("");
  }

  apply() {
    const userLocations = Array.isArray(this.filterTableForm.value.userLocationscontrolHandler)
      ? this.filterTableForm.value.userLocationscontrolHandler.map(x => x.value)
      : [];
    const customer = Array.isArray(this.filterTableForm.value.customerControlHandler)
      ? this.filterTableForm.value.customerControlHandler.map(x => x.name)
      : [];
    const state = Array.isArray(this.filterTableForm.value.stateControlHandler)
      ? this.filterTableForm.value.stateControlHandler.map(x => x.name)
      : [];
    this.filterTableForm.controls['bookLoc'].setValue(userLocations);
    this.filterTableForm.controls['customer'].setValue(customer);
    this.filterTableForm.controls['state'].setValue(state);
    this.dialogRef.close(this.filterTableForm.value);
  }
  toggleSelectAll(argData: any) {
  
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonFilterArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonFilterArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.filterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
      if(argData.field.name==="state"){
        this.bookLocation(this.filterTableForm.controls['stateControlHandler'].value);
      }
  }
  bookLocation(event){
 
    let locArray = [];
     const locValues = event.hasOwnProperty('eventArgs')?event.eventArgs.value:event;
    if (Array.isArray(locValues)&&locValues.length>0) {
      const bookLocs = locValues.map(locValue => {
        const bookLoc =  this.locationDetail.find(x => x.state === locValue.name);
        return bookLoc;
      });
      locArray = locArray.concat(bookLocs.filter(value => value !== undefined && value !== null && value !== ""));
    } else {
      locArray=[]
    }
    
    // Use a Set to remove duplicates and then convert it back to an array
    locArray = [...new Set(locArray.filter(value => value !== undefined && value !== null && value !== ""))];
    
    this.filterTableForm.controls['userLocationscontrolHandler'].setValue(locArray);
    
  }
}
