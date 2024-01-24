import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/service/storage.service';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { timeString } from 'src/app/Utility/date/date-utils';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { RakeEntryService } from 'src/app/Utility/module/operation/rake-entry/rake-entry-service';
import { HandoverControl } from 'src/assets/FormControls/hand-over-control';
import Swal from 'sweetalert2';
import { HandedOverUploadComponent } from './handed-over-upload/handed-over-upload.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-handed-over',
  templateUrl: './handed-over.component.html'
})
export class HandedOverComponent implements OnInit {
  HandFormControls: HandoverControl;
  jsonControlArray: any;
  csvFileName = ""
  handTableForm: UntypedFormGroup;
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    cNID: {
      Title: "Container No",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    cNTYPNM: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    isEMPT: {
      Title: "Is Empty",
      class: "matcolumncenter",
      Style: "min-width:200px",
    }
  }
  csvHeader = {
    "cNID": "ContainerNo",
    "cNTYPNM": "ContainerType",
    "isEMPT": "IsEmpty",
    "containerFor": "ContainerFor"
  }
  staticField = [
    "cNID",
    "cNTYPNM",
    "isEMPT"
  ]
  breadScrums = [
    {
      title: "Diverted For Export",
      items: ["Home"],
      active: "Diverted For Export",
    },
  ];
  metaData = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: true
  };
  tableData = [];
  tableLoad: boolean = true;
  data: any;
  isSelected: boolean;
  containerFor: AutoComplete[];
  uploadComponent = HandedOverUploadComponent;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private rakeEntryService: RakeEntryService,
    private generalService: GeneralService,
    private dialog: MatDialog

  ) {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;
    if (navigationState) {
      this.breadScrums[0].title = navigationState.flag
      this.breadScrums[0].active = navigationState.flag
    }
    this.csvFileName = `containerDetails-${timeString}`;
    this.data = navigationState?.data || "";
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
    this.handTableForm.controls['locationCode'].setValue(this.storage?.branch || "");
    this.handTableForm.controls['rktUptDt'].setValue(this.data?.oRakeEntryDate || "");
    this.getShipmentDetails();
    this.getGeneralMasterData();
  }
  async getGeneralMasterData() {
    this.containerFor = await this.generalService.getGeneralMasterData("CONTFOR");
    setGeneralMasterData(this.jsonControlArray, this.containerFor, "containerFor");
  }
  cancel() {
    this.goBack('Rake');
  }
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  onSelectAllClicked(){
    this.isSelected = this.tableData.some((x) => x.isSelected == true);
  }
  async getShipmentDetails() {
    try {
      // Extracting 'name' from objects in data.cnNos that have both 'code' and 'name' properties
      const shipmentNos = this.data.cnNos.flatMap((x) => x).filter(item => typeof item === 'object' && item.code && item.name)
        .map(item => item.name);
      // Preparing a filter for the docket query
      const rakeFilter = { rAKENO: this.data.RakeNo, dKTNO: { D$in: shipmentNos }, cONTFORCD:{D$ne:"CONTFOR-0003"} };
      // Fetching docket data based on the filter
      // const docketList = await this.rakeEntryService.fetchData('docket_containers', {
      //   cID: this.storage.companyCode,
      //   ...docketFilter
      // });
      const rakeStatus = await this.rakeEntryService.fetchData('container_status', {
        cID: this.storage.companyCode,
        ...rakeFilter
      });
      // Check if data exists and update table data
      if (rakeStatus?.data) {
        this.tableData = rakeStatus.data;

        // Display a message if no containers are available
        if (!this.tableData.length) {
          Swal.fire({
            icon: 'info',
            title: 'Information',
            text: 'No containers are currently available.',
            confirmButtonText: 'Okay'
          });
        }
      }
    } catch (error) {
      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
        footer: '<a href="">Need help? Contact us</a>'
      });
    }
  }
  selectValue() {
    this.isSelected = this.tableData.some((x) => x.isSelected == true);
  }
  // async getContainerData(data){
  //   const data = 
  // }

  async save() {
    let selectedContainers = this.tableData
      .filter(x => x.isSelected)
      .map(container => container.cNID);
     const containerFor=this.containerFor.find(x=>x.value==this.handTableForm.value.containerFor)?.name||"";
    const data = {
      cONTFORCD: this.handTableForm.value.containerFor,
      cONTFORNM: containerFor,
      oRG: this.storage.branch,
      dEST: "",
      sTS: 1,
      sTSNM: "Available",
      mODDT: new Date(),
      mODLOC: this.storage.branch,
      mODBY: this.storage.userName,
      dKTNO: "",
      rAKENO: ""
    }
    
    const rakeDetails = await this.rakeEntryService.updateRakeContainer(data, { cNID: { 'D$in': selectedContainers }, cID: this.storage.companyCode, rAKENO: this.data.RakeNo }, "container_status");
   if(this.tableData.length==selectedContainers.length){
    const rakeStatus = {
      sTS: 2,
      oSTSN: "RakeUpdated",
    }
    await this.rakeEntryService.updateRakeContainer(rakeStatus, { docNo: this.data?.RakeNo||"", cID: this.storage.companyCode}, "rake_headers");
  }
    if (rakeDetails) {
      Swal.fire({
        icon: "success",
        title: "Update Successfully",
        text: "Rake No: " + this.data.RakeNo,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.goBack('Rake');
        }
      });
    }
  }
  //#region to call upload function
  upload() {

    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        const firstContainerFor = result[0]?.ContainerFor;
        // Find the matching container from the array based on the result's ContainerFor
        const matchingContainer = this.containerFor.find(container => container.name === firstContainerFor);
        // Safely set the form control value using the found container's value, if available
        let count = 0;
        this.handTableForm.controls['containerFor'].setValue(matchingContainer?.value ?? null);
        // Optimized loop to reduce redundant checks
        this.tableData.forEach(rowData => {
          const isMatched = result.some(element =>
            rowData.cNID === element.ContainerNo && element.ContainerFor === firstContainerFor
          );
          rowData.isSelected = isMatched;
          if (!isMatched) {
            count++;
          }
        });

        // Show popup if more than one container is not selected
        if (count > 0) {
          alert("You cannot select more than one container at the same time.");
        }

      }
      //this.getLocationDetails();
    });
  }
}
