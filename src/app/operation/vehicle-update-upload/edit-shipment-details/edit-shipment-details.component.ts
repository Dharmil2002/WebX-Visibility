import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ManifestService } from 'src/app/Utility/module/operation/mf-service/mf-service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ShipmentEditControls } from 'src/assets/FormControls/shipment-controls';
import Swal from 'sweetalert2';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { AddDepsDetailsComponent } from '../add-deps-details/add-deps-details.component';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { DepsService } from 'src/app/Utility/module/operation/deps/deps-service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';

@Component({
  selector: 'app-edit-shipment-details',
  templateUrl: './edit-shipment-details.component.html'
})
export class EditShipmentDetailsComponent implements OnInit {
  tableLoad: boolean;
  EditShipmentForm: UntypedFormGroup;
  jsonControlArray: any;
  imageData: any = {};
  className: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  @Output() notifyParent: EventEmitter<string> = new EventEmitter();
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  shipmentDetails: any;
  selectedFiles: boolean;
  dataFromThirdDialog: any;
  depsDetails: any;
  requestdata = {
    "eventArgs": {
      "checked": true
    },
    "field": {
      "name": "shortPkts",
      "label": "Is Short Package",
      "placeholder": "",
      "type": "toggle",
      "value": false,
      "functions": {
        "onChange": "toggleChanges"
      },
      "additionalData": {
        "require": true,
        "name": "Short Package"
      },
      "Validations": [],
      "generatecontrol": true,
      "disable": false
    }
  }
  allJsonControlArray: FormControls[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private docketService: DocketService,
    public dialogRef: MatDialogRef<EditShipmentDetailsComponent>,
    public dialog: MatDialog,
    private storage: StorageService,
    private manifestService: ManifestService,
    private filter: FilterUtils,
    private objImageHandling: ImageHandling,
    public generalService: GeneralService,
  ) {
    this.shipmentDetails = item;
  }

