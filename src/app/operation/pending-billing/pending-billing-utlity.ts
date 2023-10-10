export async function pendingbilling(masterService) {

  const req = {
    companyCode: localStorage.getItem('companyCode'),
    collectionName: "docket_temp",
    filter: {}
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
  data: T[],
  groupByKey: keyof T,
): Promise<{ billingparty: string; count: number; sum: number | null }[]> {
  const groupedDataMap = new Map<string, { count: number; sum: number | null }>();

  // Use for...of loop for better async handling
  for (const item of data) {
    const keyValue = String(item[groupByKey]);
    const totalAmount = await calculateTotalAmount(item);
    
    // Use destructuring for better readability
    const { count = 0, sum = 0 } = groupedDataMap.get(keyValue) || {};

    groupedDataMap.set(keyValue, {
      count: count + 1,
      sum: sum + Number(totalAmount),
    });
  }

  const groupedData: { billingparty: string; count: number; sum: number | null; pod: number; action: string }[] = [];

  groupedDataMap.forEach((value, key) => {
    groupedData.push({
      billingparty: key,
      count: value.count,
      sum: value.sum === null ? null : value.sum,
      pod: 0,
      action: "Generate Invoice",
    });
  });

  return groupedData;
}
