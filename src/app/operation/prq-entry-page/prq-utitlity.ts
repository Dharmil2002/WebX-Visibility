import { debug } from 'console';
import Swal from 'sweetalert2';

export async function addPrqData(prqData, masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "prq_summary",
        data: prqData
    }
    const res = await masterService.masterMongoPost("generic/create", reqBody).toPromise();
    return res
}

export async function updatePrqStatus(prqData, masterService) {
    delete prqData.srNo
    delete prqData.Action

    const reqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "prq_summary",
        "filter": { 
            cID: prqData.cID || localStorage.getItem('companyCode'),
            pRQNO:  prqData.pRQNO || prqData.docNo || ""
        },
        "update": {
            ...prqData,
            mODBY: localStorage.getItem('UserName'),
            mODLOC: localStorage.getItem('Branch'),
            mODDT: new Date()
        }
    }
    
    const res = await masterService.masterMongoPut("generic/update", reqBody).toPromise();
    return res
}


export async function showConfirmationDialog(prqDetail, masterService, goBack, tabIndex, status) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        prqDetail.status = status;
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
                    updateBy: localStorage.getItem("UserName"),
                    updateDate: new Date()
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
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const filterMap = res?.data?.map(x => ({ value: x.locCode, name: x.locName, city: x.locCity, state: x.locState })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}


export async function customerFromApi(masterService) {
    const branch = localStorage.getItem("Branch");
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "customer_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res?.data.filter((x) => x.customerLocations.includes(branch)).map(x => ({ value: x.customerCode, name: x.customerName, pinCode: x.PinCode, mobile: x.customer_mobile })) ?? null;
        return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function containerFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "container_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const filterMap = res?.data?.map(x => ({ value: x.containerCode, name: x.containerName })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

