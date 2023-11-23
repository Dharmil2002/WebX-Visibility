/**
 * Retrieves the list of vendor contracts from the API.
 * @param {MasterService} masterService - The service used to communicate with the API.
 * @returns {Promise<Array>} - A promise that resolves to an array of vendor contracts.
 */
export async function getContractList(masterService, filterFieldName?: string, filterId?: string) {
    try {
        // Prepare request to fetch existing vendor contracts
        const request = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "vendor_contract",
            filter: { [filterFieldName]: filterId }
        };

        // Fetch vendor contract list from the API
        const vendorContractList = await masterService.masterPost("generic/get", request).toPromise();

        if (vendorContractList) {
            // Process the data to filter, sort, and map to the desired format
            const processedData = vendorContractList?.data
                .filter(contract => contract != null)
                .sort((a, b) => a.cNID.localeCompare(b.value))
                .map(item => ({
                    ...item,
                    status: "Active", // You need to replace this with your actual status calculation logic
                }));

            return processedData;
        }
    } catch (error) {
        // Handle errors appropriately (e.g., log, throw, or return a default value)
        console.error("Error fetching vendor contracts:", error);
        throw error; // Rethrow the error to be handled by the caller or provide a default value
    }
}
export async function getStatelist(masterService) {
    const stateReqBody = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        filter: {},
        collectionName: "state_master",
    };
    const StateList = await masterService.masterPost('generic/get', stateReqBody).toPromise();
    if (StateList) {
        return StateList.data.map(item => ({
            name: item.STNM,
            value: item.STSN
        }))
    }


}