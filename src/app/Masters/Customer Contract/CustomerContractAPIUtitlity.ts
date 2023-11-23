import { filter } from "rxjs/operators";
export async function customerFromApi(masterService) {
  const branch = localStorage.getItem("Branch");
  const reqBody = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "customer_detail",
    filter: {},
  };
  try {
    const res = await masterService
      .masterMongoPost("generic/get", reqBody)
      .toPromise();
    const result =
      res?.data
        .filter((x) => x.customerLocations.includes(branch))
        .map((x) => ({
          value: x.customerCode,
          name: x.customerName,
          pinCode: x.PinCode,
          mobile: x.customer_mobile,
        })) ?? null;
    return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}
export async function PayBasisdetailFromApi(masterService, filterType?) {
  const reqBody = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "General_master",
    filter: { codeType: filterType },
  };
  try {
    const PayBasisResponse = await masterService
      .masterPost("generic/get", reqBody)
      .toPromise();

    // Use the correct filter condition with a return statement
    const data = PayBasisResponse.data.filter((x) => {
      return x.codeType === filterType;
    });
    const dataList = data.map((x) => {
      return { value: x.codeId, name: x.codeDesc };
    });
    return dataList;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

export async function productdetailFromApi(masterService) {
  let req = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "product_detail",
    filter: {},
  };
  const res = await masterService.masterPost("generic/get", req).toPromise();
  if (res) {
    const data = res?.data
      .map((x) => ({
        value: x.ProductID,
        name: x.ProductName,
      }))
      .filter((x) => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
    return data;
  }
}
export async function GetContractListFromApi(masterService) {
  let req = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "cust_contract",
    filter: {},
  };
  const res = await masterService.masterPost("generic/get", req).toPromise();
  if (res) {
    const data = res?.data
      .filter((x) => x != null)
      .sort((a, b) => a.cONID.localeCompare(b.value))
      .map((item) => ({
        ...item,
        status: "Active", // You need to replace this with your actual status calculation logic
      }));

    return data;
  }
}
