import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CompanyControl } from 'src/assets/FormControls/CompanyControl';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html'
})
export class AddCompanyComponent implements OnInit {
  CompanyFormControls: CompanyControl;
  jsonControlCompanyArray: any;
  jsonControlBankArray: any;
  accordionData: any;
  AddCompanyFormsValue: UntypedFormGroup;
  Source_Company: any;
  SourceCompany: any;
  TimezoneId: any;
  TimeZone: any;
  Color_Theme: any;
  ColorTheme: any;
  visible: any;
  fafIcondata: string = 'fas fa-alien'
  Icondata: string = 'download'
  breadscrums = [
    {
      title: "Company Setup",
      items: ["Home"],
      active: "Company Setup",
    },
  ];
  data: any;
  TimeZoneDet: any;
  Theme: any;
  Themedata: any;
  Timezonedata: any;
  selectedFiles: boolean;
  SelectFile: File;
  imageName: string;
  constructor(private service: utilityService, private fb: UntypedFormBuilder, private masterService: MasterService,
    private filter: FilterUtils,
  ) { }

  ngOnInit(): void {
    this.masterService.getJsonFileDetails('companyJsonUrl').subscribe(res => {
      this.data = res.CompanyDet[0];
      this.TimeZoneDet = res.TimeZone[0];
      this.Theme = res.Theme[0];
      this.initializeFormControl();
      this.autoBindDropdown();
    }
    );
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.CompanyFormControls = new CompanyControl(this.data);

    // Get form controls for Company Details section
    this.jsonControlCompanyArray = this.CompanyFormControls.getFormControlsC();
    this.jsonControlCompanyArray.forEach(data => {
      if (data.name === 'Source_Company') {
        // Set SourceCompany-related variables
        this.Source_Company = data.name;
        this.SourceCompany = data.additionalData.showNameAndValue;
      }
    });
    // Get form controls for TimeZone, ColorTheme
    this.jsonControlBankArray = this.CompanyFormControls.getFormControlB();
    this.jsonControlBankArray.forEach(data => {
      if (data.name === 'TimezoneId') {
        // Set TimeZone-related variables
        this.TimezoneId = data.name;
        this.TimeZone = data.additionalData.showNameAndValue;
      }
      if (data.name === 'Color_Theme') {
        // Set ColorTheme-related variables
        this.Color_Theme = data.name;
        this.ColorTheme = data.additionalData.showNameAndValue;
      }
    });

    if (!this.visible) {
      this.jsonControlCompanyArray = this.jsonControlCompanyArray.filter((x) => x.name != 'Source_Company');
    }
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Company Details": this.jsonControlCompanyArray,
      "Bank Details": this.jsonControlBankArray,
    };

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AddCompanyFormsValue = formGroupBuilder(this.fb, Object.values(this.accordionData));
    this.AddCompanyFormsValue.controls["Brand"].setValue('V');

  }
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
  autoBindDropdown() {
    this.Timezonedata = this.TimeZoneDet.find((x) => x.value == this.data.identifier);
    this.AddCompanyFormsValue.controls.TimezoneId.setValue(this.Timezonedata);
    this.Themedata = this.Theme.find((x) => x.name == this.data.CompanyTheme);
    this.AddCompanyFormsValue.controls.Color_Theme.setValue(this.Themedata);
    this.filter.Filter(
      this.jsonControlBankArray,
      this.AddCompanyFormsValue,
      this.TimeZoneDet,
      this.TimezoneId,
      this.TimeZone,
    );
    this.filter.Filter(
      this.jsonControlBankArray,
      this.AddCompanyFormsValue,
      this.Theme,
      this.Color_Theme,
      this.ColorTheme,
    );
  }
  selectedFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.AddCompanyFormsValue.controls["Company_Image"].setValue(this.SelectFile.name);
      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }

  downloadfile() {
    let link = document.createElement("a");
    link.download = "DefaultChartOfAccount";
    link.href = "assets/Download/Default_ChartOfAccount.xlsx";
    link.click();
  }
  save() {
    this.AddCompanyFormsValue.controls["Color_Theme"].setValue(this.AddCompanyFormsValue.value.Color_Theme.value);
    this.AddCompanyFormsValue.controls["TimezoneId"].setValue(this.AddCompanyFormsValue.value.TimezoneId.value);
    this.service.exportData(this.AddCompanyFormsValue.value);
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `Data Downloaded successfully!!!`,
      showConfirmButton: true,
    });
  }
  cancel() {
    window.history.back();
  }
}
