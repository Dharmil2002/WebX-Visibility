export class Vehicle {
    name: string;
    value: string;
    driver: string;
    dMobNo: string;
    vMobNo: string;
    vendor: string;
    vendorType: string;
    capacity: number;
    lcNo: string;
    lcExpireDate: Date;
  
    constructor({
      name = '',
      value = '',
      driver = '',
      dMobNo = '',
      vMobNo = '',
      vendor = '',
      vendorType = '',
      capacity = 0,
      lcNo = '',
      lcExpireDate = undefined
    }: {
      name?: string;
      value?: string;
      driver?: string;
      dMobNo?: string;
      vMobNo?: string;
      vendor?: string;
      vendorType?: string;
      capacity?: number;
      lcNo?: string;
      lcExpireDate?: Date;
    }) {
      this.name = name;
      this.value = value;
      this.driver = driver;
      this.dMobNo = dMobNo;
      this.vMobNo = vMobNo;
      this.vendor = vendor;
      this.vendorType = vendorType;
      this.capacity = capacity;
      this.lcNo = lcNo;
      this.lcExpireDate = lcExpireDate;
    }
  }
  