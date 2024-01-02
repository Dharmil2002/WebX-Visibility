export class VendorMaster {
  vendorCode: string
  vendorName: any
  vendorCity: string
  vendorState: string
  vendorCountry: string
  vendorType: string
  vendorSubType: any
  vendorAddress: any
  vendorLocation: any
  vendorPinCode: any
  vendorPhoneNo: any
  emailId: any
  isActive: any
  panNo: any
  panCardScan: any
  _id: string
  noPANRegistration: boolean
  cinNumber: string;
  msmeNumber: string
  msmeScan: any
  isBlackListed: boolean
  gstNumber: string
  gstState: string
  gstAddress: string
  gstCity: string
  gstPincode: string
  msmeRegistered: boolean
  otherdetails: any
  vendorManager: string
  constructor(VendorMaster) {
    {
      this.vendorCode = VendorMaster.vendorCode || 'System Genrated';
      this.vendorName = VendorMaster.vendorName || '';
      this.isActive = VendorMaster.isActive || false;
      this.noPANRegistration = VendorMaster.noPANRegistration || false;
      this.isBlackListed = VendorMaster.isBlackListed || false;
      this.msmeRegistered = VendorMaster.msmeRegistered || false;
      this.msmeScan = VendorMaster.msmeScan || '';
    }
  }
}