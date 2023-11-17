import { StorageService } from "./../../core/service/storage.service";
import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { QueryControl } from "src/assets/FormControls/View-Print-Controls/view-print-query-controls";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import Swal from "sweetalert2";
import { ViewPrint_Template } from "src/app/core/models/viewPrint/viewPrintTemplate";
import { AngularEditorModule } from "@kolkov/angular-editor";
const document: any = window.document;

@Component({
  selector: "app-view-print-template",
  templateUrl: "./view-print-template.component.html",
})
export class ViewPrintTemplateComponent implements OnInit {
  allData: {
    companyData: any;
  };
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isUpdate = false;
  breadScrums = [
    {
      title: "ViewPrint Template Page",
      items: ["ViewPrintTemplate"],
      active: "View-Print-Query-Page",
    },
  ];
  breadScrums1 = [
    {
      title: "Editor",
      items: ["ViewPrintTemplate"],
      active: "View-Print-Query-Page",
    },
  ];
  queryTableForm: UntypedFormGroup;
  viewPrintTableData: ViewPrint_Template;
  submit = "Save";
  queryFormControls: QueryControl;
  jsonControlqueryArray: any;
  companyDet: any;
  companyFData: any;
  queryTable: any;
  HtmlTemplate: any;
  isFullScreen: any;
  THCViewPrint = false;
  backgroundColor: string;
  name = "Angular 6";
  tHTML = "";

  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private storage: StorageService,
    private renderer: Renderer2, private elementRef: ElementRef
  ) {
    this.initializeFormControl();
    this.queryTableForm.controls["vTYPE"].setValue;
  }

  ngOnInit(): void {
  }

  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.queryFormControls = new QueryControl(
      this.viewPrintTableData,
      this.isUpdate
    );
    // Get form controls for Driver Details section
    this.jsonControlqueryArray =
      this.queryFormControls.getFormQueryControlArray();
    // Build the form group using formGroupBuilder function
    this.queryTableForm = formGroupBuilder(this.fb, [
      this.jsonControlqueryArray,
    ]);
    this.queryTableForm.controls['vTYPE'].setValue("");
  }
  config: AngularEditorModule = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  cancel() {}

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.queryTableForm.controls["isActive"].setValue(event);
    // console.log("Toggle value :", event);
  }

  async save() {
    const controls = this.queryTableForm;
    clearValidatorsAndValidate(controls);
    const id = `${this.storage.companyCode}-${this.queryTableForm.value.vTYPE}`;
    this.queryTableForm.controls["_id"].setValue(id);
    const Data ={
      ...this.queryTableForm.value,
      tHTML:this.tHTML
    }
    // const html = this.getDecodedHTML(this.queryTableForm.value.tHTML);
    // this.queryTableForm.controls["tHTML"].setValue(html);
     //API FOR ADD
    let req = {
      companyCode: this.companyCode,
      collectionName: "viewprint_template",
      data: Data,
    };
    const res = await this.masterService
      .masterPost("generic/create", req)
      .toPromise();
    if (res) {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
    this.queryTableForm.reset();
  }
  // getDecodedHTML(value: string): string {
  //   const decodedHtml = this.htmlEntities(value, true);
  //   return decodedHtml;
  // }
  //  htmlEntities(value: string, decode?: boolean): string {
  //   const element = document.createElement('div');
  //   if (decode) {
  //     element.innerHTML = value;
  //     return element.innerHTML;
  //   } else {
  //     element.appendChild(document.createTextNode(value));
  //     return element.innerHTML;
  //   }
  // }
  toggleFullscreen() {
    const element = this.elementRef.nativeElement.querySelector('.editor-container');

    if (!this.isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      this.backgroundColor = 'white'; // Change background color to black
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.backgroundColor = 'white'; // Change background color to white
    }

    this.isFullScreen = !this.isFullScreen;
  }
}
