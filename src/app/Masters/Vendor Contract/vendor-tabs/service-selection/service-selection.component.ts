import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FormControls } from 'src/app/core/models/FormControl/formcontrol';
import { VendorContractControl } from 'src/assets/FormControls/VendorContractControls/VendorContractControls';

@Component({
  selector: 'app-service-selection',
  templateUrl: './service-selection.component.html'
})
export class ServiceSelectionComponent implements OnInit {
  MovementByControlArrayF: VendorContractControl;
  VendorContractCriteriaForm: any;
  MatrixType: FormControls[];
  MovementBy: FormControls[];
  MatrixTypeName: string;
  MatrixTypeValue: string;

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
  }

  createCriteriaForm() {
    // Create an object to store initial values for each control
    this.MovementByControlArrayF = new VendorContractControl();
    this.MatrixType = this.MovementByControlArrayF.ServiceMatrixTypeControlArray
    this.MatrixType.forEach((data)=>{
    if(data.name == ''){
      this.MatrixTypeName = data.name
      this.MatrixTypeValue = data.name
    }
    })
    this.MovementBy = this.MovementByControlArrayF.MovementByControlArray
    this.VendorContractCriteriaForm=formGroupBuilder(this.fb,[this.MatrixType , this.MovementBy]);
    
  }
}
