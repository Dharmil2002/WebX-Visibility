export class FilterCarbonFootprintCountsResponse {
  constructor() {
    (this.C02 = 0), (this.Distance = 0), (this.Trips = 0);
  }
  C02: number;
  Distance: number;
  Trips: number;
}

export class EmissionTrendResponse {
  constructor() {
    (this.Trips = 0), (this.Distance = 0), (this.EmissionInTon = 0);
  }
  Trips: number;
  Distance: number;
  Month: Date;
  EmissionInTon: number;
}

export class CarbonFootprintResponse {
  constructor() {
    (this.Capacity = 0),
      (this.Trips = 0),
      (this.Distance = 0),
      (this.EmissionFactor = 0),
      (this.VehicleModel = "");
    this.EmissionInTon = 0;
  }
  // x: number;
  // y: string;
  Capacity: number;
  Trips: number;
  Distance: number;
  EmissionFactor: number;
  VehicleModel: string;
  EmissionInTon: number;
}

/// LanWise Foot print
export class FilterLanWiseFootprintCountsResponse {
  constructor() {
    (this.Trips = 0), (this.Lans = 0), (this.Distance = 0);
  }
  Trips: number;
  Lans: number;
  Distance: number;
}

export class FilterLanWiseFootprintDetailsResponse {
  Distance: number;
  Trips: number;
  TotalDistance: number;
  Emission: number;
  From: string;
  To: string;
  EmissionInTon: number;
}

/// Vehicle Foot print
export class FilterVehicleWiseFootprintCountsResponse {
  constructor() {
    (this.Distance = 0),
      (this.Vehicles = 0),
      (this.Models = 0),
      (this.Vendors = 0),
      (this.EmissionInTon = 0),
      (this.AvgEmissionPerKM = 0);
  }
  Distance: number;
  Vehicles: number;
  Models: number;
  Vendors: number;
  EmissionInTon: number;
  AvgEmissionPerKM: number;
}

export class FilterVendorWiseEmissionResponse {
  constructor() {
    (this.Distance = 0), (this.VehicleModel = ""), (this.EmissionInTon = 0);
  }
  Distance: number;
  VehicleModel: string;
  EmissionInTon: number;
}
