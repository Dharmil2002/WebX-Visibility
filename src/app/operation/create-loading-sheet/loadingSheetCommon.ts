type RouteLeg = string;

interface Legs {
  carryforwardLeg: RouteLeg[];
  forwardLeg: RouteLeg[];
}

export function transform(value: any, param: string): string {
  const parts = value.split(':')[1].split('-');
  const index = parts.indexOf(param);

  if (index !== -1) {
    return parts.slice(index).join('-');
  }

  return '';

}
interface Shipment {
  Shipment: string,
  Origin: string,
  Destination: string,
  Packages: number,
  routes: string,
  Leg: string,
  Action?: string
}

type RouteStop = string;
type Route = RouteStop[];


function computeLegs(routeStr: string, current: string): Legs {
  // Extracting locations from route string
  const route = routeStr.split(': ')[1].split('-');

  const currentIndex = route.indexOf(current);

  if (currentIndex === -1) {
    throw new Error(`Current location ${current} not found in route`);
  }

  const carryforwardLeg: RouteLeg[] = [];
  for (let i = 0; i < currentIndex; i++) {
    for (let j = currentIndex + 1; j < route.length; j++) {
      carryforwardLeg.push(`${route[i]}-${route[j]}`);
    }
  }

  const forwardLeg = route
    .slice(currentIndex + 1)
    .map(destination => `${current}-${destination}`);

  return { carryforwardLeg, forwardLeg };
}

let data: Shipment[] = [
  // Please copy your shipment data here
];

export function filterloadingShipments(data: any, routeStr: string, currentStop: string): Shipment[] {
  const { carryforwardLeg, forwardLeg } = computeLegs(routeStr, currentStop);
  return data.filter(shipment => (carryforwardLeg.includes(shipment.Leg) && shipment.routes === routeStr) || forwardLeg.includes(shipment.Leg));
}

// usage: -screate-loadingheet.component

/**
 * Filters shipment data based on location criteria.
 * @param shipmentData The shipment data to filter.
 * @param tripData The trip data used for filtering.
 * @param orgBranch The origin branch used for filtering.
 * @returns An array of filtered shipment data.
 */
export function filterDataByLocation(shipmentData: any, tripData: any, orgBranch: string): any {
  let filterData: any[] = [];

  filterData = shipmentData.filter(
    (x) => x.orgLoc.trim() === orgBranch.trim() && (!x.destination || x.destination.trim() === '' || x.destination.split(':')[1].trim() !== orgBranch.trim())
  );

  let routeData = transform(tripData.RouteandSchedule, orgBranch);
  let currentLeg = routeData.split("-").splice(1);
  // A-B-C-D
  /*
  [B,C,D]
  */
  // Filter shipment data based on origin and current leg destinations
  let legWiseData = shipmentData.filter((x) => {
    return x.orgLoc.trim() === orgBranch.trim() && currentLeg.includes(x.destination?.split(':')[1]?.trim());
  });

  // Filter shipment data based on route and destination branch
  let routeWiseData = shipmentData.filter((x) => {
    return x.orgLoc.trim() === orgBranch.trim() && (!x.destination || x.destination.trim() === '' || x.destination.split(':')[1].trim() !== orgBranch);
  });

  // Merge the leg-wise and route-wise data
  let mergedData = legWiseData.concat(routeWiseData);
  let uniqueData = Array.from(new Set(mergedData));
  filterData = uniqueData;

  let data = {
    filterData: filterData,
    legWiseData: legWiseData
  };
  return data;
}


export function groupShipments(combinedData) {
  const groupedData = combinedData.reduce((result, item) => {
    const leg = item.orgLoc + "-" + item.destination.split(':')[1];

    const legData = {
      leg,
      count: 0,
      packages: 0,
      volumeCFT: 0,
      weightKg: 0
    };

    if (!result[leg]) {
      result[leg] = legData;
    }

    result[leg].count++;
    result[leg].packages += parseInt(item.totalChargedNoOfpkg||0);
    result[leg].weightKg += parseInt(item.chrgwt||0);
    result[leg].volumeCFT += parseFloat(item.cft_tot||0);

    return result;
  }, {});

  return Object.values(groupedData);
}

