import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SACControlList } from 'src/assets/FormControls/saccontrol';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';

@Component({
  selector: 'app-sac-master-list',
  templateUrl: './sac-master-list.component.html'
})
export class SacMasterListComponent implements OnInit {

  sacTableForm: UntypedFormGroup;
  jsonControlSACArray: any;
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["isActive"]
  linkArray = [];
  csvFileName: string;
  addAndEditPath: string;
  sacListFormControls: SACControlList
  columnHeader = {
    srNo: {
      Title: "Sr No",
      class: "matcolumnleft",
      Style: "max-width:80px",
    },
    TYP: {
      Title: "Type",
      class: "matcolumnleft",
      Style: "max-width:110px",
    },
    SHCD: {
      Title: "Service Code",
      class: "matcolumnleft",
      Style: "max-width:110px",
    },
    SNM: {
      Title: "Service Name",
      class: "matcolumnleft",
      Style: "max-width:830px; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-y: auto; max-height: 6em;",
    },
    GSTRT: {
      Title: "GST",
      class: "matcolumnleft",
      Style: "max-width:110px",
    },
    actions: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:110px",
    }
  };

  staticField = [
    "srNo",
    "TYP",
    "SHCD",
    "SNM",
    "GSTRT",
  ];

  headerForCsv = {
    // "srNo": "Sr No",
    "TYP": "Type",
    "SHCD": "Service Code",
    "SNM": "Service Name",
    "GSTRT": "GST %",
  }

  breadScrums = [
    {
      title: "SAC/HSN Master",
      items: ["Home"],
      active: "SAC/HSN Master",
    },
  ];

  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }

  constructor(
    public ObjSnackBarUtility: SnackBarUtilityService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService
  ) {
    this.addAndEditPath = "/Masters/SAC-HSNMaster/AddSAC-HSN";
    this.intializeFormControls();
  }

  //#region
  intializeFormControls() {
    // Initialize CityControl and get form controls
    this.sacListFormControls = new SACControlList();
    this.jsonControlSACArray = this.sacListFormControls.getListFormControls();
    // Build the form group
    this.sacTableForm = formGroupBuilder(this.fb, [this.jsonControlSACArray]);
  }
  //#endregion

  ngOnInit(): void {
    this.csvFileName = "SAC/HSN Details"
    this.getSacDetails();
  }

  //#region 
  async getSacDetails() {
    let req = {
      "collectionName": "sachsn_master",
      "filter": {}
    }
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    // Generate srno for each object in the array
    const dataWithSrno = res.data.map((obj, index) => {
      return {
        ...obj,
        srNo: index + 1
      };
    });
    this.csv = dataWithSrno;
    this.tableLoad = false;
  }
  //#endregion

  //#region 
  async save() {
    // Get values from the form
    const sactype = this.sacTableForm.controls['TYP'].value;
    // Prepare the request object for fetching data
    const request = {
      collectionName: "sachsn_master",
      filter: {}
    };
    try {
      // Fetch data from the server
      const response = await this.masterService.masterPost("generic/get", request).toPromise();
      // Check if the response contains data
      if (response && response.data && response.data.length > 0) {
        // Filter the data based on Type
        const filteredData = response.data.filter(obj => obj.TYP === sactype);
        if (filteredData.length > 0) {
          // Add serial numbers to the filtered data
          const dataWithSrno = filteredData.map((obj, index) => ({ ...obj, srNo: index + 1 }));
          this.csv = dataWithSrno;
          this.tableLoad = false;
        } else {
          // Show a notification if no data matches the criteria
          this.ObjSnackBarUtility.showNotification(
            'snackbar-danger',
            'No Data Found...!!!',
            'bottom',
            'center'
          );
          this.csv = [];
          this.tableLoad = false;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  //#endregion

  //#region 
  functionCallHandler($event) {
    // console.log("fn handler called", $event);
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
  //#endregion

}
