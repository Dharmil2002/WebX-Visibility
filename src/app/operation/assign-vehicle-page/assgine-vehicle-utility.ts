import Swal from "sweetalert2";
import { updatePrqStatus, vehicleStatusUpdate } from "../prq-entry-page/prq-utitlity";

export async function showVehicleConfirmationDialog(prqDetail, masterService, goBack, tabIndex, dialogRef, item) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        prqDetail.status = "2";
        delete prqDetail.actions
        const res = await updatePrqStatus(prqDetail, masterService);
        let currentBranch = localStorage.getItem("Branch") || '';
        let companyCode = parseInt(localStorage.getItem('companyCode'));
        const result = await vehicleStatusUpdate(currentBranch, companyCode, item, prqDetail, masterService, true);
        if (res && result) {
            const confirmationResult = await Swal.fire({
                icon: "success",
                title: "Assignment Success",
                text: "The vehicle has been successfully assigned.",
                confirmButtonText: "OK",
            });
            
            if (confirmationResult.isConfirmed) {
                goBack(tabIndex);
                dialogRef.close();
            }
        }
    }
    

}


/**
 * Fetches vehicle status data from the API.
 *
 * This function makes an asynchronous API call to retrieve vehicle status data from a service,
 * using the company code and type "operation". It sends a request to the API endpoint "common/getall"
 * with the specified request body containing the companyCode and collection name "vehicle_status".
 *
 * @returns {Promise<any>} A promise that resolves with the vehicleDetail data obtained from the API.
 *                        The structure of the data may vary based on the API response.
 *
 * @throws {any} If an error occurs during the API call, it will be caught and re-thrown to propagate it
 *              to the calling code. The error message will be logged to the console as well.
 */
export async function getVehicleStatusFromApi(companyCode, operationService) {
    const reqbody = {
        companyCode: companyCode,
        collectionName: "vehicle_status",
        filter: {
            status: 'Available'
        }
    };

    try {
        const vehicleDetail = await operationService.operationMongoPost("generic/get", reqbody).toPromise();
        // Do something with the vehicleDetail data here
        return vehicleDetail.data; // Optionally, return the vehicleDetail data
    } catch (error) {
        // Handle any errors that might occur during the API call
        console.error("Error fetching vehicle details:", error);
        throw error; // Optionally, re-throw the error to propagate it to the calling code
    }
}


///////  ********** Tables *********** ////////////

export class AssignVehiclePageMethods {
    columnHeader = [{
        vehNo: {
            Title: "Vehicle No",
            class: "matcolumnleft",
            Style: "min-width:80px",
        },
        fromCity: {
            Title: "From City",
            class: "matcolumnleft",
            Style: "min-width:80px",
        },
        toCity: {
            Title: "To City",
            class: "matcolumnleft",
            Style: "min-width:2px",
        },
        currentLocation: {
            Title: "Current Location",
            class: "matcolumnleft",
            Style: "min-width:200px",
        },
        distannce: {
            Title: "Distance (KMs)",
            class: "matcolumncenter",
            Style: "min-width:40px",
        },
        capacity: {
            Title: "Vehicle Size (MTs)",
            class: "matcolumncenter",
            Style: "min-width:100px",
        },
        action: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "min-width:100px",
        }
    }];

}
//add here method to bind data using market vehicle 
export async function bindMarketVehicle(vehicledata: any) {
    let currentDate = new Date();
    let threeHoursLater = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);

    const marketVehicle = {
        vehNo:vehicledata?.vehicelNo||"",
        distannce:0,
        currentLocation:localStorage.getItem("Branch"),
        capacity:vehicledata.vehicleSize,
        vendorType:'Market',
        vendor:vehicledata.vendor,
        vMobNo:vehicledata.vMobileNo,
        driver:vehicledata.driver,
        dMobNo:vehicledata.dmobileNo,
        lcNo:vehicledata.lcNo,
        driverPan:vehicledata.driverPan,
        lcExpireDate:vehicledata.lcExpireDate,
        eta:threeHoursLater,
        updateBy:localStorage.getItem('UserName'),
        updateDate:new Date()
    }
  return marketVehicle;
}