import moment from "moment";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

export async function showConfirmationDialogThc(data, tripId, operationService, podDetails, vehicleNo, currentLocation, containerwise) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        const res = await updateThcStatus(data, tripId, operationService, podDetails, vehicleNo, currentLocation, containerwise);
        return res
    }

}
async function updateThcStatus(data, tripId, operationService, podDetails, vehicleNo, currentLocation, containerwise) {
    
    const updatePromises = podDetails.map(async (element) => {
        //Event = EVN0004: Delivered, EVN0005: Arrived
        //Status = 3: Delivered, 4: Arrived

        let eventId = (element.tCT.toUpperCase() === currentLocation.locCity.toUpperCase()) ? "EVN0004" : "EVN0005";
        let sts = (eventId == "EVN0004") ? 3 : 4;
        let stsnm = (eventId == "EVN0004") ? "Delivered" : "Arrived";
        let opsts = (eventId == "EVN0004") 
                    ? `Delivered at  ${localStorage.getItem('Branch') } on ${ moment().format('DD MMM YYYY @ HH:mm A')}`
                    : `Arrived at ${localStorage.getItem('Branch') } on ${ moment().format('DD MMM YYYY @ HH:mm A')}`;

        let filter = {                
            tHC: tripId,
            dKTNO: element.docNo,
            sFX: element.sFX || 0,
        };
        if (containerwise) {
            filter["cNO"] = element.cNO;
        }
        
        const reqBody = {
            "companyCode": localStorage.getItem('companyCode'),
            "collectionName": "docket_ops_det",
            "filter": filter,
            "update": {
                "sTS": sts,
                "sTSNM": stsnm,
                "oPSTS": opsts,
                "rMRK": element.remarks,
                "pOD": element.pod,
                "aRVTM": element.arrivalTime,
                "rBY": element.receiveBy,
                "aRRDT": data.aRR.aCTDT,
                "aRRPKG": element.pKGS,
                "aRRWT": element.aCTWT,
                "vEHNO": vehicleNo,
                "cLOC": localStorage.getItem('Branch'),
                "cCT": currentLocation.locCity.toUpperCase(),
                "tHC": ""
            }
        };
       
        const reqBodyDocketEvent = {
            "companyCode": localStorage.getItem('companyCode'),
            "collectionName": "docket_events",
            "data": {
                "_id": `${localStorage.getItem('companyCode')}-${element.docNo}-${element.sFX}-${element.cNO}-${eventId}-${element.arrivalTime}`,
                "cID": localStorage.getItem('companyCode'),
                "dKTNO": element.docNo,
                "sFX": element.sFX || 0,
                "cNO": element.cNO,
                "lOC": localStorage.getItem('Branch'),
                "eVNID": eventId,
                "eVNDES": (eventId == "EVN0004") ? "Delivered" : "Arrived",
                "eVNDT": new Date(),
                "eVNSRC":"THC Arrival",
                "nLOC": null,
                "dOCTY": "",
                "dOCNO": "",
                "eTA": null,
                "sTS": sts,
                "sTSNM": stsnm,
                "oPSTS": opsts,
                "eNTDT": new Date(),
                "eNTLOC": localStorage.getItem('Branch'),
                "eNTBY": localStorage.getItem('UserName'),
            }
        };
        await firstValueFrom(operationService.operationMongoPost("generic/create", reqBodyDocketEvent));
        return firstValueFrom(operationService.operationMongoPut("generic/update", reqBody));
    });
    // Wait for all pod updates to complete
    await Promise.all(updatePromises);

    const thcReqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "thc_summary",
        "filter": { docNo: tripId },
        "update": data
    };

    // Update THC summary
    const thcResult = await firstValueFrom(operationService.operationMongoPut("generic/update", thcReqBody));

    return thcResult;
}
