import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { th } from 'date-fns/locale';
import { Observable, map, startWith } from 'rxjs';
import { BranchDropdown } from 'src/app/Models/Comman Model/CommonModel';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StoreKeys } from 'src/app/config/myconstants';
import { AuthService } from 'src/app/core/service/auth.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-virtual-login',
  templateUrl: './virtual-login.component.html',
  styleUrls: ['./virtual-login.component.sass']
})
export class VirtualLoginComponent implements OnInit {

  userLocations = "";
  VitualLoginForm: UntypedFormGroup;
  BranchDropdown: BranchDropdown[];
  filteredBranch: Observable<BranchDropdown[]>;

  constructor(
    private storageService: StorageService,
    private locationService: LocationService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AuthService>
  ) {
    this.userLocations = this.storageService.getItem(StoreKeys.LoginLocations);
    this.VitualLoginForm = this.VitualLoginParameterForm();
  }

  ngOnInit(): void {
    this.GetBranchDetails();
  }

  VitualLoginParameterForm(): UntypedFormGroup {
    return this.fb.group({
      Branch: ['', [Validators.required, autocompleteObjectValidator()]],
    });
  }

  async GetBranchDetails() {
    let location = [];
    if(this.userLocations && this.userLocations != "") {
      location = JSON.parse(this.userLocations);
      this.BranchDropdown = location.map((x) => { return { locCode: x.locCode, locName: x.locName, location: `${x.locCode} : ${x.locName}`, CountryId: 0 } })
      this.BranchFilter()
    }
  }

  BranchFilter() {
    this.filteredBranch = this.VitualLoginForm.controls[
      "Branch"
    ].valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.name)),
      map((name) =>
        name ? this._filterBranch(name) : this.BranchDropdown
      )
    );
  }

  _filterBranch(term: string): BranchDropdown[] {
    const filterValue = term.toLowerCase();

    return this.BranchDropdown.filter(
      (option) => option.location.toLowerCase().includes(filterValue)
    );
  }

  displayBranch(Branch: BranchDropdown): string {
    return Branch && Branch.location ? Branch.location : "";
  }

  Onsubmit() {
    this.storageService.setItem(StoreKeys.Branch, this.VitualLoginForm.value.Branch.locCode);    
    this.locationService.getLocation( { companyCode: this.storageService.companyCode, locCode: this.storageService.branch } )
    .then((loc) => {
      this.storageService.setItem(StoreKeys.WorkingLoc, JSON.stringify(loc));
      this.dialogRef.close();
      location.reload();
    });
  }

}
