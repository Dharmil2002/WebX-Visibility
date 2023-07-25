import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { ReAllocateDcrComponent } from '../re-allocate-dcr/re-allocate-dcr.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dcr-detail-page',
  templateUrl: './dcr-detail-page.component.html'
})
export class DcrDetailPageComponent implements OnInit {
  dcrDetailForm: UntypedFormGroup;
  jsonControlArray: any;
  dcrDetailsFormControls: DCRControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "DCR Detail",
      items: ["Document Control"],
      active: "DCR Detail",
    },
  ];
  columnHeader = {
    "actionDesc": "Action",
    'actionDate': 'Date',
    'bookNumber': 'Book Number',
    'fromTo': 'Series Start-End',
    'location': 'Allocation Location',
    "category": "Allocation Category",
    "person": "Person"
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  };
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = [];
  linkArray = [];
  data: any;
  historyData: any;
  historyDet: any;
  type: any;
  action: any;
  actionStatus: any;
  docData: any;
  constructor(private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, public dialog: MatDialog) {
    if (this.route.getCurrentNavigation()?.extras != null) {
      this.type = this.route.getCurrentNavigation().extras?.state?.additionalData;
      this.data = this.route.getCurrentNavigation().extras?.state?.data;
      if (this.type !== 'Manage') {
        this.getDcrHistoryData();
      }
    }
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindDropdown();
  }
  // Handle function calls
  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  intializeFormControls() {
    this.dcrDetailsFormControls = new DCRControl();
    this.jsonControlArray = this.dcrDetailsFormControls.getDcrDetailsFormControls();
    this.jsonControlArray.forEach(control => {
      if (this.type === 'Manage' && control.name === 'action') {
        control.generatecontrol = true;
      }
    });
    this.dcrDetailForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  bindData() {
    const companyCode = parseInt(localStorage.getItem("companyCode"));
    // Helper function to generate request object
    function generateRequest(collection) {
      return {
        companyCode,
        type: "masters",
        collection,
      };
    }

    // Prepare the requests for different collections
    const locationReq = generateRequest("location_detail");
    const userReq = generateRequest("user_master");
    const vendorReq = generateRequest("vendor_detail");
    const customerReq = generateRequest("customer_detail");

    // Create separate observables for each HTTP request
    const locationObs = this.masterService.masterPost('common/getall', locationReq);
    const userObs = this.masterService.masterPost('common/getall', userReq);
    const vendorObs = this.masterService.masterPost('common/getall', vendorReq);
    const customerObs = this.masterService.masterPost('common/getall', customerReq);

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([locationObs, userObs, vendorObs, customerObs]).pipe(
      map(([locationRes, userRes, vendorRes, customerRes]) => {
        // Combine all the data into a single object
        return {
          locationData: locationRes?.data,
          userData: userRes?.data,
          vendorData: vendorRes?.data,
          customerData: customerRes?.data,
        };
      })
    ).subscribe((mergedData) => {
      // Access the merged data here
      const locdet = mergedData.locationData.map(element => ({
        name: element.locName,
        value: element.locCode,
        type: 'L',
      }));

      const userdet = mergedData.userData.map(element => ({
        name: element.name,
        value: element.userId,
        type: 'E',
      }));

      const vendordet = mergedData.vendorData.map(element => ({
        name: element.vendorName,
        value: element.vendorCode,
        type: 'B',
      }));

      const custdet = mergedData.customerData.map(element => ({
        name: element.customerName,
        value: element.customerCode,
        type: 'C',
      }));

      // Combine all arrays into one flat array with extra data indicating the sections
      const allData = [
        { name: '---Location---', value: '', type: 'L' },
        ...locdet,
        { name: '---Employee---', value: '', type: 'E' },
        ...userdet,
        { name: '---BA---', value: '', type: 'B' },
        ...vendordet,
        { name: '---Customer---', value: '', type: 'C' },
        ...custdet,
      ];

      // Options for allocateTo dropdown
      const hierarchyLoc = mergedData.locationData.find(optItem => optItem.locCode === this.data.allotTo)
      const allocateTo = allData.find(optItem => optItem.value === this.data.allocateTo);
      const allotTo = locdet.find(optItem => optItem.value === this.data.allotTo);
      const series = this.data?.seriesFrom && this.data?.seriesTo ? `${this.data.seriesFrom} - ${this.data.seriesTo}` : '';
      const mappings = {
        'queryNumber': 'seriesFrom',
        'bookNumber': 'bookCode',
        'seriesStartEnd': 'fromTo',
        'totalLeaves': 'totalLeaf',
        'location': 'allotTo',
        'usedLeaves': 'usedLeaves',
        'person': 'allocateTo',
        'personCat': 'type',
        'locationHierarchy': 'locationHierarchy',
        'status': 'status',
      };
      for (let key in mappings) {
        let value = this.data?.[mappings[key]] || '';
        if (key === 'seriesStartEnd') { value = series; }
        if (key === 'person') { value = allocateTo ? `${allocateTo.value} - ${allocateTo.name}` : ''; }
        if (key === 'location') { value = allotTo ? `${allotTo.value} - ${allotTo.name}` : ''; }
        if (key === 'locationHierarchy') { value = hierarchyLoc ? `${hierarchyLoc.reportLevel}` : ''; }
        if (key === 'usedLeaves') { value = this.data.usedLeaves; }
        this.dcrDetailForm.controls[key].setValue(value);
      }
      // Set 'personCat' form control based on 'type'
      this.dcrDetailForm.controls['personCat'].setValue(this.data?.type === 'E' ? 'Employee' : this.data?.type === 'C' ? 'Customer' : this.data?.type === 'L' ? 'Location' : 'BA');
    });
  }
  close() {
    window.history.back();
  }
  getDcrHistoryData() {
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.historyData = res.dcrTrackHistoryData[0];
      this.historyDet = this.historyData.filter(item => parseInt(item.docKey) === parseInt(this.data.bookCode)).map((item) => {
        item['location'] = item.allotedLoc + ' : ' + item.allotedLocName;
        return item;
      });
      this.tableLoad = false;
    });
  }
  manage() {
    const selectedValue = this.dcrDetailForm.value.action;
    if (selectedValue && !['S', 'R'].includes(selectedValue)) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please select a valid Action.",
        showConfirmButton: true,
      });
      return; // Stop execution if no value is selected or selected value is not 'S' or 'R'
    }
    if (selectedValue == 'R') {
      this.dialog.open(
        ReAllocateDcrComponent,
        {
          width: '800px',
          height: '280px',
          data: ''
        });
    }
    else {
      this.route.navigate(['Masters/DocumentControlRegister/SplitDCR'], {
        state: {
          data: this.data,
        }
      });
    }
  }
  bindDropdown() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      this.docData = res.documentTypeDropDown;
      const Select = this.docData.find(x => x.value == this.data.documentType)
      this.dcrDetailForm.get('documentType').setValue(Select);
      this.bindData();
    });
  }
}
