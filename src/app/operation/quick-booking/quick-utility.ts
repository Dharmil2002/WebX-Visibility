export async function getCity(companyCode, masterService) {
    const req = {
      companyCode: companyCode,
      collectionName: "city_detail",
      filter:{}
    };
  
    try {
      const res: any = await masterService.masterMongoPost("generic/get",req).toPromise();
      if (res && res.data) {
        const city = res.data
          .map((x) => ({ name: x.cityName, value: x.cityName }))
          .filter((x) => x.name !== undefined && x.value !== undefined);
        city.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order
        return city;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      return null;
    }
  }