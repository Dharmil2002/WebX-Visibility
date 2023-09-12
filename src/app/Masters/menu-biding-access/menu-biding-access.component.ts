import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { menuAccesDropdown } from 'src/app/Models/Comman Model/CommonModel';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MenuAccessControl } from 'src/assets/FormControls/menu-access-mode';

@Component({
  selector: 'app-menu-biding-access',
  templateUrl: './menu-biding-access.component.html'
})
export class MenuBidingAccessComponent implements OnInit {
  menuAccessFrom: UntypedFormGroup;
  menuAccessFormControls: MenuAccessControl;
  filteredMenu: Observable<menuAccesDropdown[]>;
  jsonControlArray: any;
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<MenuBidingAccessComponent>,) {
    
    this.initializeFormControl();
  }

  ngOnInit() {
  }
  initializeFormControl() {
    // Create PincodeFormControls instance to get form controls for different sections
    this.menuAccessFormControls = new MenuAccessControl();
    // Get form controls for Cluster Details section
    this.jsonControlArray = this.menuAccessFormControls.getControls();
    // Build the form group using formGroupBuilder function and the values of jsonControlArray
    this.menuAccessFrom = formGroupBuilder(this.fb, [this.jsonControlArray]);
    //for set static dropdown
   
}
functionCallHandler($event) {
  // console.log("fn handler called" , $event);
  let field = $event.field;                   // the actual formControl instance
  let functionName = $event.functionName;     // name of the function , we have to call

  // function of this name may not exists, hence try..catch 
  try {
      this[functionName]($event);
  } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
  }
}
  save() {
     localStorage.setItem("Mode",this.menuAccessFrom.value.Mode);
    location.reload();
  }


}
