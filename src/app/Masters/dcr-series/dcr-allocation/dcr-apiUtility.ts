export async function CustomerDetail(masterService) {
  try {
      const companyCode = parseInt(localStorage.getItem('companyCode'));
      const req = { companyCode, collectionName: "customer_detail"};
      const res = await masterService.masterPost('generic/get', req).toPromise();
      if (res && res.data) {
          return res.data.map(x => ({
              name: x.customerName,
              value: x.customerCode
            }));
      }
  } catch (error) {
      console.error('An error occurred:', error);
  }
  return [];
}
export async function userDetail(masterService){
  try {
      const companyCode = parseInt(localStorage.getItem('companyCode'));
      const req = { companyCode, collectionName: "user_master"};
      const res = await masterService.masterPost('generic/get', req).toPromise();
      if (res && res.data) {
          return res.data.map(x => ({
              name: x.name,
              value: x.userId
            }));
      }
  } catch (error) {
      console.error('An error occurred:', error);
  }
  return [];
}
export async function vendorDetail(masterService){
  try {
      const companyCode = parseInt(localStorage.getItem('companyCode'));
      const req = { companyCode, collectionName: "vendor_detail"};
      const res = await masterService.masterPost('generic/get', req).toPromise();
      if (res && res.data) {
          return res.data.map(x => ({
              name: x.vendorName,
              value: x.vendorCode
            }));
      }
  } catch (error) {
      console.error('An error occurred:', error);
  }
  return [];
}