export function filterCnoteDetails(cnoteDetails, shipping) {
  let cnoteData = [];

  // Loop through each shipping element
  shipping.forEach(element => {
    // Filter cnoteDetails to get data that doesn't match the current shipping element
    let existShippingData = cnoteDetails.filter((x) => x.destination.split(":")[1].trim() !== element.Destination.trim() && x.orgLoc.trim() === element.Origin.trim());

    // Only add non-empty arrays to cnoteData
    if (existShippingData.length > 0) {
      cnoteData.push(...existShippingData); // Spread the objects into the array
    }

    // Filter cnoteDetails to get data that matches the current shipping element's destination, origin, and docket number
    let matchdocket = cnoteDetails.filter((x) => x.destination.split(":")[1].trim() === element.Destination.trim() && x.orgLoc.trim() === element.Origin.trim() && x.docketNumber.trim() == element.Shipment.trim());

    // Only add non-empty arrays to cnoteData
    if (matchdocket.length > 0) {
      cnoteData.push(...matchdocket); // Spread the objects into the array
    }

    // Filter cnoteDetails to get data that matches the current shipping element's destination, origin, but has a different docket number
    let removedData = cnoteDetails.filter((x) => x.destination.split(":")[1].trim() === element.Destination.trim() && x.orgLoc.trim() === element.Origin.trim() && x.docketNumber.trim() !== element.Shipment.trim());

    // Filter existShippingData to remove items that also exist in removedData
    let filterData = existShippingData.filter((x) => !removedData.some((y) => x.destination === y.destination && x.orgLoc === y.orgLoc && x.docketNumber === y.docketNumber));

    // Only add non-empty arrays to cnoteData
    if (filterData.length > 0) {
      cnoteData.push(...filterData); // Spread the objects into the array
    }
  });

  return cnoteData;
}
//export function for vehicle details
export async function getVehicleDetailFromApi(companyCode: number, operationService,vehicleNo) {
  const reqBody = {
    companyCode: companyCode,
    collectionName: "vehicle_detail",
    filter: {
      vehicleNo: vehicleNo
  }
  };
  try {
    const res = await operationService.operationMongoPost("generic/get", reqBody).toPromise();
    return res.data[0]
  } catch (error) {
    console.error('Error occurred during the API call:', error);
  }

}
/**
 * Updates tracking information for a docket.
 * @param {string} companyCode - The company code.
 * @param {any} operationService - The operation service object for API calls.
 * @param {Object} data - The data containing docket information.
 * @returns {Promise<any>} - A Promise resolving to the API response.
 */
export async function updateTracking(companyCode, operationService, data) {
  try {

    const docketDetails = await getDocketFromApiDetail(companyCode, operationService, data?.dktNo);
    const lastArray=docketDetails.length-1;
    const dockData = {
      tripId: data?.tripId || '',      
      dktNo: data?.dktNo|| '',
      vehNo: data?.vehNo || '',
      route: data?.route || '',
      event: 'Loading Sheet Generated At'+" "+localStorage.getItem('Branch'),
      orgn: docketDetails[lastArray]?.orgn || '',
      loc: localStorage.getItem('Branch') || '',
      dest: docketDetails[lastArray]?.dest || '',
      lsno: data?.lsNo || '',
      unload:false,
      mfno: '',
      dlSt: '',
      dlTm: '',
      evnCd: '',
      upBy: localStorage.getItem('Username') || '',
      upDt: new Date()
    };

    const req = {
      companyCode: companyCode,
      collectionName: 'cnote_tracking',
      data:dockData
    };

    const res = await operationService.operationMongoPost('generic/create', req).toPromise();
    return res;
  } catch (error) {
    console.error('Error updating docket status:', error);
    return null;
  }
}

/**
 * Retrieves loading sheet details for a specific docket.
 * @param {string} companyCode - The company code.
 * @param {any} operationService - The operation service object for API calls.
 * @param {string} docketNo - The docket number.
 * @returns {Promise<any>} - A Promise resolving to the docket details.
 */
export async function getDocketFromApiDetail(companyCode, operationService, docketNo) {
  const reqBody = {
    companyCode: companyCode,
    collectionName: 'cnote_tracking',
    filter: {
      dktNo: docketNo,
    },
  };

  try {
    const res = await operationService.operationMongoPost('generic/get', reqBody).toPromise();
    const docketDetails = res.data.filter((x) => x.unload === false);
    return docketDetails;
  } catch (error) {
    console.error('Error retrieving docket details:', error);
    throw error; // Rethrow the error for higher-level error handling if needed.
  }
}



