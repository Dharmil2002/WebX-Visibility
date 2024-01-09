import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { AdviceAcknowledgeControl } from 'src/assets/FormControls/Finance/AdviceAcknowledge/adviceacknowledgecontrol';

@Component({
  selector: 'app-advice-acknowledge',
  templateUrl: './advice-acknowledge.component.html',
})
export class AdviceAcknowledgeComponent implements OnInit {

  AcknowledgeTableForm: UntypedFormGroup;
  jsonControlAdviceAcknowledgeArray: any;
  submit = 'Save';
  AcknowledgeFormControls: AdviceAcknowledgeControl;
  action: string;
  breadScrums = [{}];
  isUpdate = false;

  constructor( private fb: UntypedFormBuilder,
    private route: Router,) {
      const extrasState = this.route.getCurrentNavigation()?.extras?.state;
      this.isUpdate = false;
      this.action = extrasState ? "edit" : "add";
      if (this.action === "edit") {
        this.isUpdate = true;
        this.submit = "Modify";
        this.breadScrums = [
          {
            title: "Modify AdviceAcknowledge",
            items: ["Finance"],
            active: "Modify AdviceAcknowledge",
            generatecontrol: true,
          },
        ];
      } else {
        this.breadScrums = [
          {
            title: "Advice Acknowledge",
            items: ["Finance"],
            active: "Advice Acknowledge",
            generatecontrol: true,
            toggle: false,
          },
        ];
        //this.userTable = new UserMaster({});
      }
      this.initializeFormControl();
     }

  ngOnInit(): void {
  }

  initializeFormControl() {
    this.AcknowledgeFormControls = new AdviceAcknowledgeControl();
    // Get form controls for Driver Details section
    this.jsonControlAdviceAcknowledgeArray =
      this.AcknowledgeFormControls.getFormControls();
    // Build the form group using formGroupBuilder function
    this.AcknowledgeTableForm = formGroupBuilder(this.fb, [
      this.jsonControlAdviceAcknowledgeArray,
    ]);
  }

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.AcknowledgeTableForm.controls["isActive"].setValue(event);
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
