import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Cnote } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
@Component({
  selector: 'app-cnote-generation',
  templateUrl: './cnote-generation.component.html'

})
export class CNoteGenerationComponent implements OnInit {
  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;
  CnoteData: Cnote[];
  option: any;
  breadscrums = [
    {
      title: "CNoteGeneration",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ]
  step1Formcontrol: Cnote[];
  step2Formcontrol: Cnote[];
  step3Formcontrol: Cnote[];
  constructor(private fb: UntypedFormBuilder, private ICnoteService: CnoteService) {
    //  this.CnoteData = CNOTEDATA;
    this.GetCnotecontrols();
  }

  ngOnInit(): void {

  }

  step1Formgrop(): UntypedFormGroup {
    const formControls = {};
    this.step1Formcontrol = this.CnoteData.filter((x) => x.formgrp == 'step-1')
    if (this.step1Formcontrol.length > 0) {
      this.step1Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.validation === 'Required') {
          validators = [Validators.required];
        }
        formControls[cnote.name] = this.fb.control('', validators);
        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });
      return this.fb.group(formControls)
    }

  }
  step2Formgrop(): UntypedFormGroup {
    const formControls = {};
    this.step2Formcontrol = this.CnoteData.filter((x) => x.formgrp == 'step-2')
    if (this.step2Formcontrol.length > 0) {
      this.step2Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.validation === 'Required') {
          validators = [Validators.required];
        }
        formControls[cnote.name] = this.fb.control('', validators);
        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });
      return this.fb.group(formControls)
    }

  }
  step3Formgrop(): UntypedFormGroup {
    const formControls = {};
    this.step3Formcontrol = this.CnoteData.filter((x) => x.formgrp == 'step-3')
    if (this.step3Formcontrol.length > 0) {
      this.step3Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.validation === 'Required') {
          validators = [Validators.required];
        }
        formControls[cnote.name] = this.fb.control('', validators);
        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });
      return this.fb.group(formControls)
    }

  }
  callActionFunction(functionName: string, event: any) {

    switch (functionName) {
      case "apicall":
        this.apicall(event);
        break;
      //  case"disbled":
      //  this.CnoteForm.controls['CNoteNo'].disable();
      // Add additional cases as needed
      default:
        break;
    }

  }
  apicall(event) {

    console.log(event);
    console.log(this.step1.value);
  }
  GetCnotecontrols() {

    this.ICnoteService.GetCnoteFormcontrol().subscribe(
      {
        next: (res: any) => {
          if (res) {
            this.CnoteData = res;
            this.CnoteData.sort((a, b) => (a.Seq - b.Seq));
            this.step1 = this.step1Formgrop();
            this.step2 = this.step2Formgrop();
            this.step3= this.step3Formgrop();
          }

        },
        error:
          (error) => {
          },
      });
  }
}