  functionCaller($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  ngOnInit(): void {
    this.IntializeFormControl();
  }

  IntializeFormControl() {
    const shipmentControls = new ShipmentEditControls();
    this.allJsonControlArray = shipmentControls.getShipmentFormControls();
    this.jsonControlArray = this.allJsonControlArray.filter((x) => x.additionalData?.require)
    this.EditShipmentForm = formGroupBuilder(this.fb, [this.allJsonControlArray]);
    this.EditShipmentForm.controls['suffix'].setValue(this.shipmentDetails.Suffix);
    this.EditShipmentForm.controls['shipment'].setValue(this.shipmentDetails.Shipment);
    this.EditShipmentForm.controls['actualWeight'].setValue(this.shipmentDetails.weight);
    this.EditShipmentForm.controls['ctWeight'].setValue(this.shipmentDetails.cWeight);
    this.EditShipmentForm.controls['noofPkts'].setValue(this.shipmentDetails.Packages);
    this.bindDropDown();
    if (!this.shipmentDetails.hasOwnProperty('Type')) {
      this.getCheckDeps();
    }
    else {
      this.EditShipmentForm.controls['shortPkts'].disable();
      this.EditShipmentForm.controls['extraPkts'].disable();
      this.EditShipmentForm.controls['pilferagePkts'].disable();
      this.EditShipmentForm.controls['DamagePkts'].disable();
    }
  }

  async getCheckDeps() {
    const deps = await this.docketService.getdocketFromOpsOne({
      dKTNO: this.EditShipmentForm.controls['shipment'].value,
      cID: this.storage.companyCode,
      sFX: this.shipmentDetails.Suffix
    });
    if (deps) {
      const noOfPkts = parseInt(this.EditShipmentForm.controls['noofPkts'].value);
      const actualWeight = parseFloat(this.EditShipmentForm.controls['actualWeight'].value);
      const ctWeight = parseFloat(this.EditShipmentForm.controls['ctWeight'].value);
      if (deps.pKGS && deps.pKGS < noOfPkts) {
        this.EditShipmentForm.controls['noofPkts'].setValue(deps.pKGS);
        this.EditShipmentForm.controls['actualWeight'].setValue(deps.aCTWT);
        this.EditShipmentForm.controls['ctWeight'].setValue(deps.cHRWT);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `You cannot enter more than ${deps.pKGS} Pkgs because others are declared as Deps.`
        });
      } else if (deps.aCTWT && deps.aCTWT < actualWeight) {
        this.EditShipmentForm.controls['actualWeight'].setValue(deps.aCTWT);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `You cannot enter more than ${deps.aCTWT} Actual Weight because others are declared as Deps.`
        });
      } else if (deps.cHRWT && deps.cHRWT < ctWeight) {
        this.EditShipmentForm.controls['ctWeight'].setValue(deps.cHRWT);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `You cannot enter more than ${deps.cHRWT} Chargeable Weight because others are declared as Deps.`
        });
      }
    }
  }
  cancel() {
    this.dialogRef.close()
  }
  async getFilePod(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, data.field.name, this.
      EditShipmentForm, this.imageData, "Delivery", 'Operations', this.jsonControlArray, ["jpeg", "png", "jpg", "pdf"]);
  }

  async bindDropDown() {
    const depsReason = await this.generalService.getGeneralMasterData(["DREASON", 'PLFREASON', 'SREASON']);
    const reasons = [{ name: 'shortReason', value: "SREASON" }, { name: 'demageReason', value: "DREASON" }, { name: 'pilferageReason', value: "PLFREASON" }];
    reasons.forEach((x) => {
      this.filter.Filter(
        this.allJsonControlArray,
        this.EditShipmentForm,
        depsReason.filter((d) => d.type == x.value),
        x.name,
        false
      );
    });

  }

  toggleChanges(event) {
    const updateJsonData = (fieldNames, requireValue, event) => {
      return this.allJsonControlArray.map((x) => {
        if (fieldNames.includes(x.name)) {
          x.additionalData.require = requireValue;
          if (!requireValue) {
            this.EditShipmentForm.controls[x.name].setValue("");
          }
        }
        return x;
      }).filter((d) => d.additionalData?.require === true);
    };
    const fieldName = event.field.name;
    const isChecked = event.eventArgs.checked;
    const requireValue = isChecked ? true : false;

    if (fieldName === 'extraPkts' && isChecked) {
      this.onDepsSelect();
    } else {
      let fieldsToUpdate;
      switch (fieldName) {
        case 'shortPkts':
          fieldsToUpdate = ['shortReason', 'shortUpload', 'shortRemarks', 'shortPkgs'];
          break;
        case 'pilferagePkts':
          fieldsToUpdate = ['pilferageReason', 'pilferageUpload', 'pilferageRemarks', 'pilferagePkgs'];
          break;
        case 'DamagePkts':
          fieldsToUpdate = ['demageReason', 'demageUpload', 'demageRemarks', 'demagePkgs'];
          break;
        default:
          fieldsToUpdate = [];
      }

      if (fieldsToUpdate.length > 0) {
        this.jsonControlArray = updateJsonData(fieldsToUpdate, requireValue, event);
      }
    }

    this.updateValidators();
  }
  updateValidators() {
    this.allJsonControlArray.forEach((control) => {
      const formControl = this.EditShipmentForm.get(control.name);
      if (control.additionalData.require) {
        formControl.setValidators([Validators.required]);
      } else {
        formControl.clearValidators();
      }
      formControl.updateValueAndValidity();
    });
  }
  openImageDialog(control) {
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  getValidate(event) {

    const fm = {
      pkgs: {
        name: 'noofPkts',
        ctrl: this.EditShipmentForm.controls['noofPkts'],
        field: 'Packages'
      },
      actWeight: {
        name: 'actualWeight',
        ctrl: this.EditShipmentForm.controls['actualWeight'],
        field: 'weight'
      },
      chgWeight: {
        name: 'ctWeight',
        ctrl: this.EditShipmentForm.controls['ctWeight'],
        field: 'cWeight'
      }
    }

    function setFieldValues(values) {
      fm.pkgs.ctrl.setValue(values.pkgs);
      fm.actWeight.ctrl.setValue(values.actWeight);
      fm.chgWeight.ctrl.setValue(values.chgWeight);
    }

    function proportionalWeightCalculation(pkg, total, totalWeight) {
      return ConvertToNumber(pkg * (totalWeight / total), 2);
    }

    const pkg = parseInt(fm.pkgs.ctrl.value);
    const actWT = parseFloat(fm.actWeight.ctrl.value);
    const chgWT = parseFloat(fm.chgWeight.ctrl.value);
    const totPkg = this.shipmentDetails[fm.pkgs.field] || 0;
    const totActWT = this.shipmentDetails[fm.actWeight.field] || 0;
    const totChgWT = this.shipmentDetails[fm.chgWeight.field] || 0;

    let result = { isValid: true, message: '' };
    switch (event.field.name) {
      case fm.pkgs.name:
        if (pkg > totPkg) {
          result.isValid = false;
          result.message = `Number of packages should be less than or equal to ${totPkg}`;
          setFieldValues({ pkgs: totPkg, actWeight: totActWT, chgWeight: totChgWT });
        }
        else if (pkg < totPkg) {
          const aWT = proportionalWeightCalculation(pkg, totPkg, totActWT);
          const cWT = proportionalWeightCalculation(pkg, totPkg, totChgWT);
          setFieldValues({ pkgs: pkg, actWeight: aWT, chgWeight: cWT });
          if(!this.shipmentDetails.hasOwnProperty('Type')){
          this.EditShipmentForm.controls['shortPkts'].setValue(true);
          this.toggleChanges(this.requestdata);
          const shortPkgs = parseInt(totPkg) - pkg;
          this.EditShipmentForm.controls['shortPkgs'].setValue(shortPkgs);
          }
        }
        else if (pkg == 0) {
          setFieldValues({ pkgs: 0, actWeight: 0, chgWeight: 0 });
        }
        break;
      case fm.actWeight.name:
        const aWT = proportionalWeightCalculation(pkg, totPkg, totActWT);
        if (actWT > totActWT) {
          result.isValid = false;
          result.message = `Actual weight should be less than or equal to ${totActWT}`;
          fm.actWeight.ctrl.setValue(totActWT);
        }
        else if (actWT == 0 && pkg > 0) {
          result.isValid = false;
          result.message = `Actual weight should be greter than 0`;
          fm.actWeight.ctrl.setValue(aWT);
        }
        else if (actWT == totActWT && pkg < totPkg) {
          result.isValid = false;
          result.message = `Actual weight should be less than total weight [${totActWT}] if number of packages are less than total packages`;
          fm.actWeight.ctrl.setValue(aWT);
        }
        break;
      case fm.chgWeight.name:
        const cWT = proportionalWeightCalculation(pkg, totPkg, totChgWT);
        if (chgWT > totChgWT) {
          result.isValid = false;
          result.message = `Charge weight should be less than or equal to ${totChgWT}`;
          fm.chgWeight.ctrl.setValue(totChgWT);
        }
        else if (chgWT == 0 && pkg > 0) {
          result.isValid = false;
          result.message = `Charge weight should be greter than 0`;
          fm.chgWeight.ctrl.setValue(cWT);
        }
        else if (chgWT == totChgWT && pkg < totPkg) {
          result.isValid = false;
          result.message = `Charge weight should be less than total weight [${totChgWT}] if number of packages are less than total packages`;
          fm.chgWeight.ctrl.setValue(cWT);
        }
        break;
    }

    if (!result.isValid) {
      Swal.fire('Warning', result.message, 'warning');
    }
    if(!this.shipmentDetails.hasOwnProperty('Type')){
    this.getCheckDeps();
  }
  }
  getPkgsCheck() {
    const arrivalPkgs =this.shipmentDetails?.Packages || 0;
    const shortPkgs = this.EditShipmentForm.get('shortPkgs')?.value || 0;
    const philoPkgs = this.EditShipmentForm.get('pilferagePkgs')?.value || 0;
    const demangePkgs = this.EditShipmentForm.get('demagePkgs')?.value || 0;
    const result = this.validatePackages(arrivalPkgs, shortPkgs, philoPkgs, demangePkgs);
    if (result) {
      Swal.fire('Error', result.message, 'error');
      this.EditShipmentForm.get(result.field).setValue(0);
    }
  }
  validatePackages(arrivalPkgs, shortPkgs, philoPkgs, demangePkgs) {
    switch (true) {
      // Case 1: Any individual package count should not exceed the arrival package count
      case shortPkgs > arrivalPkgs:
        return { message: `Short packages (${shortPkgs}) cannot be greater than arrival packages (${arrivalPkgs}).`, field: 'shortPkgs' };

      case philoPkgs > arrivalPkgs:
        return { message: `Philo packages (${philoPkgs}) cannot be greater than arrival packages (${arrivalPkgs}).`, field: 'philoPkgs' };

      case demangePkgs > arrivalPkgs:
        return { message: `Demange packages (${demangePkgs}) cannot be greater than arrival packages (${arrivalPkgs}).`, field: 'demangePkgs' };

      // Case 2: Philo or Demange packages cannot exceed remaining packages after accounting for Short packages
      case philoPkgs > (arrivalPkgs - shortPkgs):
        return { message: `Philo packages (${philoPkgs}) cannot be greater than remaining packages after short packages (${arrivalPkgs - shortPkgs}).`, field: 'philoPkgs' };

      case demangePkgs > (arrivalPkgs - shortPkgs):
        return { message: `Demange packages (${demangePkgs}) cannot be greater than remaining packages after short packages (${arrivalPkgs - shortPkgs}).`, field: 'demangePkgs' };

      // Case 3: Demange packages cannot exceed remaining packages after accounting for Short and Philo packages
      case demangePkgs > (arrivalPkgs - shortPkgs - philoPkgs):
        return { message: `Demange packages (${demangePkgs}) cannot be greater than remaining packages after short and philo packages (${arrivalPkgs - shortPkgs - philoPkgs}).`, field: 'demangePkgs' };

      // Case 4: Philo packages cannot exceed remaining packages after accounting for Short and Demange packages
      case philoPkgs > (arrivalPkgs - shortPkgs - demangePkgs):
        return { message: `Philo packages (${philoPkgs}) cannot be greater than remaining packages after short and demange packages (${arrivalPkgs - shortPkgs - demangePkgs}).`, field: 'philoPkgs' };

      // No errors
      default:
        return null;
    }
  }
  save() {
    let allFormData = { ...this.EditShipmentForm.getRawValue() };
    allFormData.isDeps = allFormData.shortPkts || allFormData.DamagePkts || allFormData.pilferagePkts || false;
    allFormData.depsOptions = []
    allFormData.demageUpload = this.imageData?.demageUpload || "";
    allFormData.pilferageUpload = this.imageData?.pilferageUpload || "";
    allFormData.shortUpload = this.imageData?.shortUpload || "";
    allFormData.shortPkts && allFormData.depsOptions.push({ name: "Shortage", value: 'S' });
    allFormData.DamagePkts && allFormData.depsOptions.push({ name: "Damage", value: 'D' });
    allFormData.pilferagePkts && allFormData.depsOptions.push({ name: "Pilferage", value: 'P' });
    if (allFormData.shortPkts || allFormData.DamagePkts || allFormData.pilferagePkts) {
      const packageConditions = [
          { flag: allFormData.shortPkts, value: this.EditShipmentForm.get('shortPkgs')?.value || 0, message: 'Short packages must be greater than 0.' },
          { flag: allFormData.DamagePkts, value: this.EditShipmentForm.get('demagePkgs')?.value || 0, message: 'Damaged packages must be greater than 0.' },
          { flag: allFormData.pilferagePkts, value: this.EditShipmentForm.get('pilferagePkgs')?.value || 0, message: 'Pilferage packages must be greater than 0.' }
      ];
  
      let errorMessage = '';
  
      packageConditions.forEach(condition => {
          if (condition.flag && condition.value <= 0) {
              errorMessage += condition.message + ' ';
          }
      });
  
      if (errorMessage) {
          Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              text: errorMessage
          });
          return false;
      }
      
  }
  
    this.dialogRef.close(allFormData);
  }
  onDepsSelect() {
    const dialogref = this.dialog.open(AddDepsDetailsComponent, {
      width: "70%",
      height: "80%",
      data: { ...this.EditShipmentForm.getRawValue(), ...this.shipmentDetails },
      disableClose: true

    });
    dialogref.afterClosed().subscribe((result) => {
      this.dialogRef.close();
    });
  }

}
