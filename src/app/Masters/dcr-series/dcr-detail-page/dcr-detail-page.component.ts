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
import { DatePipe } from '@angular/common';

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
    "action": "Action",
    'entryDate': 'Date',
    'bookCode': 'Book Number',
    'fromTo': 'Series Start-End',
    'location': 'Allocation Location',
    "type": "Allocation Category",
    "person": "Person"
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  };
  datePipe: DatePipe = new DatePipe("en-US");
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
  allData: any[];
  locdet: any;
  constructor(private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, public dialog: MatDialog) {
    if (this.route.getCurrentNavigation()?.extras != null) {
      this.type = this.route.getCurrentNavigation().extras?.state?.additionalData;
      this.data = this.route.getCurrentNavigation().extras?.state?.data;
    }
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindDropdown();
  }
  // Handle function calls
  functionCallHandler($event) {
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
    function generateRequest(collectionName) {
      return {
        companyCode,
        collectionName,
        filter: {}
      };
    }

    // Prepare the requests for different collections
    const locationReq = generateRequest("location_detail");
    const userReq = generateRequest("user_master");
    const vendorReq = generateRequest("vendor_detail");
    const customerReq = generateRequest("customer_detail");

    // Create separate observables for each HTTP request
    const locationObs = this.masterService.masterPost('generic/get', locationReq);
    const userObs = this.masterService.masterPost('generic/get', userReq);
    const vendorObs = this.masterService.masterPost('generic/get', vendorReq);
    const customerObs = this.masterService.masterPost('generic/get', customerReq);

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
      this.locdet = mergedData.locationData.map(element => ({
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
      this.allData = [
        { name: '---Location---', value: '', type: 'L' },
        ...this.locdet,
        { name: '---Employee---', value: '', type: 'E' },
        ...userdet,
        { name: '---BA---', value: '', type: 'B' },
        ...vendordet,
        { name: '---Customer---', value: '', type: 'C' },
        ...custdet,
      ];

      const hierarchyLoc = mergedData.locationData.find(optItem => optItem.locCode === this.data?.allotTo)
      const allocateTo = this.allData.find(optItem => optItem.value === this.data?.allocateTo);
      const allotTo = this.locdet.find(optItem => optItem.value === this.data?.allotTo);
      const series = this.data?.seriesFrom && this.data?.seriesTo ? `${this.data?.seriesFrom} - ${this.data?.seriesTo}` : '';
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
      Object.keys(mappings).forEach(key => {
        let value = '';
        switch (key) {
          case 'seriesStartEnd':
            value = series;
            break;
          case 'person':
            value = allocateTo ? `${allocateTo.value} - ${allocateTo.name}` : '';
            break;
          case 'location':
            value = allotTo ? `${allotTo.value} - ${allotTo.name}` : '';
            break;
          case 'locationHierarchy':
            value = hierarchyLoc ? hierarchyLoc.reportLevel : '';
            break;
          case 'usedLeaves':
            value = this.data?.usedLeaves;
            break;
          default:
            value = this.data?.[mappings[key]] || '';
        }
        this.dcrDetailForm.controls[key].setValue(value);
      });

      // Set 'personCat' form control based on 'type'
      this.dcrDetailForm.controls['personCat'].setValue(this.data?.type === 'E' ? 'Employee' : this.data?.type === 'C' ? 'Customer' : this.data?.type === 'L' ? 'Location' : 'BA');
      if (this.type !== 'Manage') {
        this.getDcrHistoryData();
      }
    });
  }
  close() {
    window.history.back();
  }
  getDcrHistoryData() {
    let req = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "dcr"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          this.historyDet = dataWithSrno.filter(item => item.seriesFrom === this.data?.seriesFrom).map((item) => {
            const loc = this.locdet.find(optItem => optItem.value === item.allotTo);
            const allocateTo = this.allData.find(optItem => optItem.value === item.allocateTo);
            item['location'] = loc ? `${loc.value} - ${loc.name}` : '';
            item['fromTo'] = item.seriesFrom + ' - ' + item.seriesTo;
            item['type'] = item.type === 'E' ? 'Employee' : item.type === 'C' ? 'Customer' : item.type === 'L' ? 'Location' : 'BA'
            item['person'] = allocateTo ? `${allocateTo.value} - ${allocateTo.name}` : '';
            return item;
          });
          this.tableLoad = false;

        }
      }
    })
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
          data: this.data
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
      const Select = this.docData.find(x => x.value == this.data?.documentType)
      this.dcrDetailForm.get('documentType').setValue(Select);
      this.bindData();
    });
  }
}
