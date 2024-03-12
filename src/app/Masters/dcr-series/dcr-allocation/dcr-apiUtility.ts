export async function CustomerDetail(masterService) {
  try {
      const companyCode = parseInt(localStorage.getItem('companyCode'));
      const req = { companyCode, collectionName: "customer_detail"};
      const res = await masterService.masterPost('generic/get', req).toPromise();
      if (res && res.data) {
          return res.data.map(x => ({
              name: x.customerCode,
              value: x.customerName
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
              name: x.userId,
              value: x.name
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
              name: x.vendorCode,
              value: x.vendorName
            }));
      }
  } catch (error) {
      console.error('An error occurred:', error);
  }
  return [];
}

