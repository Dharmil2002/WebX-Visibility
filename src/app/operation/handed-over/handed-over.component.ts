import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { RakeEntryService } from 'src/app/Utility/module/operation/rake-entry/rake-entry-service';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import { HandoverControl } from 'src/assets/FormControls/hand-over-control';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-handed-over',
  templateUrl: './handed-over.component.html'
})
export class HandedOverComponent implements OnInit {
  HandFormControls: HandoverControl;
  jsonControlArray: any;

  handTableForm: UntypedFormGroup;
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    containerNumber: {
      Title: "Container No",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    containerType: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    isEmpty: {
      Title: "Is Empty",
      class: "matcolumncenter",
      Style: "min-width:200px",
    }
  }
  staticField = [
    "containerNumber",
    "containerType",
    "isEmpty"
  ]
  breadScrums = [
    {
      title: "Diverted For Export",
      items: ["Home"],
      active: "Diverted For Export",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  tableData = [];
  tableLoad: boolean = true;
  data: any;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private thcService: ThcService,
    private rakeEntryService:RakeEntryService

  ) {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState) {
      this.breadScrums[0].title = navigationState.flag
      this.breadScrums[0].active = navigationState.flag
    }
    this.data = navigationState;
    this.tableLoad = false;
    this.initializeFormControl();

  }

  ngOnInit(): void {
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  initializeFormControl() {
    this.HandFormControls = new HandoverControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.HandFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.handTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.handTableForm.controls['locationCode'].setValue(this.data?.rakeDetails.branch || "");
    this.handTableForm.controls['rktUptDt'].setValue(this.data?.rakeDetails.oRakeEntryDate || "");
    this.getShipmentDetails();
  }
  cancel() {
    this.goBack('Rake');
  }
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  async getShipmentDetails() {

    const docket = this.data?.rakeDetails.containorDetail.map((x) => x.cnNo);
    const docketList = await this.thcService.getShipment(false);
    // Function to get containerDetail based on cnNo
    const getContainerDetailByCnNo = (objectArray, cnNo) => {
      const containerDetailArray = [];

      // Iterate through the objectArray
      objectArray.forEach((obj) => {
        // Check if the docketNumber matches any cnNo in the cnNoArray
        if (cnNo.includes(obj.docketNumber)) {
          // If there are container details, add them to the containerDetailArray
          if (obj.containerDetail && obj.containerDetail.length > 0) {
            containerDetailArray.push({
              docketNumber: obj.docketNumber,
              containerDetail: obj.containerDetail,
            });
          }
        }
      });

      return containerDetailArray;
    };

    // Get containerDetail for the given cnNoArray
    const resultContainerDetail = getContainerDetailByCnNo(docketList, docket);
    const containersArray = resultContainerDetail.flatMap(container => container.containerDetail);
    this.tableData = containersArray;


  }
  save() {
    let containers = this.tableData
    .filter((x) => x.isSelected)
    .map((container) => ({
      ...container,
      rakeNo: this.data.rakeDetails.RakeNo, // Replace with the actual value
      update: this.data.flag === 'Diverted For Export',
      del: this.data.flag === 'Delivered',
      dexport: this.data.flag === 'Updated'
    }));
    const rakeDetails=this.rakeEntryService.addRakeContainer(containers);
    if(rakeDetails){
    Swal.fire({
      icon: "success",
      title: "Update Successfully",
      text: "Rake No: " + this.data.rakeDetails.RakeNo,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.goBack('Rake');
      }
    });
  }
  }

}
