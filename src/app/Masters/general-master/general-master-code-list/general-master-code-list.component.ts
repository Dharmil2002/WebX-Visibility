import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { GeneralMasterAddComponent } from '../general-master-add/general-master-add.component';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-general-master-code-list',
  templateUrl: './general-master-code-list.component.html',
})
export class GeneralMasterCodeListComponent {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  companyCode: any = 0;
  addAndEditPath: string;
  csvFileName: any;
  headerCode: string;
  columnHeader = {
    srNo: {
      Title: "Sr No",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    codeId: {
      Title: "Code ID",
      class: "matcolumnleft",
      Style: "max-width:150px",
      datatype: "string"
    },
    codeDesc: {
      Title: "Description",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    activeFlag: {
      type: "Activetoggle",
      Title: "Active",
      class: "matcolumncenter",
      Style: "min-width:80px; max-width:80px",
      functionName: "IsActiveFuntion",
    },
    view: {
      Title: "Edit",
      class: "matcolumncenter",
      Style: "min-width:80px; max-width:80px;",
      iconName: "edit",
      stickyEnd: true,
    }
  };
  staticField = ["srNo", "codeId", "codeDesc"];
  headerForCsv = {
    srNo: "Sr No",
    codeId: "Code ID",
    codeDesc: "Description",
    activeFlag: "Active Status",
  }
  breadScrums = [
    {
      title: this.route.getCurrentNavigation()?.extras?.state?.data.headerDesc + "General Master",
      items: ["Home"],
      active: this.route.getCurrentNavigation()?.extras?.state?.data.headerDesc + "General Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  }
  viewComponent: any;
  height = '300px';
  width = '600px';
  backPath: string;
  constructor(private masterService: MasterService, private cdr: ChangeDetectorRef, private route: Router, private storage: StorageService) {
    this.companyCode = this.storage.companyCode;
    if (this.route.getCurrentNavigation()?.extras?.state?.data != null) {

    } this.data = route.getCurrentNavigation().extras.state.data;
  }
  onDialogClosed(result) {
    if (typeof result == 'string') {
      this.data.headerCode = result;
    } else {
      this.data.headerCode = result.codeType;
    }
    this.cdr.detectChanges();
    if (result != undefined) {
      this.getGeneralDetails();
    }
  }
  ngOnInit(): void {
    this.getGeneralDetails();
    //this.addAndEditPath = "/Masters/GeneralMaster/AddGeneralMaster";
    this.headerCode = this.data?.headerCode;
    this.viewComponent = GeneralMasterAddComponent;
    this.csvFileName = `${this.headerCode}.csv`
  }
  getGeneralDetails() {
    // Assuming tableData contains the array of objects
    let req = {
      companyCode: this.storage.companyCode,
      "collectionName": "General_master",
      "filter": {
        "codeType": this.data?.headerCode
      }
    };
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          this.masterService.setValueheaderCode(this.data?.headerCode);
          // Generate srno for each object in the array
          const dataWithSrno = res.data?.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          this.csv = dataWithSrno;
          this.tableLoad = false;
        }
      }
    });
  }

  async IsActiveFuntion(det) {
    let id = det.data._id;
    // Remove the "id" field from the form controls
    delete det.data._id;
    delete det.data.srNo;
    let req = {
      companyCode: this.storage.companyCode,
      type: "masters",
      collectionName: "General_master",
      filter: { _id: id },
      update: { activeFlag: det.data.activeFlag }
    };
    this.masterService.masterPut('generic/update', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.getGeneralDetails();
        }
      }
    });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

}
