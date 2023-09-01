export class PincodeMaster {
  pincode: string
  pincodeCategory: number
  area: string
  serviceable: string
  cityname: string
  stateName: any;
  activeFlag: string;
  statename: any;
  isActive: any;
    _id: any

  constructor(PincodeMaster) {
    {
      this.pincode = PincodeMaster.pincode || '';
      this.pincodeCategory = PincodeMaster.pincodeCategory || '';
      this.area = PincodeMaster.area || '';
      this.serviceable = PincodeMaster.serviceable || '';
      this.stateName = PincodeMaster.stateName || '';
      this.cityname = PincodeMaster.cityname || '';
      this.activeFlag = PincodeMaster.isActive || false;
    }

  }
}
