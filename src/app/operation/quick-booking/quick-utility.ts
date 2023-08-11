export async function getCity(companyCode, masterService) {
    const req = {
      companyCode: companyCode,
      type: "masters",
      collection: "city_detail",
    };
  
    try {
      const res: any = await masterService.masterPost("common/getall", req).toPromise();
      if (res && res.data) {
        const city = res.data
          .map((x) => ({ name: x.cityName, value: x.cityName }))
          .filter((x) => x.name !== undefined && x.value !== undefined);
        return city;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      return null;
    }
  }