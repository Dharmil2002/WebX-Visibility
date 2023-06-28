import { NgModel } from "@angular/forms";
import { Subscription } from "rxjs";

export class User {
  constructor(public UserId: number, public Name: string) {}
}

export interface IUserResponse {
  IsSuccess: boolean;
  Message: string;
  UserList: User[];
}
export class VendorInvoiceSubmissionRquest {
  CompanyCode: number;
  BranchCode: string;
  EntryBy: string;
  ManualInvoiceNo: string;
  VendorCode: string;
  SubmittedTo: string;
  TotalAmount: number;
  ManualInvoiceDate: string;
  SubmittedOn: string;
  UploadDocument: string;
}
export class VendorInvoiceSubmissionResponse {
  IsSuccess: Boolean;
  Message: string;
  ManualInvoiceNo: string;
}
export class GeneralMasterCodeRquest {
  CompanyCode: string;
  CodeType: string;
}

export interface IGeneralMasterResponse {
  IsSuccess: boolean;
  Message: string;
  ActiveGeneralMasterCodeList: GeneralMasterCodeList[];
}
export class GeneralMasterCodeList {
  constructor(public CodeId: string, public CodeDesc: string) {}
}
export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
export class TreeItemNode {
  children: TreeItemNode[];
  item: string;
}

export class TreeItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}
