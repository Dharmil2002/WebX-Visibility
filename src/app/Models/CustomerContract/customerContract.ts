export class CustomerContractRequestModel {
  companyCode: number
  docType: string
  branch: string
  finYear: string
  data: CustomerContractDataRequestModel
}

export class CustomerContractDataRequestModel {
  companyCode: number
  contractID: string
  docType: string
  branch: string
  finYear: string
  customerId: string
  customerName: string
  productId: string
  productName: string
  payBasis: string
  ContractStartDate: string
  Expirydate: string
  entryBy: string
  entryDate: string
  updateBy: string
  updateDate: string
  entryLocation: string
  updateLocation: string

}
