export class vehicleMarket {
    _id: string
    companyCode:string
    vehicleSize: string
    vendor: string
    vMobileNo: string
    driver: string
    driverPan: string
    lcNo: string
    lcExpireDate: string
    dmobileNo: string
    ETA: string
    entryBy: string
    entryDate: string
    vehNo: string
    insuranceExpiryDate: string
    fitnessValidityDate: string
    vendCode: string

    constructor(
        _id: string = '',
        vehicleSize: string = '',
        companyCode:string='',
        vendor: string = '',
        vMobileNo: string = '',
        driver: string = '',
        driverPan: string = '',
        lcNo: string = '',
        lcExpireDate: string = '',
        dmobileNo: string = '',
        ETA: string = '',
        entryBy: string = '',
        entryDate: string = '',
        vehNo: string = '',
        insuranceExpiryDate: string = '',
        fitnessValidityDate: string = '',
        vendCode: string = ''
    ) {
        this._id = _id;
        this.vehicleSize = vehicleSize;
        this.vendor = vendor;
        this.vMobileNo = vMobileNo;
        this.driver = driver;
        this.driverPan = driverPan;
        this.lcNo = lcNo;
        this.lcExpireDate = lcExpireDate;
        this.dmobileNo = dmobileNo;
        this.ETA = ETA;
        this.entryBy = entryBy;
        this.entryDate = entryDate;
        this.vehNo = vehNo;
        this.insuranceExpiryDate = insuranceExpiryDate;
        this.fitnessValidityDate = fitnessValidityDate;
        this.vendCode = vendCode;
        this.companyCode=companyCode;
    }
}
