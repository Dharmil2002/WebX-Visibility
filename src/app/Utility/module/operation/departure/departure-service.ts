import { Injectable } from "@angular/core";
import moment from "moment";
import { Observable, catchError, firstValueFrom, mergeMap, throwError } from "rxjs";
import { getNextLocation } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { ConvertToDate, ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { Collections, GenericActions } from "src/app/config/myconstants";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
import { VendorService } from "../../masters/vendor-master/vendor.service";
import { DocketEvents, DocketStatus, ThcStatus, VehicleStatus, getEnumName } from "src/app/Models/docStatus";
import { GetLeadgerInfoFromLocalStorage, VoucherInstanceType, VoucherType, ledgerInfo } from "src/app/Models/Finance/Finance";
import { financialYear } from "src/app/Utility/date/date-utils";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";

@Injectable({
  providedIn: "root"
})
export class DepartureService {

  statusActions = {
    "1": ["Create Trip"],
    "2": ["Vehicle Loading", "Cancel THC"],
    "3": ["Depart Vehicle", "Cancel THC"],
    //"4": "Mark Arrival",
    "6": ["Update Trip", "Cancel THC"],
    "7": ["Create Trip"],
    "default": [""]
  };
  snackBarUtilityService: any;
  accountingOnThc = false;
  vendCode;

  constructor(
    private operation: OperationService,
    private storage: StorageService,
    private operationService: OperationService,
    private vendor: VendorService,
    private voucherServicesService: VoucherServicesService,
    private masterService: MasterService,
    private controlPanel: ControlPanelService,
  ) {
  }
  async getRouteSchedule() {
    // Utility function to format route details with configurable keys
    const formatDetails = (data, keys) => data.map(element => ({
      id: element?._id || "",
      RouteandSchedule: `${element[keys.routeCodeKey]}:${element[keys.routeNameKey]}`,
      VehicleNo: element?.vEHNO || keys.defaultVehicleNo || "",
      TripID: element?.tHC || keys.defaultTripID || "",
      Scheduled: new Date().toISOString(),
      Expected: new Date(new Date().getTime() + 10 * 60000).toISOString(),
      Hrs: this.computeHoursDifference(new Date(), new Date(new Date().getTime() + 10 * 60000)).toFixed(2),
      status: element.sTS || "1",
      actions: this.statusActions[`${element.sTS}`] || keys.defaultAction || "Create Trip",
      location: element?.cLOC || element?.controlLoc || "",
    }));
    try {
      const tripDetails = await this.fetchData(Collections.trip_Route_Schedule, { cLOC: this.storage.branch, iSACT: true });
      const route = await this.fetchData(Collections.route_Master_LocWise, { controlLoc: this.storage.branch, isActive: true });
      const adHoc = await this.fetchData(Collections.adhoc_routes, { cLOC: this.storage.branch, iSACT: true });
      const departureDetails = formatDetails(tripDetails, { routeCodeKey: 'rUTCD', routeNameKey: 'rUTNM', defaultAction: 'Update Trip' });
      const routeDetails = formatDetails(route, { routeCodeKey: 'routeId', routeNameKey: 'routeName', defaultAction: 'Create Trip' });
      const adHocDetails = formatDetails(adHoc, { routeCodeKey: 'rUTCD', routeNameKey: 'rUTNM', defaultAction: 'Create Trip' });
      return [...departureDetails, ...routeDetails, ...adHocDetails];
    } catch (error) {
      console.error('Error  fetching route schedule:', error);
      throw error; // Re-throw the error to handle it further up the chain
    }
  }

  // Generic function to fetch data from a given collection with a specified filter
  async fetchData(collectionName, filter) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: collectionName,
      filter: filter
    };
    const { data } = await firstValueFrom(this.operation.operationPost(GenericActions.Get, req));
    return data;
  }

  // Utility function to compute the difference in hours between two dates
  computeHoursDifference(startDate, endDate) {
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  async getFieldDepartureMapping(data, shipment) {
    const vendorCode = await this.vendor.getVendorDetail(
      {
        companyCode: this.storage.companyCode,
        vendorName: { 'D$regex': `^${data?.Vendor}`, 'D$options': 'i' }
      });
    this.vendCode = vendorCode[0]?.vendorCode;
    const dktNoList = shipment ? shipment.map((x) => x.dKTNO) : [];
    const dktSfx = shipment ? shipment.map((x) => `${x.dKTNO}-${x.sFX}`) : [];
    let eventJson = dktNoList;
    const origin = data.Route.split(":")[1].split("-")[0];
    const next = getNextLocation(data.Route.split(":")[1].split("-"), this.storage.branch);
    const legID = `${this.storage.companyCode}-${data.tripID}-${this.storage.branch}-${next}`;
    const getLeg = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_movement_ltl",
      filter: { _id: legID },
    }
    let isLegExist = false;
    let thc_movment = await firstValueFrom(this.operation.operationMongoPost("generic/getOne", getLeg));

    const getstatus = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_summary_ltl",
      filter: { docNo: data.tripID },
    }
    let status = await firstValueFrom(this.operation.operationMongoPost("generic/getOne", getstatus));


    let legData = thc_movment.data;
    isLegExist = (legData?._id == legID);

    let thcSummary = {};
    if (this.storage.branch == origin) {
      thcSummary = {
        "tHCDT": new Date(),
        "vND": {
          "tY": vendorCode[0]?.vendorType || "4",
          "tYNM": data?.VendorType || "Market",
          "cD": vendorCode[0]?.vendorCode || "V8888",
          "nM": data?.Vendor || "",
          "pAN": vendorCode[0]?.panNo || "",
        },
        "oPSST": ThcStatus.In_Transit,
        "oPSSTNM": ThcStatus[ThcStatus.In_Transit].split("_").join(" "),
        "fINST": 0,
        "fINSTNM": "",
        "cONTAMT": ConvertToNumber(data?.ContractAmt || 0, 2),
        "aDVPENAMT": ConvertToNumber(data?.Advance || 0, 2),
        "aDVAMT": ConvertToNumber(data?.Advance || 0, 2),
        "cAP": {
          "wT": data?.Capacity || 0,
          "vOL": data?.VolumeaddedCFT || 0,
          "vWT": 0
        },
        "uTI": {
          "wT": data?.WeightUtilization,
          "vOL": data?.VolumeUtilization,
          "vWT": 0
        },
        "cHG": data?.cHG || 0,
        "tOTAMT": ConvertToNumber(data?.TotalTripAmt || 0, 2),
        "aDV": {
          "aAMT": ConvertToNumber(data?.Advance || 0, 2),
          "pCASH": 0,
          "pBANK": 0,
          "pFUEL": 0,
          "pCARD": 0,
          "tOTAMT": ConvertToNumber(data?.Advance || 0, 2)
        },
        "bALAMT": data?.BalanceAmt || 0,
        "aDPAYAT": data?.advPdAt?.value || "",
        "bLPAYAT": data?.balAmtAt?.value || "",
        "iSBILLED": false,
        "bILLNO": "",
        "dRV": {
          "nM": data?.Driver || "",
          "mNO": data?.DriverMob || "",
          "lNO": data?.License || "",
          "lEDT": ConvertToDate(data?.Expiry)
        },
        "fLOC": this.storage.branch,
        "tLOC": next,
        "dPT": {
          "sCHDT": ConvertToDate(data?.DeptartureTime),
          "eXPDT": ConvertToDate(data?.DeptartureTime),
          "aCTDT": ConvertToDate(data?.DeptartureTime),
          "oDOMT": 0,
          "cEWB": data?.Cewb || ""
        },
        "aRR": {
          "sCHDT": null,
          "eXPDT": null,
          "aCTDT": null,
          "kM": "",
          "aCRBY": "",
          "aRBY": ""
        },
        "sCHDIST": 0,
        "aCTDIST": 0,
        "gPSDIST": 0,
        "mODDT": new Date(),
        "mODLOC": this.storage.branch,
        "mODBY": this.storage.userName
      }
    }
    else {
      thcSummary = {
        "oPSST": 1,
        "oPSSTNM": "In Transit",
        "cAP": {
          "wT": data?.Capacity || 0,
          "vOL": data?.VolumeaddedCFT || 0,
          "vWT": 0
        },
        "uTI": {
          "wT": data?.WeightUtilization,
          "vOL": data?.VolumeUtilization,
          "vWT": 0
        },
        "fLOC": this.storage.branch,
        "tLOC": next,
        "mODDT": new Date(),
        "mODLOC": this.storage.branch,
        "mODBY": this.storage.userName
      }
    }

    const tsReq = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_summary_ltl",
      filter: { _id: `${this.storage.companyCode}-${data.tripID}` },
      update: thcSummary
    }
    await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", tsReq));

    let loadedWT = shipment ? shipment.reduce((a, c) => { return a + c.lDWT; }, 0) || 0 : 0;
    let loadedVol = shipment ? shipment.reduce((a, c) => { return a + c.lDVOL; }, 0) || 0 : 0;

    if (!isLegExist) {
      legData = {
        "_id": legID,
        "tHC": data.tripID,
        "cID": this.storage.companyCode,
        "fLOC": this.storage.branch || "",
        "tLOC": next || "",
        "lOAD": {
          "dKTS": shipment ? shipment.filter(f => f.lDPKG > 0).length || 0 : 0,
          "pKGS": shipment ? shipment.reduce((a, c) => { return a + c.lDPKG; }, 0) || 0 : 0,
          "wT": loadedWT || 0,
          "vOL": loadedVol || 0,
          "vWT": 0,
          "rMK": "",
          "sEALNO": data?.DepartureSeal || "",
        },
        "cAP": {
          "wT": data?.Capacity || 0,
          "vOL": data?.VolumeaddedCFT || 0,
          "vWT": 0
        },
        "uTI": {
          "wT": data?.WeightUtilization,
          "vOL": data?.VolumeUtilization,
          "vWT": 0
        },
        "dPT": {
          "sCHDT": ConvertToDate(data?.DeptartureTime),
          "eXPDT": ConvertToDate(data?.DeptartureTime),
          "aCTDT": ConvertToDate(data?.DeptartureTime),
          "gPSDT": null,
          "oDOMT": 0
        },
        "aRR": {
          "sCHDT": null,
          "eXPDT": null,
          "aCTDT": null,
          "gPSDT": null,
          "oDOMT": 0
        },
        "uNLOAD": {
          "dKTS": 0,
          "pKGS": 0,
          "wT": 0,
          "vOL": 0,
          "vWT": 0,
          "sEALNO": "",
          "rMK": "",
          "sEALRES": ""
        },
        "sCHDIST": 0,
        "aCTDIST": 0,
        "gPSDIST": 0,
        "eNTDT": new Date(),
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName
      }
    }
    else {
      legData = {
        "lOAD": {
          "dKTS": shipment ? shipment.filter(f => f.lDPKG > 0).length || 0 : 0,
          "pKGS": shipment ? shipment.reduce((a, c) => { return a + c.lDPKG; }, 0) || 0 : 0,
          "wT": loadedWT || 0,
          "vOL": loadedVol || 0,
          "vWT": 0,
          "rMK": "",
          "sEALNO": data?.DepartureSeal || "",
        },
        "cAP": {
          "wT": data?.Capacity || 0,
          "vOL": data?.VolumeaddedCFT || 0,
          "vWT": 0
        },
        "uTI": {
          "wT": data?.WeightUtilization,
          "vOL": data?.VolumeUtilization,
          "vWT": 0
        },
        "dPT": {
          "sCHDT": ConvertToDate(data?.DeptartureTime),
          "eXPDT": ConvertToDate(data?.DeptartureTime),
          "aCTDT": ConvertToDate(data?.DeptartureTime),
          "gPSDT": null,
          "oDOMT": 0
        },
        "mODDT": new Date(),
        "mODLOC": this.storage.branch,
        "mODBY": this.storage.userName
      }
    }

    if (isLegExist) {
      const reqthc = {
        companyCode: this.storage.companyCode,
        collectionName: "thc_movement_ltl",
        filter: { _id: legID },
        update: legData
      }
      await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqthc));
    }
    else {
      const reqthc = {
        companyCode: this.storage.companyCode,
        collectionName: "thc_movement_ltl",
        data: legData
      }
      await firstValueFrom(this.operation.operationMongoPost("generic/create", reqthc));
      const filter = {
        cID: this.storage.companyCode,
        mODULE: "THC",
        aCTIVE: true,
        rULEID: { D$in: ["THCACONGEN"] }
      }
      const res: any = await this.controlPanel.getModuleRules(filter);
      if (res.length > 0) {
        this.accountingOnThc = res.find(x => x.rULEID === "THCACONGEN").vAL
      }
      if (this.accountingOnThc) {
        if (status.data.oPSST == 1) {
          let result = await firstValueFrom(this.createJournalRequest(data, data.tripID));
          console.log(result);
          if (result) {
            let commonBody;
            commonBody = {
              vNO: result.data.ops[0].vNO
            }
            const reqBody = {
              companyCode: this.storage.companyCode,
              collectionName: 'thc_summary_ltl',
              filter: {
                cID: this.storage.companyCode,
                docNo: data.tripID
              },
              update: commonBody,
            };
            firstValueFrom(this.masterService.masterPut('generic/update', reqBody)).then((res: any) => {
              if (res.success) {
              }
            })
              .catch((error: any) => {
                // Handle any errors here
                console.error(error);
              });
          }
        }
      }

    }

    const tripDetails = {
      sTS: VehicleStatus.Departed,
      sTSNM: VehicleStatus[VehicleStatus.Departed],
      nXTLOC: next
    }

    const reqDepart = {
      companyCode: this.storage.companyCode,
      collectionName: "trip_Route_Schedule",
      filter: { tHC: data.tripID, rUTCD: data.Route.split(":")[0] },
      update: tripDetails
    }
    await firstValueFrom(this.operation.operationMongoPut("generic/update", reqDepart));
    if (dktNoList.length > 0) {
      eventJson = dktNoList.map((element, index) => {
        const evn = {
          "_id": `${this.storage.companyCode}-${element}-${index}-${DocketEvents.Departure}-${moment(new Date()).format('YYYYMMDDHHmmss')}`, // Safely accessing the ID
          "cID": this.storage.companyCode,
          "dKTNO": element,
          "sFX": 0,
          "lOC": this.storage.branch,
          "eVNID": DocketEvents.Departure,
          "eVNDES": getEnumName(DocketEvents, DocketEvents.Departure),
          "eVNDT": new Date(),
          "eVNSRC": "Depart Vehicle",
          "dOCTY": "TH",
          "dOCNO": data?.tripID || "",
          "sTS": DocketStatus.Departed,
          "sTSNM": DocketStatus[DocketStatus.Departed],
          "oPSSTS": `Departed from ${this.storage.branch} to ${next} with THC ${data.tripID} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
          "eNTDT": new Date(),
          "eNTLOC": this.storage.branch,
          "eNTBY": this.storage.userName
        }
        return evn
      });
      const reqEvent = {
        companyCode: this.storage.companyCode,
        collectionName: "docket_events_ltl",
        data: eventJson
      }
      await firstValueFrom(this.operation.operationMongoPost("generic/create", reqEvent));

      const reqDktOpsDepart = {
        companyCode: this.storage.companyCode,
        collectionName: "docket_ops_det_ltl",
        filter: { "D$expr": { "D$in": [{ "D$concat": ["$dKTNO", "-", { "D$toString": "$sFX" }] }, dktSfx] } },
        update: {
          "sTS": DocketStatus.Departed,
          "sTSNM": DocketStatus[DocketStatus.Departed],
          "oPSSTS": `Departed From ${this.storage.branch} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
          "mODBY": this.storage.userName,
          "mODDT": new Date(),
          "mODLOC": this.storage.branch
        }
      }
      await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqDktOpsDepart));
    }
    Swal.fire({
      icon: "info",
      title: "Departure",
      text: "Vehicle to " + next + " is about to depart.",
      confirmButtonText: "OK",
    });
    return data.tripID;
  }

  async getDocketDetails(filter) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_ops_det_ltl",
      filter: filter
    }
    const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
    return res.data;
  }

  async updateDocket(data) {
    const dockets = await this.getDocketDetails({ cID: this.storage.companyCode, tHC: data.TripID });
    if (dockets && dockets.length > 0) {
      dockets.forEach(async (x) => {
        let evnData = {
          _id: `${this.storage.companyCode}-${x.dKTNO}-0-EVN0001-${moment(new Date()).format('YYYYMMDDHHmmss')}`,
          cID: this.storage.companyCode,
          dKTNO: x?.dKTNO || "",
          sFX: x?.sFX,
          lOC: this.storage.branch,
          eVNID: 'EVN0001',
          eVNDES: 'Booking',
          eVNDT: new Date(),
          eVNSRC: 'Booking',
          dOCTY: 'CN',
          dOCNO: x?.dKTNO || "",
          sTS: DocketStatus.Booked,
          sTSNM: DocketStatus[DocketStatus.Booked],
          oPSSTS: `Booked at ${x?.oRGN} on ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`,
          eNTDT: x?.eNTDT,
          eNTLOC: x?.eNTLOC || "",
          eNTBY: x?.eNTBY || ""
        }
        let reqEvent = {
          companyCode: this.storage.companyCode,
          collectionName: "docket_events_ltl",
          data: evnData
        };
        await firstValueFrom(this.operation.operationMongoPost('generic/create', reqEvent));
        let reqBody = {
          companyCode: this.storage.companyCode,
          collectionName: "docket_ops_det_ltl",
          filter: { dKTNO: x.dKTNO, sFX: x.sFX },
          update: {
            tHC: "",
            mFNO: "",
            lSNO:"",
            sTS: DocketStatus.Booked,
            sTSNM: DocketStatus[DocketStatus.Booked],
            mODDT: new Date(),
            mODBY: this.storage.userName,
            mODLOC: this.storage.branch,
            oPSSTS: `Booked at ${x?.oRGN} on ${moment(new Date()).tz(this.storage.timeZone).format('DD MMM YYYY @ hh:mm A')}.`,
          }
        }
        await firstValueFrom(this.operation.operationMongoPut('generic/update', reqBody));
      });

    }
  }

  async updateTHCLTL(filter, data) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_summary_ltl",
      filter: filter,
      update: data
    }
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", req));
    return res
  }
  async updateVehicleStatus(filter) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "vehicle_status",
      filter: filter,
      update:{status:"Available"}
    }
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", req));
    return res
  }

  async deleteTrip(filter) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "trip_Route_Schedule",
      filter: filter
    }
    const res = await firstValueFrom(this.operationService.operationMongoRemove("generic/remove", req));
    return res;
  }


  //Voucher Create Thc Generation
  createJournalRequest(data: any, tripID: any): Observable<any> {
    // Construct the voucher request payload

    const voucherRequest = {
      companyCode: this.storage.companyCode,
      docType: "VR",
      branch: this.storage.branch,
      finYear: financialYear,
      details: [],
      debitAgainstDocumentList: [],
      data: {
        transCode: VoucherInstanceType.THCGeneration,
        transType: VoucherInstanceType[VoucherInstanceType.THCGeneration],
        voucherCode: VoucherType.JournalVoucher,
        voucherType: VoucherType[VoucherType.JournalVoucher],
        transDate: new Date(),
        docType: "VR",
        branch: this.storage.branch,
        finYear: financialYear,
        accLocation: this.storage.branch,
        preperedFor: "Vendor",
        partyCode: this.vendCode,
        partyName: data?.Vendor || "",
        partyState: "" || "",
        entryBy: this.storage.userName,
        entryDate: new Date(),
        panNo: "",
        tdsSectionCode: undefined,
        tdsSectionName: undefined,
        tdsRate: 0,
        tdsAmount: 0,
        tdsAtlineitem: false,
        tcsSectionCode: undefined,
        tcsSectionName: undefined,
        tcsRate: 0,
        tcsAmount: 0,
        IGST: 0,
        SGST: 0,
        CGST: 0,
        UGST: 0,
        GSTTotal: 0,
        GrossAmount: parseFloat(data?.TotalTripAmt || 0),
        netPayable: parseFloat(data?.TotalTripAmt || 0),
        roundOff: 0,
        voucherCanceled: false,
        paymentMode: "",
        refNo: "",
        accountName: "",
        accountCode: "",
        date: "",
        scanSupportingDocument: "",
        transactionNumber: tripID
      }
    };

    // Retrieve voucher line items
    const voucherlineItems = this.GetJournalVoucherLedgers(data, tripID);
    voucherRequest.details = voucherlineItems;

    // Create and return an observable representing the HTTP request
    return this.voucherServicesService.FinancePost("fin/account/voucherentry", voucherRequest).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while creating voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      }),
      mergeMap((res: any) => {
        let reqBody = {
          companyCode: this.storage.companyCode,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: Date(),
          finYear: financialYear,
          branch: this.storage.branch,
          transCode: VoucherInstanceType.THCGeneration,
          transType: VoucherInstanceType[VoucherInstanceType.THCGeneration],
          voucherCode: VoucherType.JournalVoucher,
          voucherType: VoucherType[VoucherType.JournalVoucher],
          docType: "Voucher",
          partyType: "Vendor" ,
          docNo: data.tripID,
          partyCode:this.vendCode || "V8888",
          partyName: data?.Vendor || "",
          entryBy: this.storage.userName,
          entryDate: Date(),
          debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.debit,
              "narration": item.narration ?? ""
            };
          }),
          credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.credit,
              "narration": item.narration ?? ""
            };
          }),
        };
        return this.voucherServicesService.FinancePost("fin/account/posting", reqBody);
      }),
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while posting voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      })
    );
  }

  // Get Voucher Details
  GetJournalVoucherLedgers(SelectedData, tripID) {
    const createVoucher = (accCode, accName, accCategory, debit, credit, THCNo) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.THCGeneration,
      transType: VoucherInstanceType[VoucherInstanceType.THCGeneration],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: "",
      sacName: "",
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Expense Booked against THC NO : ${tripID}`,
    });

    const Result = [];

    let OtherChargePositiveAmt = 0;
    let OtherChargeNegativeAmt = 0;
    const AllCharges: any[] = SelectedData?.cHG;
    AllCharges.forEach((item) => {
      if (item.aMT != 0) {
        const ledger = GetLeadgerInfoFromLocalStorage(item.aCCD)
        if (item.oPS == "+") {
          if (ledger) {
            Result.push(createVoucher(ledger.LeadgerCode, ledger.LeadgerName, ledger.LeadgerCategory, +item.aMT, 0, SelectedData.THC));
          } else {
            OtherChargePositiveAmt += parseFloat(item.aMT);
          }
        }
        if (item.oPS == "-") {
          if (ledger) {
            Result.push(createVoucher(ledger.LeadgerCode, ledger.LeadgerName, ledger.LeadgerCategory, 0, (+item.aMT * -1), SelectedData.THC));
          } else {
            OtherChargeNegativeAmt += (parseFloat(item.aMT) * -1);
          }
        }
      }
    });

    if (OtherChargePositiveAmt != 0) {
      Result.push(createVoucher(ledgerInfo['EXP001009'].LeadgerCode, ledgerInfo['EXP001009'].LeadgerName, ledgerInfo['EXP001009'].LeadgerCategory, OtherChargePositiveAmt, 0, SelectedData.tripID));
    }
    if (OtherChargeNegativeAmt != 0) {
      Result.push(createVoucher(ledgerInfo['EXP001009'].LeadgerCode, ledgerInfo['EXP001009'].LeadgerName, ledgerInfo['EXP001009'].LeadgerCategory, 0, OtherChargeNegativeAmt, SelectedData.tripID));
    }
    Result.push(createVoucher(ledgerInfo['EXP001003'].LeadgerCode, ledgerInfo['EXP001003'].LeadgerName, ledgerInfo['EXP001003'].LeadgerCategory, parseFloat(SelectedData?.ContractAmt), 0, SelectedData.tripID));
    Result.push(createVoucher(ledgerInfo['LIA001002'].LeadgerCode, ledgerInfo['LIA001002'].LeadgerName, ledgerInfo['LIA001002'].LeadgerCategory, 0, parseFloat(SelectedData?.TotalTripAmt), SelectedData.tripID));
    return Result;
  }

}