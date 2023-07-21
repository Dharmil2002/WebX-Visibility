import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-track-dcr-series',
  templateUrl: './track-dcr-series.component.html'
})
export class TrackDcrSeriesComponent implements OnInit {
  trackDcrForm: UntypedFormGroup;
  jsonControlArray: any;
  dcrFormControls: DCRControl;

  // Breadcrumbs
  breadScrums = [
    {
      title: "Track and Manage DCR Series",
      items: ["Document Control"],
      active: "Track and Manage DCR Series",
    },
  ];
  docType: any;
  docTypeStatus: any;
  data: any;

  constructor(private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils, private router: Router) { }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindDropdown();
  }
  intializeFormControls() {
    //throw new Error("Method not implemented.");
    this.dcrFormControls = new DCRControl();
    this.jsonControlArray = this.dcrFormControls.getFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'documentType') {
        this.docType = data.name;
        this.docTypeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.trackDcrForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
  bindDropdown() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      this.data = res.documentTypeDropDown;
      const Select = this.data.find(x => x.name == this.data[0].name)
      this.trackDcrForm.get('documentType').setValue(Select);
      this.filter.Filter(
        this.jsonControlArray,
        this.trackDcrForm,
        this.data,
        this.docType,
        this.docTypeStatus,
      );
    });
  }
  track(additionalData) {
    debugger
    if (!this.trackDcrForm.value.documentNumber) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please enter a document number.",
        showConfirmButton: true,
      });
      return; // Stop execution if documentNumber is null or empty
    }
    let req = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "dcr"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          debugger
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          console.log(dataWithSrno);
          const matchingData = dataWithSrno.find(item => {
            return (
              item.documentType === this.trackDcrForm.value.documentType.value &&
              item.bookCode === this.trackDcrForm.value.documentNumber
            );
          });
          if (matchingData) {
            console.log(matchingData);
            this.router.navigate(['Masters/DocumentControlRegister/DCRDetail'], {
              state: {
                data: matchingData, additionalData: additionalData,
              }
            });
          }
          else {
            Swal.fire({
              icon: "warning",
              title: "Alert",
              text: `No matching data found.`,
              showConfirmButton: true,
            });
          }
        }
      }
    })
    // this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
    //   this.data = res.dcrTrackData;
    //   const matchingData = this.data.find(item => {
    //     return (
    //       item.docType === this.trackDcrForm.value.documentType.value &&
    //       this.isInRange(this.trackDcrForm.value.documentNumber, item.docSrFrom, item.docSrTo) &&
    //       this.hasSameLength(this.trackDcrForm.value.documentNumber, item.docSrFrom)
    //     );
    //   });
    //   if (matchingData) {
    //     this.router.navigate(['Masters/DocumentControlRegister/DCRDetail'], {
    //       state: {
    //         data: matchingData, additionalData: additionalData,
    //       }
    //     });
    //   }
    //   else {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Alert",
    //       text: `No matching data found.`,
    //       showConfirmButton: true,
    //     });
    //   }
    // }
    // );
  }
  isInRange(value, start, end) {
    return value >= start && value <= end;
  }

  hasSameLength(value1, value2) {
    return value1.length === value2.length;
  }
}
