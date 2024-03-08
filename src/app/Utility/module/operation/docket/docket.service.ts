import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { getValueFromJsonControl } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import Swal from "sweetalert2";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { financialYear } from "src/app/Utility/date/date-utils";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { format, isValid, parseISO } from "date-fns";
import moment from "moment";
import { roundNumber } from "src/app/Utility/commonfunction";
import { ConvertToDate, ConvertToNumber, isValidDate, roundToNumber } from "src/app/Utility/commonFunction/common";
import { DocketFinStatus, DocketStatus } from "src/app/Models/docStatus";
@Injectable({
    providedIn: "root",
})
export class DocketService {
    vehicleDetail: any;
    // Define a mapping object
    statusMapping = {
        default: {
            status: "",
            actions: [""],
        },
        "1": {
            status: "Booked",
            actions: ["Edit Docket"],
        },
        "2": {
            status: "Thc Generated",
            actions: [""],
        },
        "3": {
            status: "Delivered",
            actions: [""],
        }
        // Add more status mappings as needed
    };
    statusLTLMapping = {
        default: {
            status: "",
            actions: [""],
        },
        "0": {
            status: "Quick Completion",
            actions: ["Edit Docket"],
        },
        "1": {
            status: "Booked",
            actions: [""],
        },
        "2": {
            status: "Loading Sheet Generated",
            actions: [""],
        },
        "3": {
            status: "Manifest Sheet Generated",
            actions: [""],
        },
        "4": {
            status: "Departed",
            actions: [""],
        },
        "5": {
            status: "Arrived",
            actions: [""],
        },
        "6": {
            status: `${"In stock"} ${"at"} ${this.storage.branch}`,
            actions: [""],
        },
        "7": {
            status: `${"In stock available for delivery "} ${"at"} ${this.storage.branch}`,
            actions: [""],
        }
        // Add more status mappings as needed
    };


    constructor(
        private operation: OperationService,
        private storage: StorageService,
        private filter: FilterUtils,
        private navService: NavigationService
    ) { }

    async updateDocket(data, filter) {

        // Define the request body with companyCode, collectionName, and an empty filter
        const reqBody = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "dockets",
            filter: { "docNo": filter },
            update: data
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operation.operationMongoPut("generic/update", reqBody).toPromise();
        return result;
    }

    async updateDocketSuffix(filter, data) {
        // Define the request body with companyCode, collectionName, and an empty filter
        const reqBody = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "docket_operation_details",
            filter: filter,
            update: data
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operation.operationMongoPut("generic/update", reqBody).toPromise();
        return result;
    }

    bindData(dataArray, targetArray) {
        if (dataArray.length > 0) {
            const modifiedData = dataArray.map((x, index) => {
                if (x) {
                    x.id = index;
                    return x;
                }
                return x;
            });
            targetArray = modifiedData;
        }
    }

    /* below the function  was generated for the mapping of data */
    // Define a common service function
    async processShipmentList(shipmentList, orgBranch) {

        const res = shipmentList.map((x) => {
            if (x.oRGN === orgBranch || (x.dEST == orgBranch && x.status == "2")) {

                // Assuming x.status is a string (e.g., "0", "1", "2", etc.)
                const statusInfo = this.statusMapping[x.oSTS] || this.statusMapping.default;
                x.ftCity = `${x.fCT}-${x.tCT}`;
                x.status = statusInfo.status || "";
                x.actions = statusInfo.actions;
                x.aCTWT = Number(x.aCTWT || 0).toFixed(2); // Ensure two decimal places
                x.billingParty = `${x.bPARTY}:${x.bPARTYNM}`//x.billingParty || "";
                x.createOn = formatDocketDate(x?.eNTDT || new Date())
                return x;
            }
            return null;
        }).filter((x) => x !== null);
        // Sort the PRQ list by pickupDate in descending order
        const sortedData = res.sort((a, b) => {
            const dateA: Date | any = new Date(a.eNTDT);
            const dateB: Date | any = new Date(b.eNTDT);

            // Compare the date objects
            return dateB - dateA; // Sort in descending order
        });
        return sortedData
    }
    /*End*/

    async getDocket() {
        const req = {
            "companyCode": localStorage.getItem("companyCode"),
            "filter": { origin: this.storage.branch },
            "collectionName": "docket_temp"
        }

        const res = await this.operation.operationMongoPost('generic/get', req).toPromise();
        return res.data;
    }
    async getDockets(filter) {
        const req = {
            "companyCode": localStorage.getItem("companyCode"),
            "filter": filter,
            "collectionName": "dockets"
        }

        const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
        return res.data;
    }

