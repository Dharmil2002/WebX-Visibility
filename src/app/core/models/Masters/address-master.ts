export class AddressMaster {
    addressCode: string;
    manualCode: string;
    phone: number;
    address: string;
    email: string;
    city: string;
    state:string;
    pincode:string;
    activeFlag: any;
    updateBy: string;
    entryBy: string;
    _id:string;
    cityName: any;
    isActive: any;
    stateName: any;
    constructor(AddressMaster) {
        {
            this.addressCode = AddressMaster.addressCode || '';
            this.manualCode = AddressMaster.manualCode || '';
            this.phone = AddressMaster.phone || '';
            this.address = AddressMaster.address || '';
            this.email = AddressMaster.email || '';
            this.city = AddressMaster.city || '';
            this.state = AddressMaster.state || '';
            this.pincode = AddressMaster.pincode || '';
            this.activeFlag = AddressMaster.activeFlag || false;
        }
    }
}