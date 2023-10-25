export class fleetModel {

  activeFlag: boolean;
  _id: string; //user
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
  constructor(FleetMaster) {
    {
      //this._id = FleetMaster._id || this.getRandomID();
      this.vehicleNo = FleetMaster.vehicleNo || '';
      this.vehicleType = FleetMaster.vehicleType || '';
      this.RCBookNo = FleetMaster.RCBookNo || '';
      this.registrationNo = FleetMaster.registrationNo || '';
      this.vehicleInsurancePolicy = FleetMaster.vehicleInsurancePolicy || '';
      this.insuranceProvider = FleetMaster.insuranceProvider || '';
      this.chassisNo = FleetMaster.chassisNo || '';
      this.engineNo = FleetMaster.engineNo || '';
      this.insuranceExpiryDate = FleetMaster.insuranceExpiryDate || new Date();
      this.RegistrationDate = FleetMaster.RegistrationDate || new Date();
      this.fitnessValidityDate = FleetMaster.fitnessValidityDate || new Date();
      this.activeFlag = FleetMaster.activeFlag || false;

    }
  }
}