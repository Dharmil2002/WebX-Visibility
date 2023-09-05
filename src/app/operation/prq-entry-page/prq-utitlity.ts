import Swal from 'sweetalert2';
import { geoDataServices } from '../error-handing/outbox-utility';
export async function addPrqData(prqData, masterService, retryAndDownloadService, geoLocationService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "prq_detail",
        data: prqData
    }
    const maxRetries = 3;
    try {
        const getlocation = await geoDataServices(geoLocationService);
        const res = await retryAndDownloadService.retryWithDownload(
            masterService,
            "generic/create",
            reqBody,
            maxRetries,
            "PrqEntry",
            getlocation
        );
        return res
    } catch (error) {

    }
}

export async function updatePrqStatus(prqData,masterService) {
    delete prqData.srNo
    delete prqData.Action
    const reqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "prq_detail",
        "filter": { prqId: prqData.prqNo || prqData.prqId || "" },
        "update": {
            ...prqData,
        }
    }
    const res = masterService.masterMongoPut("generic/update", reqBody).toPromise();
    return res
}


export async function showConfirmationDialog(prqDetail, masterService, goBack, tabIndex) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        prqDetail.status = "1";
        delete prqDetail._id
        delete prqDetail.srNo

        const res = await updatePrqStatus(prqDetail, masterService);
        if (res) {
            goBack(tabIndex);
        }
    }
}
export async function vehicleStatusUpdate(rptLoc, companyCode, arrivalData, prqdata, operation, isClose) {
    try {
        if (!rptLoc || !companyCode || !arrivalData || !arrivalData.vehNo) {
            throw new Error("Missing required data for vehicle status update. Ensure all parameters are provided.");
        }

        let vehicleDetails = {
            rptLoc,
            status: isClose ? "In Transit" : "available",
            ...(isClose
                ? {
                    tripId: prqdata.prqNo,
                    capacity: prqdata.vehicleSize,
                    FromCity: arrivalData.fromCity,
                    ToCity: arrivalData.toCity,
                    distance: arrivalData.distance,
                    currentLocation: localStorage.getItem("Branch"),
                    updateBy: localStorage.getItem("Username"),
                    updateDate: new Date().toISOString()
                }
                : {})
        };

        const reqBody = {
            companyCode,
            collectionName: "vehicle_status",
            filter: { _id: arrivalData.vehNo },
            update: { ...vehicleDetails }
        };

        const vehicleUpdate = await operation.masterPut("generic/update", reqBody).toPromise();
        return vehicleUpdate; // Optionally, you can return the updated vehicle data.
    } catch (error) {
        throw error; // Re-throw the error to be handled at a higher level or log it.
    }
}

export async function locationFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "location_detail",
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const filterMap = res?.data?.map(x => ({ value: x.locCode, name: x.locName, city: x.locCity })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}


export async function customerFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "customer_detail",
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const filterMap = res?.data?.map(x => ({ value: x.customerCode, name: x.customerName })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}
