export async function geoDataServices(geolocationService) {
    try {
        const location = await geolocationService.getLocation().toPromise();
        const locationString = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
        return locationString
    } catch (error) {
        // Handle error here
        console.error('Error retrieving location:', error);
        throw error; // You can rethrow the error or handle it differently based on your needs
    }
}
export async function sendRequest(masterService,data) {
    try {
      const config = {
        url: data.url,
        method: data.method,
        request: data.request
      };
  
      const res = await masterService.sendRequest(config).toPromise();
      return res      
    } catch (error) {
      // Handle errors here
    }
  }
  