    async addDktDetail(data) {

        const req = {
            "companyCode": localStorage.getItem("companyCode"),
            "collectionName": "docket_operation_details",
            "data": data
        }

        const res = await this.operation.operationMongoPost('generic/create', req).toPromise();
        return res.data;
    }

    async updateSelectedData(selectedData: any[], tripId = "") {
        for (const element of selectedData) {
            const data = {
                tOTWT: parseFloat(element.orgTotWeight) - parseFloat(element.totWeight),
                tOTPKG: parseFloat(element.orgNoOfPkg) - parseFloat(element.noOfPkg),
                mODDT: new Date(),
                mODBY: this.storage.userName
            };

            const filter = {
                dKTNO: element.docketNumber
            };

            await this.updateDocketSuffix(filter, data);

            const DktNew = {
                cID: this.storage.companyCode,
                dKTNO: element.docketNumber,
                sFX: parseInt(element.sFX) + 1,
                cLOC: this.storage.branch,
                cNO: '',
                tId: tripId,
                tOTWT: element.totWeight,
                tOTPKG: element.noOfPkg,
                vEHNO: '',
                aRRTM: '',
                aRRPKG: '',
                aRRWT: '',
                dTime: new Date(),
                dPKG: element.noOfPkg,
                dWT: element.totWeight,
                sTS: '',
                sTSTM: '',
                eNTLOC: "",
                eNTBY: this.storage.userName,
                eNTDT: new Date(),
                mODDT: "",
                mODLOC: "",
                mODBY: ""
            };

            await this.addDktDetail(DktNew);

        }
    }
    /*added docket billing details*/
    async addBilldkt(data) {

        const req = {
            "companyCode": this.storage.companyCode,
            "collectionName": "dockets_bill_details",
            "data": data
        }
        const res = await this.operation.operationMongoPost('generic/create', req).toPromise();
        return res.data;
    }
    async docketObjectMapping(data) {
        const docket = {
            "_id": data.docNo,
            "docketNumber": data.dKTNO,
            "docketDate": data.dKTDT,
            "billingParty": data.bPARTY,
            "billingPartyName": data.bPARTYNM,
            "payType": data.pAYTYP,
            "origin": data.oRGN,
            "fromCity": data.fCT,
            "toCity": data.tCT,
            "destination": data.dEST,
            "prqNo": data.pRQNO,
            "transMode": data.tRNMOD,
            "containerSize": data.pKGTY,
            "containerNumber": data.pRLR,
            "vendorType": data.vENDTY,
            "vendorName": data.vNDNM,
            "vendorCode": data.vNDCD,
            "cnbp": data.iSCNBP,
            "cnebp": data.iSCEBP,
            "consignorCode": data.cSGNCD,
            "consignorName": data.cSGNNM,
            "pAddress": data.pADD,
            "pAddressCode": data.pADDCD,
            "ccontactNumber": data.cSGEPH,
            "calternateContactNo": data.cSGEPH2,
            "consigneeCode": data.cSGECD,
            "consigneeName": data.cSGENM,
            "deliveryAddress": data.dADD,
            "deliveryAddressCode": data.dADDCD,
            "cncontactNumber": data.cSGNPH,
            "cnalternateContactNo": data.cSGNPH2,
            "companyCode": data.cID,
            "cd": data.iSCONT,
            "vehicleNo": data.vEHNO,
            "delivery_type": data.dELTY,
            "risk": data.rSKTY,
            "gp_ch_del": data.gPCHD,
            "weight_in": data.wTIN,
            "packaging_type": data.pKGTY,
            "edd": data.iSSFRMN,
            "pr_lr_no": data.pRLR,
            "issuing_from": data.iSSFRM,
            "status": data.oSTS,
            "freight_amount": data.fRTAMT,
            "freight_rate": data.fRTRT,
            "freightRatetype": data.fRTRTY,
            "otherAmount": data.oTHAMT,
            "grossAmount": data.gROAMT,
            "rcm": data.rCM,
            "gstAmount": data.gSTAMT,
            "gstChargedAmount": data.gSTCHAMT,
            "totalAmount": data.tOTAMT,
            "isComplete": data.isComplete,
            "unloading": data.unloading,
            "lsNo": data.jOBNO,
            "mfNo": data.mFNO,
            "entryBy": data.eNTBY,
            "entryDate": data.eNTDT,
            "unloadloc": data.eNTLOC,
            "tran_day": data.tRNHR,
            "tran_hour": data.tRNHR,
            "actualWeight": data.aCTWT,
            "cnoAddress": data.cSGNADD,
            "cnogst": data.cSGNGST,
            "cneAddress": data.cSGEADD,
            "cnegst": data.cSGEGST,
            "vehicleDetail": null,
            "invoiceDetails": [],
            "containerDetail": []
        };
        return docket
    }
    async reverseDocketObjectMapping(docket, jsonControl) {

        const pAYTYP = getValueFromJsonControl(jsonControl, "payType", docket.payType);
        const tRNMOD = getValueFromJsonControl(jsonControl, "transMode", docket.transMode);
        const vENDTY = getValueFromJsonControl(jsonControl, "vendorType", docket.vendorType);
        const dELTYNM = getValueFromJsonControl(jsonControl, "delivery_type", docket.delivery_type);
        const risk = getValueFromJsonControl(jsonControl, "risk", docket.risk);
        const weight_in = getValueFromJsonControl(jsonControl, "weight_in", docket.weight_in);
        const issuing_from = getValueFromJsonControl(jsonControl, "issuing_from", docket.issuing_from);
        const freightRatetype = getValueFromJsonControl(jsonControl, "freightRatetype", docket.freightRatetype);
        const Pkg = docket.invoiceDetails ? docket.invoiceDetails.reduce((a, c) => a + (parseInt(c.noofPkts) || 0), 0) : 0;
        const Wt = docket.invoiceDetails ? docket.invoiceDetails.reduce((a, c) => a + (parseFloat(c.actualWeight) || 0), 0) : 0;
        const CWt = docket.invoiceDetails ? docket.invoiceDetails.reduce((a, c) => a + (parseFloat(c.chargedWeight) || 0), 0) : 0;
        const WtKg = Wt * 1000; // Convert Wt to kg (tons to kg)
        const CWtKg = CWt * 1000; // Convert CWt to kg (tons to kg)
        const data = {
            docNo: docket["docketNumber"],
            dKTNO: docket["docketNumber"],
            dKTDT: docket["docketDate"],
            bPARTY: docket["billingParty"].value,
            bPARTYNM: docket["billingParty"].name,
            pAYTYP: docket["payType"],
            pAYTYPNM: pAYTYP,
            oRGN: docket["origin"],
            fCT: docket["fromCity"],
            tCT: docket["toCity"],
            dEST: docket["destination"],
            pRQNO: docket["prqNo"],
            tRNMOD: docket["transMode"],
            tRNMODNM: tRNMOD,
            vENDTY: docket["vendorType"],
            vENDTYNM: vENDTY,
            vNDNM: docket["vendorType"] == "4" ? docket["vendorName"] : docket["vendorName"].name,
            vNDCD: docket["vendorType"] == "4" ? "8888" : docket["vendorName"].value,
            iSCNBP: docket["cnbp"],
            iSCEBP: docket["cnebp"],
            cSGNCD: docket["consignorName"].value,
            cSGNNM: docket["consignorName"].name,
            cSGNADD: docket["cnoAddress"].name,
            cSGNGST: docket["cnogst"].value,
            cSGEADD: docket["cneAddress"].name,
            cSGEGST: docket["cnegst"].value,
            pADDCD: docket["pAddress"]?.value || "A8888",
            pADD: docket["pAddress"]?.name || docket["pAddress"],
            cSGEPH: docket["ccontactNumber"],
            cSGEPH2: docket["calternateContactNo"],
            cSGECD: docket["consigneeName"].value,
            cSGENM: docket["consigneeName"].name,
            dADDCD: docket["deliveryAddress"]?.value || "A8888",
            dADD: docket["deliveryAddress"]?.name || docket["deliveryAddress"],
            cSGNPH: docket["cncontactNumber"],
            cSGNPH2: docket["cnalternateContactNo"],
            cID: docket["companyCode"],
            iSCONT: docket["cd"],
            vEHNO: docket["vehicleNo"].value,
            dELTY: docket["delivery_type"],
            dELTYNM: dELTYNM,
            rSKTY: docket["risk"],
            rSKTYNM: risk,
            gPCHD: docket["gp_ch_del"],
            wTIN: weight_in,
            pRLR: docket["pr_lr_no"],
            iSSFRM: docket["issuing_from"],
            iSSFRMNM: issuing_from,
            fRTAMT: docket["freight_amount"],
            fRTRT: docket["freight_rate"],
            fRTRTY: docket["freightRatetype"],
            fRTRTYNM: freightRatetype,
            oTHAMT: docket["otherAmount"],
            gROAMT: docket["grossAmount"],
            rCM: docket["rcm"],
            gSTAMT: docket["gstAmount"],
            gSTCHAMT: docket["gstChargedAmount"],
            tOTAMT: docket["totalAmount"],
            mODBY: this.storage.userName,
            mODDT: new Date(),
            mODLOC: this.storage.branch,
            tRNHR: docket["tran_hour"],
            aCTWT: WtKg,
            cHRWT: CWtKg,
            pKGS: Pkg
        };

        return data;
    }

