import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { th } from 'date-fns/locale';
import { Observable, map, startWith } from 'rxjs';
import { BranchDropdown } from 'src/app/Models/Comman Model/CommonModel';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { AuthService } from 'src/app/core/service/auth.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-virtual-login',
  templateUrl: './virtual-login.component.html',
  styleUrls: ['./virtual-login.component.sass']
})
export class VirtualLoginComponent implements OnInit {

  userLocations = localStorage.getItem("userLocations");
  VitualLoginForm: UntypedFormGroup;
  BranchDropdown: BranchDropdown[];
  filteredBranch: Observable<BranchDropdown[]>;

  constructor(
    private storageService: StorageService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AuthService>
  ) {
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

  GetBranchDetails() {
    let location = []
    location.push(this.userLocations.split(','));
    this.BranchDropdown = location[0].map((x) => { return { locCode: x, location: x, CountryId: 0 } })
    this.BranchFilter()
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

  _filterBranch(Country: string): BranchDropdown[] {
    const filterValue = Country.toLowerCase();

    return this.BranchDropdown.filter(
      (option) => option.location.toLowerCase().includes(filterValue)
    );
  }

  displayBranch(Branch: BranchDropdown): string {
    return Branch && Branch.location ? Branch.location : "";
  }

  Onsubmit() {
    this.storageService.setItem("Branch", this.VitualLoginForm.value.Branch.locCode);
    this.dialogRef.close();
    location.reload();
  }

}
