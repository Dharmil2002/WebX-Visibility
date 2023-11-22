
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import moment from "moment";
import { Subject, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { ContractBasicInformationControl } from "src/assets/FormControls/CustomerContractControls/BasicInformation-control";
import { productdetailFromApi } from "../../CustomerContractAPIUtitlity";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

interface CurrentAccessListType {
  productAccess: string[];
}
@Component({
  selector: 'app-customer-contract-basic-information',
  templateUrl: './customer-contract-basic-information.component.html',
})
export class CustomerContractBasicInformationComponent implements OnInit {
  @Input() contractData: any;
  ContractScanimageData: any;
  ContractPOScanimageData: any;
  companyCode: number | null
  //#region Form Configration Fields
  ContractBasicInformationControls: ContractBasicInformationControl;
  ProductsForm: UntypedFormGroup;
  jsonControlArrayProductsForm: any;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "ConsignmentEntryForm",
      items: ["Operation"],
      active: "ConsignmentEntryForm",
    },
  ];

  //#region Array List
  CurrentAccessList: any
  productdetailList: any
  PayBasisList = [
    {
      value: "All",
      name: "All",
    },
    {
      value: "TBB",
      name: "TBB",
    },
    {
      value: "LTL",
      name: "LTL",
    },
    {
      value: "FTL",
      name: "FTL",
    },

  ]
  //#endregion

  protected _onDestroy = new Subject<void>();

  //#endregion
  constructor(private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private matDialog: MatDialog,
    private Route: Router,
    private masterService: MasterService,
    private filter: FilterUtils, private objImageHandling: ImageHandling,
    private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      productAccess: ['Customer', 'ContractID', 'ContractScan', 'ContractScanView',
        'Product', 'PayBasis', 'AccountManager', 'PayBasis', 'ContractStartDate', 'Expirydate', 'Pendingdays', 'CustomerPONo', 'POValiditydate', 'ContractPOScan', 'ContractPOScanView', 'UpdateHistory']
    } as CurrentAccessListType;
  }
  ngOnChanges(changes: SimpleChanges) {
    let data = {
      "Customer": changes.contractData?.currentValue?.cUSTID + ":" + changes.contractData?.currentValue?.cUSTNM ?? '',
      "ContractID": changes.contractData?.currentValue?.cONID ?? '',
      "PayBasis": changes.contractData?.currentValue?.pBAS ?? '',
      "ContractStartDate": changes.contractData?.currentValue?.cSTARTDT ?? '',
      "Expirydate": changes.contractData?.currentValue?.cENDDT ?? '',
      "cSCAN": changes.contractData?.currentValue?.cSCAN ?? '',
      "cPOSCAN": changes.contractData?.currentValue?.cPOSCAN ?? '',
      "AccountManager": changes.contractData?.currentValue?.aCMGR ?? '',
      "CustomerPONo": changes.contractData?.currentValue?.cPONO ?? '',
      "POValiditydate": changes.contractData?.currentValue?.cPODt ?? '',


    }
    this.initializeFormControl(data);
  }

  //#endregion
  initializeFormControl(data) {
    this.ContractBasicInformationControls = new ContractBasicInformationControl(data);
    this.jsonControlArrayProductsForm = this.ContractBasicInformationControls.getContractBasicInformationControlControls(this.CurrentAccessList.productAccess);
    this.ProductsForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayProductsForm,
    ]);
    this.ProductsForm.get("ContractStartDate").setValue(moment(data.ContractStartDate, 'DD-MM-YYYY').toDate())
    this.ProductsForm.get("Expirydate").setValue(moment(data.Expirydate, 'DD-MM-YYYY').toDate())


    const contractStartDate = moment(new Date(), 'DD-MM-YYYY');
    const expiryDate = moment(data.Expirydate, 'DD-MM-YYYY');

    const Pendingdays = expiryDate.diff(contractStartDate, 'days');
    this.ProductsForm.get("Pendingdays").setValue(Pendingdays)

    this.ProductsForm.get("CustomerPONo").setValue(data.CustomerPONo)
    this.ProductsForm.get("POValiditydate").setValue(moment(data.POValiditydate, 'DD-MM-YYYY').toDate())

    const cSCAN = this.objImageHandling.extractFileName(data.cSCAN);
    this.ProductsForm.get("ContractScan").setValue(cSCAN)
    const ContractScan = this.jsonControlArrayProductsForm.find(x => x.name === 'ContractScan');
    ContractScan.additionalData.isFileSelected = false;


    const cPOSCAN = this.objImageHandling.extractFileName(data.cPOSCAN);
    this.ProductsForm.get("ContractPOScan").setValue(cPOSCAN)
    const ContractPOScan = this.jsonControlArrayProductsForm.find(x => x.name === 'ContractPOScan');
    ContractPOScan.additionalData.isFileSelected = false;

  }
  //#endregion
  async ngOnInit() {
    this.productdetailList = await productdetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlArrayProductsForm,
      this.ProductsForm,
      this.productdetailList,
      "Product",
      false
    );
    this.ProductsForm.get("Product").setValue(this.productdetailList.find(item => item.value == this.contractData.pID))

    this.filter.Filter(
      this.jsonControlArrayProductsForm,
      this.ProductsForm,
      this.PayBasisList,
      "PayBasis",
      false
    );
    this.ProductsForm.get("PayBasis").setValue(this.PayBasisList.find(item => item.value == this.contractData.pBAS))


  }
  //#region functionCallHandler
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
  async save() {
    console.log(this.ContractScanimageData?.ContractScan ?? this.contractData.cSCAN)
    debugger
    let contractDetails = {
      cID: this.contractData.cID,
      bRC: this.contractData.bRC,
      fYEAR: this.contractData.fYEAR,
      cONID: this.contractData.cONID,
      cUSTID: this.contractData.cUSTID,
      cUSTNM: this.contractData.cUSTNM,
      pID: this.ProductsForm.value?.Product?.value,
      pNM: this.ProductsForm.value?.Product?.name,
      pBAS: this.ProductsForm.value?.PayBasis?.value,
      cSTARTDT: this.ProductsForm.value?.ContractStartDate,
      cENDDT: this.ProductsForm.value?.Expirydate,
      eDT: this.contractData.eDT,
      cSCAN: this.ContractScanimageData?.ContractScan ?? this.contractData.cSCAN,
      aCMGR: this.ProductsForm.value?.AccountManager,
      cPONO: this.ProductsForm.value?.CustomerPONo,
      cPODt: this.ProductsForm.value?.POValiditydate,
      cPOSCAN: this.ContractPOScanimageData?.ContractPOScan ?? this.contractData.cPOSCAN,

    }

    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract",
      filter: { _id: this.contractData._id },
      update: { ...contractDetails }
    };

    this.masterService.masterPut('generic/update', reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
        }
      }
    });
  }
  async selectFileContractScan(data) {
    // Call the uploadFile method from the service
    this.ContractScanimageData = await this.objImageHandling.uploadFile(data.eventArgs, "ContractScan", this.
      ProductsForm, this.ContractScanimageData, "CustomerContract", 'ContractScan', this.jsonControlArrayProductsForm,
      ["jpg", "png", "jpeg", "pdf"]);

  }
  openImageDialog(control) {
    let file;
    if (control == 'ContractScan') {
      file = this.objImageHandling.getFileByKey(control.imageName, this.ContractScanimageData);
      if (file == null) {
        file = this.contractData.cSCAN
      }
    } else {
      file = this.objImageHandling.getFileByKey(control.imageName, this.ContractPOScanimageData);
      if (file == null) {
        file = this.contractData.cPOSCAN
      }
    }
    this.matDialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  async selectFileContractPOScan(data) {
    this.ContractPOScanimageData = await this.objImageHandling.uploadFile(data.eventArgs, "ContractPOScan", this.
      ProductsForm, this.ContractPOScanimageData, "CustomerContract", 'ContractPOScan', this.jsonControlArrayProductsForm,
      ["jpg", "png", "jpeg", "pdf"]);
  }
  cancel() {
    this.Route.navigateByUrl('/Masters/CustomerContract/CustomerContractList');
  }

}

