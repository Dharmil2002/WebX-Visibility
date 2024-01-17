import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { getValueFromJsonControl } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import Swal from "sweetalert2";
import { FilterUtils } from "src/app/Utility/dropdownFilter";

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

    constructor(
        private operation: OperationService,
        private storage: StorageService,
        private filter: FilterUtils
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
                nLoc: '',
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
            "ccontactNumber": data.cSGEPH,
            "calternateContactNo": data.cSGEPH2,
            "consigneeCode": data.cSGECD,
            "consigneeName": data.cSGENM,
            "deliveryAddress": data.dADD,
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
            pADD: docket["pAddress"],
            cSGEPH: docket["ccontactNumber"],
            cSGEPH2: docket["calternateContactNo"],
            cSGECD: docket["consigneeName"].value,
            cSGENM: docket["consigneeName"].name,
            dADD: docket["deliveryAddress"],
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
            cHRWT:CWtKg,
            pKGS:Pkg
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
            "_id": `${this.storage.companyCode}${data.docketNumber}-1-EVN0002` + new Date(),
            "cID": this.storage.companyCode,
            "dKTNO": data.docketNumber,
            "sFX": 1,
            "cNO": null,
            "lOC": this.storage.branch,
            "eVNID": "EVN0002",
            "eVNDES": "Update Shipment",
            "eVNDT": new Date(),
            "eVNSRC": "Docket Update",
            "nLOC": null,
            "dOCTY": "CN",
            "dOCNO": "",
            "eTA": null,
            "sTS": "2",
            "sTSNM": "Update Shipment",
            "oPSTS": "1",
            "eNTDT": new Date(),
            "eNTLOC": this.storage.branch,
            "eNTBY": this.storage.userName
        }
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_events",
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
    async getDocketsForAutoComplete(form, jsondata, controlName, codeStatus,billingParty="") {
       
        try {
          const dValue = form.controls[controlName].value;
    
          // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
          if (dValue.length >= 3) {
            let filter = {
                docNo: { 'D$regex': `^${dValue}`, 'D$options': 'i' },
                jOBNO: "",
                'D$or': [
                    { oRGN: this.storage.branch },
                    { dEST: this.storage.branch }
                ]
            };
            if (billingParty) {
                filter['bPARTY'] = billingParty;
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
            const codeData = dResponse.data.map((x) => { return { name: x.docNo, value: x.docNo,docketData:x } });
    
            // Filter cityCodeData for partial matches
            if (codeData.length === 0) {
              // Show a popup indicating no data found for the given pincode
              console.log(`No data found for Docket ${dValue}`);
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
          else{
            return [];
          }
        } catch (error) {
          // Handle any errors that may occur during the asynchronous operation
          console.error("Error fetching data:", error);
        }
      }
      async getDocketDetails(filter={}) {
        try {
            // Prepare the pincodeBody with the companyCode and the determined filter
            const cityBody = {
                companyCode: localStorage.getItem("companyCode"),
                collectionName: "docket_containers",
                filter:filter
            };
            // Fetch pincode data from the masterService asynchronously
            const dResponse = await firstValueFrom(this.operation.operationMongoPost("generic/get", cityBody));
            return dResponse
        } catch (error) {
        }
      }
}