import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { menifestControl } from './menifest';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
@Component({
  selector: 'app-manifest-generation',
  templateUrl: './manifest-generation.component.html',
})
export class ManifestGenerationComponent implements OnInit {
  jsonUrl = '../../../assets/data/loadSheetDetails.json'
  LoadingSheetForm: UntypedFormGroup
  jsonloadingSheetControls: FormControls[];
  loadingSheetControls: menifestControl;
  tableload = true;
  companyCode: any;
  BoxData: any[]
  breadscrums = [
    {
      title: "ManifestGeneration",
      items: ["ManifestGeneration"],
      active: "loadingSheet"
    }
  ]
  iconCard = [
    'fas fa-cart-plus float-start',
    'fas fa-business-time float-start',
    'fas fa-chart-line float-start',
    'fas fas fa-truck-pickup float-start'
  ]

  classDashboard = [
    'info-box7  bg-white order-info-box7',
    'info-box7 bg-white order-info-box7',
    'info-box7 bg-white order-info-box7',
    'info-box7 bg-white order-info-box7',
  ]
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < (column name) : Column name you want to display on table > 
  columnHeader = {
    "checkBoxRequired": "",
    "DKTNO": "Docket No",
    "CSGNNM": "Party Name",
    "ORGNCD": "Orginal Branch",
    "DESTCD": "Destionation Branch",
    "FROMLOC": "From Location",
    "TOLOC": "To Location",
    "PKGSNO": "No of Package",
    "ACTUWT": "Actual Weight(kg)",
    "CHRGWT": "Charge Weight(kg)"
  }
  headerForCsv = {
    "DKTNO": "Docket No",
    "party_name": "Party Name",
    "ORGNCD": "Orginal Branch",
    "DESTCD": "Destionation Branch",
    "FROMLOC": "From Location",
    "TOLOC": "To Location",
    "PKGSNO": "No of Package",
    "ACTUWT": "Actual Weight(kg)",
    "CHRGWT": "Charge Weight(kg)"
  }
  linkArray = [
  ]
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  menuItemflag: boolean = false;
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  loadingSheetNo: string;
  loadingSheetNoStatus: any;
  menifest: any;
  orgBranch: string = localStorage.getItem("Branch");
  data: any;
  toggleArray = [
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  IscheckBoxRequired: boolean;
  menifestDetails: any;
  dataDetails: any;
  constructor(private http: HttpClient, private fb: UntypedFormBuilder, private filter: FilterUtils, private ICnoteService: CnoteService) {
    this.InitializeFormControl();
    this.getMeniFestDetails();
    this.csvFileName = "";
    this.addAndEditPath = '';
    this.IscheckBoxRequired = true;
    this.drillDownPath = ''
  }

  ngOnInit(): void {
  }
  //#region this function listen to the values emitted by 'add-form-webxpress'
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#region  to initialize form Control
  InitializeFormControl() {
    /**
  * this function sets validation for different fields, dynamically.
  */

    this.loadingSheetControls = new menifestControl();

    this.jsonloadingSheetControls = this.loadingSheetControls.getFormControls();
    this.jsonloadingSheetControls.forEach(data => {
      if (data.name === 'loadingSheetNocontrolHandler') {
        // Set location-related variables
        this.loadingSheetNo = data.name;
        this.loadingSheetNoStatus = data.additionalData.showNameAndValue;
      }

    });
    this.LoadingSheetForm = formGroupBuilder(this.fb, [this.jsonloadingSheetControls]);

  }
  getMeniFestDetails() {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.menifest = res;
      let tableArray = this.menifest.loadingSheetDetails;
      let loadingSheetList = [];
      tableArray.forEach(element => {
        let dropdownList = {
          name: element.loadingSheetNumber,
          value: element.loadingSheetNumber
        }
        loadingSheetList.push(dropdownList)

      });

      this.filter.Filter(
        this.jsonloadingSheetControls,
        this.LoadingSheetForm,
        loadingSheetList,
        this.loadingSheetNo,
        this.loadingSheetNoStatus,
      );

    });
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }

  routeDetails() {
    let destCd = this.menifest.loadingSheetDetails.find((x) => x.loadingSheetNumber == this.LoadingSheetForm.value?.loadingSheetNo.value || '').unloadingBranchCode
    let docketNo = this.menifest.loadingSheetDetails.find((x) => x.loadingSheetNumber == this.LoadingSheetForm.value?.loadingSheetNo.value || '').docketIDs.split(',');
    try {
      // Creates the request object to be sent to the API endpoint
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        DESTCD: destCd,
        ORGNCD: this.orgBranch.trim()
      };

      // Makes the API call to fetch the getDocket DocketDetails by DescCode
      this.ICnoteService.cnotePost("docket/getDocketDocketDetailsbyDescCode", req).subscribe({
        next: (res: any) => {
          if (res) {
            this.data = res;
            this.data = this.data.filter((element) => {
              return docketNo.includes(element.DKTNO);
            });

            this.csv = this.data;
            this.nestedMenifestData(this.data)
            this.tableload = false;
          } else {
            SwalerrorMessage("error", "No Data Found", "", true);
          }
        },
      });
    } catch (err) {
      SwalerrorMessage("error", "Please  Try Again", "", true);
    }
  }
  nestedMenifestData(data) {
    this.menifestDetails = data;
    let loadingData = [];
    let PKGSNO = 0;
    let ACTUWT = 0;
    let CHRGWT = 0;
    this.menifestDetails.forEach(element => {
      PKGSNO += element.PKGSNO,
        ACTUWT += element.ACTUWT,
        CHRGWT += element.CHRGWT
    });
    let title = [
      { title: 'Docket', value: this.menifestDetails?.length || 0 },
      { title: 'No of Package', value: PKGSNO },
      { title: 'Actual Weight(kg)', value: ACTUWT },
      { title: 'Charge Weight(kg)', value: CHRGWT },
    ]
    title.forEach((element, index) => {
      let loadingSheetDetail = {
        title: element.title,
        count: element.value,
        class: this.classDashboard[index],
        icon: this.iconCard[index]
      }
      loadingData.push(loadingSheetDetail);
    });

    this.BoxData = loadingData
  }
  IsActiveFuntion(data) {
    this.dataDetails = data;
  }
  generateMenifest() {
    if (this.dataDetails && this.dataDetails.length > 0) {
      const randomNumber = "MF/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
      SwalerrorMessage("success", "MFNo:" + randomNumber, "", true);
    }
    else {
      SwalerrorMessage("error", "Please Select Atleast One", "", true);
    }
  }
}
