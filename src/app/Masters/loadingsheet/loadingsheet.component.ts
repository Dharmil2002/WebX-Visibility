import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { Observable, map, startWith } from 'rxjs';
import { AutoCompleteCity, DyanmicControl } from 'src/app/core/models/Cnote';
import { DatePipe } from '@angular/common';
import { getArrayAfterMatch } from 'src/app/Utility/commonfunction';
@Component({
  selector: 'app-loadingsheet',
  templateUrl: './loadingsheet.component.html'
})
export class LoadingsheetComponent {
  jsonUrl = '../../../assets/data/tableDataSmaple.json'
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  formGrop:FormGroup;
  orgBranch:string=localStorage.getItem("Branch");
  
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < (column name) : Column name you want to display on table > 
  columnHeader = {
    "checkBoxRequired": "",
    "Docket": "Docket Dest Loc",
    "link": "Count",
    "TotalPackage": "TotalPackage",
    "TotalWeight": "TotalWeight",
    "TotalCFT": "TotalCFT",
    "VehicleCapacity": "VehicleCapacity",
  }
  filteredcharge: Observable<AutoCompleteCity[]>;
  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ['checkBoxRequired']
  }
  //#endregion
  
  IscheckBoxRequired: boolean;
  addAndEditPath:string;
  selectItems:DyanmicControl[];
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "Loading Sheet",
      items: ["Masters"],
      active: "Loading Sheet",
    },
  ]
  index: number;
  csv: any;
  ruteDetails: any;
  myArray: any;
  headerForCsv = {
    "Docket": "Docket Dest Loc",
    "Count": "Count",
    "TotalPackage": "TotalPackage",
    "TotalWeight": "TotalWeight",
    "TotalCFT": "TotalCFT",
    "VehicleCapacity": "VehicleCapacity"
  }
  constructor(private http: HttpClient,private fb: UntypedFormBuilder,private ICnoteService: CnoteService) {
    // super();
    this.IscheckBoxRequired = true;
    this.formGrop = this.createUserForm()
    this.addAndEditPath='/Masters/Docket/LoadingSheetDetails'
    
  }
  ngOnInit(): void {
    this.index=0;
    this.selectItems = [
      { label: 'RouteCode',Name:"ruteCode",type:"autodropdown",Search:"",ActionFunction:"routeScheDule",autocomplete:'', filteredcommon:this.filteredcharge},
      { label: 'RouteSchedule',Name:"RouteSchedule",type:"text",Search:"",ActionFunction:"",autocomplete:'',filteredcommon: this.filteredcharge }
    ];
   this.routeDetails();
  
 //this.routeDetails();
  }
  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      companyCode: [parseInt(localStorage.getItem("companyCode"))],
      ruteCode: [''],
      RouteSchedule: ['']

    });
  }
// Call the appropriate function based on the given function name
    callActionFunction(functionName: string, event: any) {
      switch (functionName) {
        case "routeScheDule":
        this.getRouteDetails();
          break;

      }
    }
  
    routeDetails() {
  
      try {
        // Creates the request object to be sent to the API endpoint
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
        };

        // Makes the API call to fetch the Consignor City
        this.ICnoteService.cnoteNewPost("docket/getRoutedropdown", req).subscribe({
          next: (res: any) => {
            if (res) {
              this.ruteDetails = res;
              this.getRuteFilter();
            } else {
              SwalerrorMessage("error", "No Data Found", "", true);
            }
          },
        });
      } catch (err) {
        SwalerrorMessage("error", "Please  Try Again", "", true);
      }
  } 
  getRouteDetails(){
  
    try {
      // Creates the request object to be sent to the API endpoint
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ruteCode:this.formGrop.value?.ruteCode.Value||''
      };

      // Makes the API call to fetch the Consignor City
      console.log(req);
      this.ICnoteService.cnotePost("docket/getRouteDetails", req).subscribe({
        next: (res: any) => {
          if (res) {
            const currentDate = new Date();
            const formattedDate = new DatePipe('en-US').transform(currentDate, 'd MMM y');
            let response= res?(res.Rutcd+":"+formattedDate +":" +new Date(res.Sch_Time).toLocaleTimeString()):''
            this.formGrop.controls['RouteSchedule'].setValue(response);
            this.formGrop.controls['RouteSchedule'].disable();
          } else {
            SwalerrorMessage("error", "No Data Found", "", true);
          }
        },
      });
    } catch (err) {
      SwalerrorMessage("error", "Please  Try Again", "", true);
    }
  } 

  //CityApi
  getRuteFilter() {
    // Loop through the CnoteData array to set up autocomplete options for each form field
    for (const element of this.selectItems) {
      const { Name } = element;
      let filteredOptions: Observable<AutoCompleteCity[]>;
      let autocomplete = '';

      switch (Name) {
        // Set up autocomplete options for the FCITY form field
        case 'ruteCode':
          if (this.ruteDetails) {
            autocomplete = 'ruteCode';
            filteredOptions = this.formGrop.controls.ruteCode.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._ruteFilter(Name, this.ruteDetails) : this.ruteDetails.slice())
            );
          }
          break;
      }

      element.autocomplete = autocomplete;
      element.filteredcommon=filteredOptions;
    }
  }

  _ruteFilter(name: string, rute: AutoCompleteCity[]): AutoCompleteCity[] {
    const filterValue = name.toLowerCase();
    return rute.filter(
      (option) => option.Name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displaycommonFn(Cnotegrop: AutoCompleteCity): string {
    return Cnotegrop && Cnotegrop.Value ? Cnotegrop.Value + ":" + Cnotegrop.Name: "";
  }
  getDetails(){
    let ruteHlocation= this.formGrop.value?.ruteCode.Name.split("-");
    let routeRlocation= getArrayAfterMatch(ruteHlocation,this.orgBranch);
    try {
      // Creates the request object to be sent to the API endpoint
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        rutCd:routeRlocation||[],
        ORGNCD:this.orgBranch.trim()
      };
    
      // Makes the API call to fetch the Consignor City
      this.ICnoteService.cnoteNewPost("docket/getRouteWiseDocketDetails", req).subscribe({
        next: (res: any) => {
          if (res) {
              this.index = 1;
              const countsObj = res.reduce((acc, obj) => {
                const key = obj.DESTCD;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {});
              this.myArray = Object.keys(countsObj).map(key => {
                const filteredObjects = res.filter(obj => obj.DESTCD === key);
                const totalPackage = filteredObjects.reduce((acc, obj) => acc + obj.PKGSNO, 0);
                const totalWeight = filteredObjects.reduce((acc, obj) => acc + obj.ACTUWT, 0);
                const totalCFT = filteredObjects.reduce((acc, obj) => acc + obj.CHRGWT, 0);
                return {
                  Docket: key,
                  link: countsObj[key],
                  TotalPackage: totalPackage,
                  TotalWeight: totalWeight,
                  TotalCFT: totalCFT,
                  VehicleCapacity:''
                };
              });
              this.data = this.myArray;
              this.csv = this.data;
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

  Showlist() {
  
    this.getDetails();
  }
  /* return locations on the route which comes after origin branch  */

}
