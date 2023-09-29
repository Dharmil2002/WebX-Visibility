export async function updatePrq(operationService, data,status) {
  const reqBody = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "prq_detail",
    filter: {
      _id: data.prqId, // Use the current PRQ ID in the filter
    },
    update: {
      status: status,
    },
  };
  const res = await operationService
    .operationPut("generic/update", reqBody)
    .toPromise();
  return res;
}

export async function containorConsigmentDetail(operationService) {
  const containerReq = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "container_detail",
    filter: {},
  };
  const containerResponse = await operationService
    .operationPost("generic/get", containerReq)
    .toPromise();
    const dropdown = containerResponse.data
    .map((x) => {
      return {
        name: x.containerType,
        value: x.containerType,
        loadCapacity: x.loadCapacity,
      };
    })
    .filter((x) => x.name !== undefined && x.value !== undefined && x.loadCapacity !== undefined);

  return dropdown;
}
