export async function pendingbilling(masterService) {
  const req = {
    companyCode: localStorage.getItem('companyCode'),
    collectionName: "dockets_bill_details",
    filter: {oRG:localStorage.getItem("Branch"),pAYBAS:"TBB",bILED:0}
  }
  const res = await masterService.masterPost("generic/get", req).toPromise();
  const shipment = res.data;
  return shipment;// Filter items where invoiceNo is empty (falsy)
}

async function calculateTotalAmount<T>(item: T): Promise<number> {
  // Assuming 'invoiceDetails' is an array of objects with 'invoiceAmount' property
  const totalAmount = item['invoiceDetails'].reduce((sum, detail) => sum + detail['invoiceAmount'], 0);
  return totalAmount;
}

export async function groupAndCalculate<T>(
  data: any[],
  groupByKey: keyof T,
): Promise<{ billingparty: string; count: number; sum: number | null; dockets: any[] | null }[]> {

  const groupedDataMap = new Map<string, { count: number; sum: number; dockets: any[] | null }>();

  // Use for...of loop for better async handling
  for (const item of data) {
    const keyValue = String(item[groupByKey]);
    const totalAmount = item.dkTTOT;

    // Use destructuring for better readability
    const { count = 0, sum = 0, dockets = [] } = groupedDataMap.get(keyValue) || {};

    // Check if dockNo exists in dockets, and add if not
    const dockNo = item.dKTNO;
    if (dockets && !dockets.includes(dockNo)) {
      dockets.push(dockNo);
    }

    groupedDataMap.set(keyValue, {
      count: count + 1,
      sum: sum + Number(totalAmount),
      dockets: dockets,
    });
  }

  // Convert the groupedDataMap to the desired output format
  const result = Array.from(groupedDataMap).map(([billingparty, { count, sum, dockets }]) => ({
    billingparty,
    count,
    sum,
    dockets,
    pod: 0,
    action: "Generate Invoice",
  }));

  //const groupedData: { billingparty: string; dockets:any[];count: number; sum: number | null; pod: number; action: string }[] = [];

  // groupedDataMap.forEach((value, key) => {
  //   groupedData.push({
  //     billingparty: key,
  //     count: value.count,
  //     sum: value.sum === null ? null : value.sum,
     
  //     dockets:value.dockets,
  //     action: "Generate Invoice",
  //   });
  // });

  return result;
}
