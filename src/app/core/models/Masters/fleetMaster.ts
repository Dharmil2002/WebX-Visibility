export class fleetModel {

  activeFlag: boolean;
  id: number; //user
  vehicleNo: string;
  vehicleType: string;
  RCBookNo: string;
  registrationNo: string;
  RegistrationDate: Date;
  insuranceExpiryDate: Date;
  fitnessValidityDate: Date;
  vehicleInsurancePolicy: string;
  insuranceProvider: string;
  chassisNo: string;
  engineNo: string;
  registrationScan: string;
  insuranceScan: string;
  fitnesscertificateScan: string;
  date = new Date()
  constructor(FleetMaster) {
    {
      this.id = FleetMaster._id || this.getRandomID();
      this.vehicleNo = FleetMaster.vehicleNo || '';
      this.vehicleType = FleetMaster.vehicleType || '';
      this.RCBookNo = FleetMaster.RCBookNo || '';
      this.registrationNo = FleetMaster.registrationNo || '';
      this.vehicleInsurancePolicy = FleetMaster.vehicleInsurancePolicy || '';
      this.insuranceProvider = FleetMaster.insuranceProvider || '';
      this.chassisNo = FleetMaster.chassisNo || '';
      this.engineNo = FleetMaster.engineNo || '';
      this.insuranceExpiryDate = FleetMaster.insuranceExpiryDate || this.date;
      this.RegistrationDate = FleetMaster.RegistrationDate || this.date;
      this.fitnessValidityDate = FleetMaster.fitnessValidityDate || this.date;
      this.activeFlag = FleetMaster.activeFlag || false;

    }
  }

  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}