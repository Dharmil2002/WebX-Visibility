import { format, isValid, parseISO } from "date-fns";

/**
 * Generates the KPI data based on the provided StockCountData.
 * @param StockCountData - The stock count data array.
 * @returns The KPI data array.
 */
export function kpiData(StockCountData: any[]): any[] {
  const lsCount = StockCountData.filter((x) => x.lsNo !== "")
  // Helper function to create a shipData object
  const createShipDataObject = (
    count: number,
    title: string,
    className: string
  ) => ({
    count,
    title,
    class: `info-box7 ${className} order-info-box7`,
  });

  // Create an array of shipData objects with dynamic values
  const shipData = [
    createShipDataObject(StockCountData.length, "Total", "bg-c-Bottle-light"),
    createShipDataObject(StockCountData.filter((x) => x.isComplete === 1).length, "Completion", "bg-c-Grape-light"),
    createShipDataObject(lsCount.length, "Loading Sheet", "bg-c-Daisy-light"),
    createShipDataObject(0, "Delivery", "bg-c-Grape-light"),
  ];

  // Return the shipData array
  return shipData;
}

/**
 * Retrieves docket details from the API based on the provided parameters.
 * @param companyCode - The company code.
 * @param branch - The branch.
 * @param operationService - The operation service for making API requests.
 * @returns A promise that resolves to the modified data array.
 */
export async function getDocketDetailsFromApi(
  companyCode: number,
  branch: string,
  operationService: any
): Promise<any> {
  // Prepare request payload
  const req = {
    companyCode,
    collectionName: "docket",
    filter: {}
  };

  try {
    // Send request and await response
    const res: any = await operationService
      .operationMongoPost("generic/get", req)
      .toPromise();

    // Filter docket details based on branch
    const docketDetails = res.data.filter(
      (x: any) => x.orgLoc.toLowerCase() === branch.toLowerCase() || (x.unloadloc && x.unloadloc.toLowerCase() === branch.toLowerCase())
    );

    // Modify the data
    const modifiedData = docketDetails.map((item: any) => {

      let formattedDate = "";

      if (item.docketDate) {
        const parsedDate = parseISO(item.docketDate);
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, "dd-MM-yy HH:mm");
        }
      }
      const status =
        item.isComplete === 0 && item?.unloading === 0 && item?.lsNo === "" && item?.mfNo === ""
          ? "Quick Completion"
          : item.isComplete === 1 && item?.lsNo === "" && !item?.unloading && item?.mfNo === ""
            ? "Available for LS"
            : item.isComplete === 1 && !item?.unloading && item?.lsNo && item?.mfNo === ""
              ? "Available for manifest"
              : item.isComplete === 1 && !item?.unloading &&!item?.depart && item?.lsNo && item?.mfNo
                ? "Ready to Depart From " + localStorage.getItem("Branch")
                :item.isComplete === 1 && !item?.unloading &&item?.depart&&item?.lsNo && item?.mfNo
                ? "In Transit" +" "+ `${item?.orgLoc ?? ""} : ${item?.destination?.split(":")[1] ?? ""}`
                : item.isComplete === 1 && item?.unloading && item?.lsNo && item?.mfNo
                  ? "Going to Last Mile Delivery" + item.destination.split(":")[1]
                  :"Quick Completion";
      return {
        no: item?.docketNumber ?? "",
        date: formattedDate,
        paymentType: item?.payType ?? "",
        contractParty: item?.billingParty ?? "",
        orgdest: `${item?.orgLoc ?? ""} : ${item?.destination?.split(":")[1] ?? ""}`,
        fromCityToCity: `${item?.fromCity ?? ""} : ${item?.toCity ?? ""}`,
        noofPackages: parseInt(item?.totalChargedNoOfpkg ?? 0),
        chargedWeight: parseInt(item?.chrgwt ?? 0),
        actualWeight: parseInt(item?.actualwt ?? 0),
        status: item.dSTAT && item.dSTAT === 1 ? item.dSTATNM : status,
        docketDate:item?.docketDate||new Date(),
        // Determine the Action based on the conditions
        Action: item?.isComplete === 1
          ? item?.lsNo === 0 ? "" : ""
          : "Quick Completion",
        isComplete: item?.isComplete || false
      };
    });

    // Return the modified data
    modifiedData.sort((a: any, b: any) => {
      const dateA = a.docketDate ? new Date(a.docketDate) : null;
      const dateB = b.docketDate ? new Date(b.docketDate) : null;
      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      } else if (dateA) {
        return -1;
      } else if (dateB) {
        return 1;
      } else {
        return 0;
      }
    });
    return modifiedData;
  } catch (error) {
    throw new Error("Oops! Something went wrong. Please try again later.");
  }
}
