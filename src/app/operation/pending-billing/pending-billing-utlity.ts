export async function pendingbilling(masterService){
 
    const req={
        companyCode:localStorage.getItem('companyCode'),
        collectionName: "prq_detail",
        filter: {}
    }
    const res =await masterService.masterPost("generic/get",req).toPromise();
    const prqDetail= res.data.filter((x) => x.status==0); 
    return prqDetail;// Filter items where invoiceNo is empty (falsy)
}

export function groupAndCalculate<T>(
    data: T[],
    groupByKey: keyof T,
    sumKey: keyof T
  ): { billingparty: string; count: number; sum: number | null }[] {
   
    const groupedDataMap = new Map<string, { count: number; sum: number | null }>();
    
    data.forEach((item) => {
      const keyValue = String(item[groupByKey]);
      const count = groupedDataMap.has(keyValue) ? groupedDataMap.get(keyValue).count + 1 : 1;
      const sum = groupedDataMap.has(keyValue) ? groupedDataMap.get(keyValue).sum + Number(item[sumKey]) : Number(item[sumKey]);
      
      groupedDataMap.set(keyValue, { count, sum });
    });
  
    const groupedData: { billingparty: string; count: number; sum: number | null;pod:number|0; action:string|"" }[] = [];
  
    groupedDataMap.forEach((value, key) => {
      groupedData.push({ billingparty: key, count: value.count, sum: value.sum === undefined ? null : value.sum,pod:0,action:"Generate Invoice"});
    });
  
    return groupedData;
  }
  