    async getDocketByDocNO(docNo, collectionName = "dockets") {
        const req = {
            "companyCode": this.storage.companyCode,
            "filter": { dKTNO: docNo },
            "collectionName": collectionName
        }
        const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
        return res.data;
    }
    async updateManyDockets(data, filter, collectionName) {

        try {
            const commonRequestData = {
                companyCode: this.storage.companyCode,
                collectionName: collectionName,
                filter: filter,
            };

            // Check if there are documents to delete
            const findResponse = await firstValueFrom(this.operation.operationPost("generic/get", commonRequestData));
            if (findResponse.data && findResponse.data.length > 0) {
                // Delete documents if found
                await firstValueFrom(this.operation.operationMongoRemove("generic/removeAll", commonRequestData));
            }

            // Insert new data
            const insertRequest = {
                companyCode: this.storage.companyCode,
                collectionName: collectionName,
                data: data
            };
            const insertResponse = await firstValueFrom(this.operation.operationMongoPost('generic/create', insertRequest));

            return insertResponse.data;
        } catch (error) {
            // Handle errors (you can also log them or throw them depending on your error handling strategy)
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update dockets.'
            });
            throw error;
        }
    }

    async addEventData(data) {
        const evnData = {
            "_id": `${this.storage.companyCode}${data.docketNumber}-1-EVN0002-${moment().format("YYYYMMDDHHmmss")}`,
            "cID": this.storage.companyCode,
            "dKTNO": data.docketNumber,
            "sFX": 1,
            "cNO": null,
            "lOC": this.storage.branch,
            "eVNID": "EVN0002",
            "eVNDES": "Docket Entry",
            "eVNDT": new Date(),
            "eVNSRC": "Docket Entry",
            "dOCTY": "CN",
            "dOCNO": "",
            "sTS": DocketStatus.Booked,
            "sTSNM": DocketStatus[DocketStatus.Booked],
            "oPSSTS": `Booked at ${this.storage.branch} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
            "eNTLOC": this.storage.branch,
            "eNTBY": this.storage.userName
        }
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_events_ltl",
            data: evnData
        }
        const res = await firstValueFrom(this.operation.operationMongoPost('generic/create', req));
        return res;
    }
    async updateOperationData(data) {

        let opsData = {
            "tOTWT": data.invoiceDetails.reduce((totalWeight, invoiceDetail) => totalWeight + invoiceDetail.actualWeight, 0),
            "tOTPKG": data.invoiceDetails.reduce((tOTPKG, noofPkts) => tOTPKG + noofPkts.noofPkts, 0),
            "vEHNO": data.vehNo,
            "mODDT": new Date(),
            "mODLOC": this.storage.branch,
            "mODBY": this.storage.userName
        }
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_ops_det",
            filter: { docNo: data.docketNumber },
            update: opsData
        }
        const res = await firstValueFrom(this.operation.operationMongoPut('generic/update', req));
        return res;
    }
    async getDocketsForAutoComplete(form, jsondata, controlName, codeStatus, billingParty = "", isJob = false) {

        try {
            const dValue = form.controls[controlName].value;

            // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
            if (dValue.length >= 3) {
                let filter = {
                    docNo: { 'D$regex': `^${dValue}`, 'D$options': 'i' },
                    'D$or': [
                        { oRGN: this.storage.branch },
                        { dEST: this.storage.branch },
                        { rAKENO: { 'D$exists': false } }
                    ]
                };
                if (billingParty) {
                    filter['bPARTY'] = billingParty;
                }
                if (isJob) {
                    filter['jOBNO'] = ""
                }
                // Prepare the pincodeBody with the companyCode and the determined filter
                const cityBody = {
                    companyCode: localStorage.getItem("companyCode"),
                    collectionName: "dockets",
                    filter,
                };

                // Fetch pincode data from the masterService asynchronously
                const dResponse = await firstValueFrom(this.operation.operationMongoPost("generic/get", cityBody));

                // Extract the cityCodeData from the response 
                /*here i return one more field other then name value beacuase it  used in Job entry Module*/
                const codeData = dResponse.data.map((x) => { return { name: x.docNo, value: x.docNo, docketData: x } });

                // Filter cityCodeData for partial matches
                if (codeData.length === 0) {
                    // Show a popup indicating no data found for the given pincode
                    // Swal.fire({
                    //   icon: "info",
                    //   title: "No Data Found",
                    //   text: `No data found for Customer ${cValue}`,
                    //   showConfirmButton: true,
                    // });
                } else {
                    // Call the filter function with the filtered data
                    this.filter.Filter(
                        jsondata,
                        form,
                        codeData,
                        controlName,
                        codeStatus
                    );
                    return codeData;
                }
            }
            else {
                return [];
            }
        } catch (error) {
            // Handle any errors that may occur during the asynchronous operation
            console.error("Error fetching data:", error);
        }
    }
    async getDocketDetails(filter = {}) {
        try {
            // Prepare the pincodeBody with the companyCode and the determined filter
            const cityBody = {
                companyCode: localStorage.getItem("companyCode"),
                collectionName: "docket_containers",
                filter: filter
            };
            // Fetch pincode data from the masterService asynchronously
            const dResponse = await firstValueFrom(this.operation.operationMongoPost("generic/get", cityBody));
            return dResponse
        } catch (error) {
        }
    }
    /* here the api is for only get LTL details */
    async getDocketsDetailsLtl(filter = {}) {

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "dockets_ltl",
            filter: filter
        }
        const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', reqBody));
        return res.data;
    }
    /*End*/
    /*here the code is for mapping of the LTL details*/
    async getMappingDocketDetails(dockets = []) {
        // Modify the data
        if (dockets.length > 0) {
            const modifiedData = dockets.map((item: any) => {

                let formattedDate = "";

                if (item.dKTDT) {
                    const parsedDate = parseISO(item.dKTDT);
                    if (isValid(parsedDate)) {
                        formattedDate = format(parsedDate, "dd-MM-yy HH:mm");
                    }
                }
                return {
                    no: item?.dKTNO ?? "",
                    sfx: item?.sFX ?? 0,
                    date: formattedDate,
                    paymentType: item?.pAYTYPNM ?? "",
                    contractParty: `${item?.bPARTY}-${item?.bPARTYNM}`,
                    orgdest: `${item?.oRGN ?? ""} : ${item?.dEST}`,
                    fromCityToCity: `${item?.fCT ?? ""} : ${item?.tCT ?? ""}`,
                    noofPackages: parseInt(item?.pKGS || 0),
                    chargedWeight: parseInt(item?.cHRWT || 0),
                    actualWeight: parseInt(item?.aCTWT || 0),
                    status: this.statusLTLMapping[item.sTS.toString()]?.status ?? "",
                    Action: item?.iSCOM == true
                        ? item?.STS == 1 ? "" : ""
                        : "Quick Completion",
                    isComplete: item?.iSCOM || false,
                    docketsDetails: item
                };
            });
            // Return the modified data
            modifiedData.sort((a: any, b: any) => {
                const dateA = a.eNTDT ? new Date(a.eNTDT) : null;
                const dateB = b.eNTDT ? new Date(b.eNTDT) : null;
                if (dateA && dateB) {
                    return dateB.getTime() - dateA.getTime();
                } else if (dateA) {
                    return -1;
                } else if (dateB) {
                    return 1;
                } else {
                    return 0;
                }
            });
            return modifiedData;
        }
    }
    /*End*/
    /**
     * Maps docket details from longhand to shorthand notation.
     * @param {Object} formData - The source data for mapping.
     * @returns {Object} - The mapped docket details in shorthand notation.
     */
    async quickDocketsMapping(formData) {

        return {
            "cID": this.storage.companyCode,
            "dKTNO": "", // If this is supposed to be a dynamic value, consider updating it similar to others
            "dKTDT": formData.docketDate,
            "pAYTYP": formData.payType,
            "pAYTYPNM": formData.pAYTYPNM,
            "bPARTY": formData.billingParty?.value || "",
            "bPARTYNM": formData.billingParty?.name || "",
            "oRGN": formData?.orgLoc || "",
            "cLOC": this.storage.branch || "",
            "iSCOM": false,
            "dEST": formData.destination.value,
            "fCT": formData.fromCity.value,
            "tCT": formData.toCity.value,
            "vEHNO": formData.vehNo?.value || (formData.vehNo || ""),
            "pKGS": formData?.totalChargedNoOfpkg || 0,
            "aCTWT": formData?.actualwt || 0,
            "cHRWT": formData?.chrgwt || 0,
            "cFTTOT": 0,
            "eNTDT": new Date(),
            "eNTBY": this.storage.userName,
            "eNTLOC": this.storage.branch,
            "oSTS": DocketStatus.Awaiting_Completion,
            "oSTSN": DocketStatus[DocketStatus.Awaiting_Completion].replace(/_/g, " "),
            "mOD": this.storage.mode,
            "cURR": "INR"
        };
    }
    /*End*/
    /*here the code for the docket Booking Create */
    async createDocket(data) {
        let reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "dockets_ltl",
            docType: "CN",
            branch: this.storage.branch,
            finYear: financialYear,
            timeZone: this.storage.timeZone,
            data: data,
            party: data["bPARTYNM"],
        };
        const res = await firstValueFrom(this.operation.operationMongoPost('operation/docket/ltl/create', reqBody)).then((res: any) => {
            Swal.fire({
                icon: "success",
                title: "Booked Successfully",
                text: "DocketNo: " + res.data,
                showConfirmButton: true,
            }).then((result) => {
                // Redirect to the desired page after the success message is confirmed.
                this.navService.navigateTotab(
                    "docket",
                    "dashboard/Index"
                );
            });
        })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Something went wrong! ${err.message}`,
                    showConfirmButton: true,
                });
            });;
        return res;
    }
    /*End*/
    /*here the code for the dashboard KPI for the list*/
    async kpiData(StockCountData: any[]): Promise<any[]> {
        const lsCount = StockCountData.filter((x) => x.state != 2);
        // Helper function to create a shipData object
        const createShipDataObject = (
            count: number,
            title: string,
            className: string
        ) => ({
            count,
            title,
            class: `info-box7 ${className} order-info-box7`,
        });

        // Create an array of shipData objects with dynamic values
        const shipData = [
            createShipDataObject(StockCountData.length, "Total", "bg-c-Bottle-light"),
            createShipDataObject(StockCountData.filter((x) => x.iSCOM == true).length, "Completion", "bg-c-Grape-light"),
            createShipDataObject(lsCount.length, "Loading Sheet", "bg-c-Daisy-light"),
            createShipDataObject(0, "Delivery", "bg-c-Grape-light"),
        ];
        return shipData;
    }
    /*End*/
    /*Here the code for the docket Field Mapping*/
    async docketLTLFieldMapping(data, isUpdate = false) {

        let docketField = {
            "_id": data?.id || "",
            "cID": this.storage.companyCode,
            "docNo": data?.docketNumber || "",
            "dKTNO": data?.docketNumber || "",
            "dKTDT": ConvertToDate(data?.docketDate),
            "pAYTYP": data?.payType || "",
            "pAYTYPNM": data?.payTypeName || "",
            "bPARTY": data?.billingParty.value || "",
            "bPARTYNM": data?.billingParty.name || "",
            "cLOC": this.storage.branch || "",
            "oRGN": data?.orgLoc || "",
            "fCT": data?.fromCity?.value || "",
            "dEST": data?.destination?.value || "",
            "tCT": data?.toCity?.value || "",
            "vEHNO": data?.vehNo?.value || (data?.vehNo || ""),
            "pKGS": parseInt(data?.totalChargedNoOfpkg || 0),
            "aCTWT": ConvertToNumber(data?.actualwt || 0, 3),
            "cHRWT": ConvertToNumber(data?.chrgwt || 0, 3),
            "iSCOM": true,
            "iSAPP": (data?.appoint == "Y") || false,
            "aPP": {
                "aPPHNO": data?.AppointmentContactNumber || "",
                "aPPDT": ConvertToDate(data?.AppointmentDate),
                "aPFRMTM": ConvertToDate(data?.AppointmentFromTime),
                "aPTOTM": ConvertToDate(data?.AppointmentToTime),
                "aPPRMK": data?.AppointmentRemarks || "",
                "aPNM": data?.NameOfPerson || ""
            },
            "cFTRATO": parseFloat(data?.cft_ratio || 0),
            "cFTTOT": ConvertToNumber(data?.cft_tot || 0),
            "cSGE": {
                "cD": data?.consignorName?.value || "",
                "nM": data?.consignorName?.name || "",
                "cT": data?.consignorCity?.value || "",
                "pIN": data?.consignorPinCode?.value || "",
                "aDD": data.consignorAddress?.name || data.consignorAddress,
                "aDDCD": data.consignorAddress?.value || "A8888",
                "gST": data?.consignorGSTINNO || "",
                "mOB": data?.consignorMobileNo || "",
                "tEL": data?.consignorTelephoneNo || "",
            },
            "cSGN": {
                "cD": data?.consigneeName?.value || "",
                "nM": data?.consigneeName?.name || "",
                "cT": data?.consigneeCity?.value || "",
                "pIN": data?.consigneePinCode?.value || "",
                "aDD": data?.consigneeAddress?.name || data.consigneeAddress,
                "aDDCD": data.consigneeAddress?.value || "A8888",
                "gST": data?.consigneeGSTINNO || "",
                "mOB": data?.consigneeMobNo || "",
                "tEL": data?.consigneeTelNo || "",
            },
            "eDD": ConvertToDate(data?.edd),
            "iSVOL": data?.f_vol || false,
            "iSLOCAL": data?.local || false,
            "iSODA": data?.oda || false,
            "fRTRT": ConvertToNumber(data?.fRTRT || 0, 2),
            "fRTRTY": data?.fRTRTY || "",
            "fRTRTYN": data?.fRTRTY || "",
            "fRTAMT": ConvertToNumber(data?.fRTAMT || 0, 2),
            "oTHAMT": ConvertToNumber(data?.oTHAMT || 0, 2),
            "gROAMT": ConvertToNumber(data?.gROAMT || 0, 2),
            "rCM": data?.rCM || "",
            "gSTAMT": ConvertToNumber(data?.gSTAMT || 0, 2),
            "gSTCHAMT": ConvertToNumber(data?.gSTCHAMT || 0, 2),
            "tOTAMT": ConvertToNumber(data?.tOTAMT || 0, 2),
            "pKGTYN": data?.pkgsTypeName || "",
            "pKGTY": data?.pkgsType || "",
            "rSKTY": data?.rskty || "",
            "rSKTYN": data?.rsktyName || "",
            "sVCTYP": data?.svcType || "",
            "sVCTYPN": data?.svcTypeName || "",
            "iNVTOT": ConvertToNumber(data?.totalDeclaredValue || 0, 2),
            "pARTQTY": parseInt(data?.totalPartQuantity || 0),
            "tRNMOD": data?.tranType || "",
            "tRNMODNM": data?.tranTypeName || "",
            "eNTBY": this.storage.userName,
            "eNTDT": new Date(),
            "eNTLOC": this.storage.branch,
            "oSTS": DocketStatus.Booked,
            "oSTSN": DocketStatus[DocketStatus.Booked],
            "fSTS": DocketFinStatus.Pending,
            "fSTSN": DocketFinStatus[DocketFinStatus.Pending],
            "cONTRACT": "",
        };

        let invoiceDetails = data.invoiceDetails.map((element) => {
            let l = ConvertToNumber(element?.LENGTH || 0, 3);
            let b = ConvertToNumber(element?.BREADTH || 0, 3);
            let h = ConvertToNumber(element?.HEIGHT || 0, 3);

            const invoiceJson = {
                "_id": isUpdate ? `${this.storage.companyCode}-${data?.docketNumber}-${element?.INVNO}` : "",
                "cID": this.storage.companyCode,
                "dKTNO": isUpdate ? data?.docketNumber : "",
                "iNVNO": element?.INVNO || "",
                "iNVDT": ConvertToDate(element?.INVDT),
                "vOL": {
                    "uNIT": "FT",
                    "l": roundToNumber(l, 3),
                    "b": roundToNumber(b, 3),
                    "h": roundToNumber(h, 3),
                    "cU": roundToNumber(l * b * h, 3),
                },
                "iNVAMT": ConvertToNumber(element?.DECLVAL || 0, 2),
                "cURR": "INR",
                "pKGS": parseInt(element?.NO_PKGS || 0),
                "cFTWT": ConvertToNumber(element?.CUB_WT || 0, 2),
                "aCTWT": ConvertToNumber(element?.ACT_WT || 0, 2),
                "cHRWT": ConvertToNumber(element?.ACT_WT || 0, 2),
                "mTNM": element?.Invoice_Product || "",
                "hSN": element?.HSN_CODE || "",
                "hSNNM": element?.HSN_CODE || "",
                "eWBNO": data?.ewbNo || "",
                "eWBDT": ConvertToDate(element?.ewbDate),
                "eXPDT": ConvertToDate(data?.ewbExprired),
                "eNTBY": this.storage.userName,
                "eNTDT": new Date(),
                "eNTLOC": this.storage.branch,
            }
            return invoiceJson;
        });

        docketField["iNVTOT"] = invoiceDetails.reduce((a, c) => a + (c.iNVAMT || 0), 0);
      return {"docketsDetails":docketField,"invoiceDetails":invoiceDetails};
   }
   /*End*/

    /*End*/
    /*here the Code for the FieldMapping while Full dock generated  via quick docket*/
    async operationsFieldMapping(data, invoiceDetails = []) {
        const ops = {
            dKTNO: data?.dKTNO || "",
            sFX: 0,
            oRGN: data?.oRGN || "",
            dEST: data?.dEST || "",
            cLOC: data?.oRGN || "",
            pKGS: parseInt(data?.pKGS || 0),
            aCTWT: ConvertToNumber(data?.aCTWT || 0, 3),
            cHRWT: ConvertToNumber(data?.cHRWT || 0, 3),
            cFTTOT: ConvertToNumber(data?.cFTTOT || 0, 3),
            vEHNO: data?.vEHNO || "",
            sTS: DocketStatus.Booked,
            sTSNM: DocketStatus[DocketStatus.Booked],
            sTSTM: ConvertToDate(data?.dKTDT),
            oPSSTS:`Booked at ${data?.oRGN} on ${moment(new Date()).tz(this.storage.timeZone).format('DD MMM YYYY @ hh:mm A')}.`,
            iSDEL: false,
            mODDT: data?.eNTDT,
            mODLOC: data?.eNTLOC || "",
            mODBY: data?.eNTBY || ""
        }
        //Prepare Event Data
        let evnData = {
            _id: `${this.storage.companyCode}-${data.dKTNO}-0-EVN0001-${moment(data?.eNTDT).format('YYYYMMDDHHmmss')}`,
            cID: this.storage.companyCode,
            dKTNO: data?.dKTNO || "",
            sFX: 0,
            lOC: this.storage.branch,
            eVNID: 'EVN0001',
            eVNDES: 'Booking',
            eVNDT: new Date(),
            eVNSRC: 'Quick Completion',
            dOCTY: 'CN',
            dOCNO: data?.dKTNO || "",
            sTS: DocketStatus.Booked,
            sTSNM: DocketStatus[DocketStatus.Booked],
            oPSSTS: `Booked at ${data?.oRGN} on ${moment(data?.dKTDT).format("DD MMM YYYY @ hh:mm A")}`,
            eNTDT: data?.eNTDT,
            eNTLOC: data?.eNTLOC || "",
            eNTBY: data?.eNTBY || ""
        };
        let reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_ops_det_ltl",
            filter: { dKTNO: data?.dKTNO },
            update: ops
        };
        await firstValueFrom(this.operation.operationMongoPut('generic/update', reqBody));
        let reqinvoice = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_invoices_ltl",
            data: invoiceDetails
        };
        await firstValueFrom(this.operation.operationMongoPost('generic/create', reqinvoice));
        let reqEvent = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_events_ltl",
            data: evnData
        };
        await firstValueFrom(this.operation.operationMongoPost('generic/create', reqEvent));
        return true
    }
    /*End*/
    /*below function is use in many places so Please change in wisely beacause it affect would be in many module*/
    async getDocketList(filter) {
        let matchQuery = filter
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_ops_det_ltl",
            filters: [
                {
                    D$match: matchQuery,
                },
                {
                    "D$lookup": {
                        "from": "dockets_ltl",
                        "let": { "docNoVar": "$dKTNO" }, // Define a variable "docNoVar" to use in the pipeline. Assumes "$dKTNO" is from "mfHeader"
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$expr": {
                                        "D$eq": ["$docNo", "$$docNoVar"] // Use "$docNo" from "dockets_ltl" and compare it with "docNoVar"
                                    }
                                }
                            }
                        ],
                        "as": "dockets"
                    },
                },
                {
                    'D$unwind': {
                        path: "$dockets",
                        preserveNullAndEmptyArrays: false,
                    }
                },
                {
                    'D$project': {
                        _id: 1,
                        cID: 1,
                        dKTNO: 1,
                        sFX: 1,
                        cLOC: 1,
                        tOTWT: 1,
                        tOTPKG: 1,
                        vEHNO: 1,
                        sTS: 1,
                        sTSNM: 1,
                        sTSTM: 1,
                        iSDEL: 1,
                        eNTDT: 1,
                        eNTLOC: 1,
                        eNTBY: 1,
                        mODBY: 1,
                        mODDT: 1,
                        mODLOC: 1,
                        tHC: 1,
                        oPSSTS: 1,
                        dEST: 1,
                        oRGN: 1,
                        aCTWT: 1,
                        cFTTOT: 1,
                        cHRWT: 1,
                        pKGS: 1,
                        dKTDT: "$dockets.dKTDT",
                        fCT: "$dockets.fCT",
                        tCT: "$dockets.tCT",
                        pAYTYP: "$dockets.pAYTYP",
                        pAYTYPNM: "$dockets.pAYTYPNM",
                        iSCOM: "$dockets.iSCOM",
                        bPARTY: "$dockets.bPARTY",
                        bPARTYNM: "$dockets.bPARTYNM",
                    },
                },
            ]

        }
        // Send request and handle response
        const res = await firstValueFrom(this.operation.operationMongoPost("generic/query", reqBody));
        return res.data;
    }
    async checkInvoiceExistLTL(filter) {

        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_invoices_ltl",
            filter: filter
        }
        const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
        return res.data.length > 0 ? true : false;
    }
}