import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FormControls } from 'src/app/core/models/FormControl/formcontrol';
import { ServiceSelection } from 'src/assets/FormControls/VendorContractControls/ServiceSelection';

@Component({
  selector: 'app-service-selection',
  templateUrl: './service-selection.component.html'
})
export class ServiceSelectionComponent implements OnInit {
  MatrixType: FormControls[];
  MovementBy: FormControls[];
  MatrixTypeName: string;
  MatrixTypeValue: string;
  ControlArray: ServiceSelection;
  MatrixTypeCriteriaForm: any;
  MovementByCriteriaForm: any;

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.createCriteriaForm()
  }

  createCriteriaForm() {
    // Create an object to store initial values for each control
    this.ControlArray = new ServiceSelection();
    this.MatrixType = this.ControlArray.getMatrixTypeControl()
    this.MatrixType.forEach((data)=>{
      if (data.name === "MatrixType") {
        this.MatrixTypeName = data.name;
        this.MatrixTypeValue = data.additionalData.showNameAndValue;
      }
    })
    this.MovementBy = this.ControlArray.getMovementByControl()
    this.MatrixTypeCriteriaForm = formGroupBuilder(this.fb,[this.MatrixType]);
    this.MovementByCriteriaForm = formGroupBuilder(this.fb,[this.MovementBy]);

    
  }
}
