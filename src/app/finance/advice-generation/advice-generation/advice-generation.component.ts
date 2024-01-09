import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { AdviceGenerationControl } from "src/assets/FormControls/Finance/AdviceGeneration/advicegenerationcontrol";

@Component({
  selector: "app-advice-generation",
  templateUrl: "./advice-generation.component.html",
})
export class AdviceGenerationComponent implements OnInit {
  AdviceTableForm: UntypedFormGroup;
  jsonControlAdviceGenerationArray: any;
  submit = "Save";
  AdviceFormControls: AdviceGenerationControl;
  action: string;
  breadScrums = [{}];
  isUpdate = false;
  constructor(private fb: UntypedFormBuilder, private route: Router) {
    const extrasState = this.route.getCurrentNavigation()?.extras?.state;
    this.isUpdate = false;
    this.action = extrasState ? "edit" : "add";
    if (this.action === "edit") {
      this.isUpdate = true;
      this.submit = "Modify";
      this.breadScrums = [
        {
          title: "Modify AdviceGeneration",
          items: ["Finance"],
          active: "Modify AdviceGeneration",
          generatecontrol: true,
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Advice Generation",
          items: ["Finance"],
          active: "Advice Generation",
          generatecontrol: true,
          toggle: false,
        },
      ];
      //this.userTable = new UserMaster({});
    }
    this.initializeFormControl();
  }

  ngOnInit(): void {}

  initializeFormControl() {
    this.AdviceFormControls = new AdviceGenerationControl();
    // Get form controls for Driver Details section
    this.jsonControlAdviceGenerationArray =
      this.AdviceFormControls.getFormControls();
    // Build the form group using formGroupBuilder function
    this.AdviceTableForm = formGroupBuilder(this.fb, [
      this.jsonControlAdviceGenerationArray,
    ]);
  }

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.AdviceTableForm.controls["isActive"].setValue(event);
    // console.log("Toggle value :", event);
  }

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

  save() {}
}
