import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CompanyControl } from 'src/assets/FormControls/CompanyControl';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
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
  constructor(private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils
  ) { }

  ngOnInit(): void {
    this.getCompanyDet();
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
      if (data.name === 'timeZone') {
        // Set TimeZone-related variables
        this.TimezoneId = data.name;
        this.TimeZone = data.additionalData.showNameAndValue;
      }
      if (data.name === 'color_Theme') {
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
    this.AddCompanyFormsValue.controls["brand"].setValue(this.data?.brand);
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
  // Function to automatically bind dropdown values from JSON file
  autoBindDropdown() {
    this.masterService.getJsonFileDetails('companyJsonUrl').subscribe(res => {
      // Set TimeZoneDet and Theme variables from the JSON response
      this.TimeZoneDet = res.TimeZone[0];
      this.Theme = res.Theme[0];
      // Find the matching timeZone value in TimeZoneDet and set it in the form control
      this.Timezonedata = this.TimeZoneDet.find((x) => x.value == this.data.timeZone);
      this.AddCompanyFormsValue.controls.timeZone.setValue(this.Timezonedata);
      // Find the matching color_Theme value in Theme and set it in the form control
      this.Themedata = this.Theme.find((x) => x.value == this.data.color_Theme);
      this.AddCompanyFormsValue.controls.color_Theme.setValue(this.Themedata);
      // Call the Filter function with specific parameters to filter the data
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
    );

  }
  // Function to handle file selection in the form
  selectedFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        // If the file format is allowed, update the form control with the selected file name
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.AddCompanyFormsValue.controls["company_Image"].setValue(this.SelectFile.name);
      } else {
        // If the file format is not allowed, display a warning message
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      // If no file is selected, display an alert
      this.selectedFiles = false;
      alert("No file selected");
    }
  }

  // Function to download a file
  downloadfile() {
    let link = document.createElement("a");
    link.download = "DefaultChartOfAccount";
    link.href = "assets/Download/Default_ChartOfAccount.xlsx";
    link.click();
  }

  // Function to save the form data
  save() {
    // Set the color_Theme and timeZone form control values using the selected values
    this.AddCompanyFormsValue.controls["color_Theme"].setValue(this.AddCompanyFormsValue.value.color_Theme.value);
    this.AddCompanyFormsValue.controls["timeZone"].setValue(this.AddCompanyFormsValue.value.timeZone.value);

    let id = this.AddCompanyFormsValue.value._id;
    // Remove the "id" field from the form controls
    this.AddCompanyFormsValue.removeControl("_id");

    // Prepare the request to update company details
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "company_detail",
      filter: { _id: id },
      update: this.AddCompanyFormsValue.value
    };

    // Call the API to update company details
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
        }
      }
    });
  }

  // Function to cancel and go back to the previous page
  cancel() {
    window.history.back();
  }

  // Function to get company details from the API
  getCompanyDet() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "collectionName": "company_detail",
      "filter": {}
    };

    // Call the API to get company details
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Set the retrieved data in the 'data' variable and initialize the form controls and bind dropdowns
          this.data = res.data[0];
          this.initializeFormControl();
          this.autoBindDropdown();
        }
      }
    });
  }

}
