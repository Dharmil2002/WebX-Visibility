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
    createShipDataObject(StockCountData.length, "Total", "bg-white"),
    createShipDataObject(StockCountData.filter((x) => x.isComplete === 1).length, "Completion", "bg-white"),
    createShipDataObject(lsCount.length, "Loading Sheet", "bg-white"),
    createShipDataObject(0, "Delivery", "bg-white"),
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
    type: "operation",
    collection: "docket",
  };

  try {
    // Send request and await response
    const res: any = await operationService
      .operationPost("common/getall", req)
      .toPromise();

    // Filter docket details based on branch
    const docketDetails = res.data.filter(
      (x: any) => x.orgLoc.toLowerCase() === branch.toLowerCase()
    );

    // Modify the data
    const modifiedData = docketDetails.map((item: any) => {
      let actualWeight;

      if (item.invoiceDetails) {
        actualWeight = item.invoiceDetails.reduce(
          (acc: number, total: any) => acc + (total.ACT_WT ?? 0),
          0
        );
      }
      let formattedDate = "";

      if (item.docketDate) {
        const parsedDate = parseISO(item.docketDate);
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, "dd-MM-yy HH:mm");
        }
      }

      return {
        no: item?.docketNumber ?? "",
        date: formattedDate,
        paymentType: item?.payType ?? "",
        contractParty: item?.billingParty ?? "",
        orgdest: `${item?.orgLoc ?? ""} : ${item?.destination?.split(":")[1] ?? ""}`,
        fromCityToCity: `${item?.fromCity ?? ""} : ${item?.toCity ?? ""}`,
        noofPackages: parseInt(item?.totalChargedNoOfpkg ?? 0),
        chargedWeight: parseInt(item?.chrgwt ?? 0),
        actualWeight: parseInt(actualWeight ?? 0),
        status: item?.isComplete === 1
          ? item?.lsNo === "" ? "Available for LS" : "Available for manifest"
          : item?.unloading === 1 && item?.lsNo && item?.mfNo
            ? "Waiting for unloading"
            : "Quick Completion",
        // Determine the Action based on the conditions
        Action: item?.isComplete === 1
          ? item?.lsNo === 0 ? "" : ""
          : "Quick Completion",
        isComplete: item?.isComplete || false
      };
    });

    // Return the modified data
    return modifiedData;
  } catch (error) {
    throw new Error("Oops! Something went wrong. Please try again later.");
  }
}
