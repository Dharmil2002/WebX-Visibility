import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { SwalerrorMessage } from "src/app/Utility/Validation/Message/Message";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { financialYear } from "src/app/Utility/date/date-utils";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { updatePrqStatus } from "src/app/operation/prq-entry-page/prq-utitlity";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class PrqService {
  branchCode = localStorage.getItem("Branch");
  vehicleDetail: any;
  statusActions = {
    "0": ["Confirm", "Reject", "Modify"],
    "1": ["Assign Vehicle"],
    "2": ["Add Docket"],
    "3": ["Add Docket", "Create THC"],
    default: [""],
  };
  status = {
    "0": "Awaiting Confirmation",
    "1": "Awaiting Assign Vehicle",
    "2": "Awaiting For Docket",
    "3": "Ready For THC",
    "5": "Rejected",
    "8":"Delivered",
    default: "THC Generated",
  };
  constructor(
    private masterService: MasterService,
    private operation: OperationService,
    private storage: StorageService
  ) {}

  //here the function for add prq Detail
  /**
   * Adds Purchase Requisition (PRQ) data to the database.
   *
   * @param {Object} prqData - The PRQ data to be added.
   * @returns {Promise<any>} A promise that resolves with the result of the API request.
   */
  async addPrqData(prqData) {
    // Retrieve the company code and branch from localStorage
    const companyCode = localStorage.getItem("companyCode");
    const branch = localStorage.getItem("Branch");

    // Ensure prqData is not undefined and set party to uppercase if it exists
    prqData = prqData || {};
    const party = prqData.bPARTYNM ? prqData.bPARTYNM.toUpperCase() : "";
    // Construct the request body
    const reqBody = {
      companyCode: companyCode,
      collectionName: "prq_summary",
      data: prqData,
      docType: "PRQ",
      branch: prqData.bRCD,
      party: party,
      finYear: financialYear, // Replace with a dynamic value if needed
    };

    try {
      // Make an API request to create the PRQ
      const res = await firstValueFrom(
        this.masterService.masterMongoPost("operation/prq/create", reqBody)
      );
      return res;
    } catch (error) {
      // Handle errors gracefully and log them
      console.error("Error adding PRQ data:", error);
      throw error; // Re-throw the error for higher-level error handling
    }
  }

  //................end.............//

  //here the code to update prq status
  async updatePrqStatus(prqData) {
    delete prqData.srNo;
    delete prqData.Action;
    prqData.statusCode = prqData.status;
    prqData.status = this.status[prqData.status];
    let model;
    if (prqData.statusCode && prqData.prqNo) {
      model = {
        ...this.preparePrqDataModel({ ...prqData }),
      };
    } else {
      model = {
        ...prqData,
      };
    }

    const reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "prq_summary",
      filter: {
        cID: localStorage.getItem("companyCode"),
        pRQNO: prqData.pRQNO || prqData.prqNo || "",
      },
      update: {
        ...model,
      },
    };
    const res = await firstValueFrom(
      this.masterService.masterMongoPut("generic/update", reqBody)
    );
    return res;
  }
  //................end.............//

  //... here the code of dailog box which is open for confirmation and update prq here
  async showConfirmationDialog(prqDetail, goBack, tabIndex, status) {
    const confirmationResult = await Swal.fire({
      icon: "success",
      title: "Confirmation",
      text: "Are You Sure About This?",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
      if (status == "5") {
        Swal.fire({
          title: "Reason For Rejection?",
          html: '<input id="swal-input1" class="swal2-input">',
          focusConfirm: false,
          showCancelButton: true,
          cancelButtonText: "Cancel",
          preConfirm: () => {
            return (document.getElementById("swal-input1") as HTMLInputElement)
              .value;
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            prqDetail.statusCode = status;
            prqDetail.status = this.status[status];
            delete prqDetail._id;
            delete prqDetail.srNo;
            delete prqDetail.actions;
            var model = {
              //...this.preparePrqDataModel({...prqDetail})
              cID: localStorage.getItem("companyCode"),
              pRQNO: prqDetail.prqNo || prqDetail.docNo || "",
              sTS: prqDetail.statusCode,
              sTSNM: prqDetail.status,
              cNL: {
                rES: result.value,
                bY: this.storage.userName,
                lOC: this.storage.branch,
                tM: new Date(),
              },
            };
            const res = await updatePrqStatus(model, this.masterService);
            if (res) {
              Swal.fire({
                title: "Success",
                text: "The PRQ has been successfully rejected.",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: "OK",
              }).then((result) => {
                window.location.reload();
              });
            }

              return true;
          } else if (result.isDismissed) {
            goBack("PRQ");
            return true;
          }
        });
      } else {
        prqDetail.statusCode = status;
        prqDetail.status = this.status[status];
        delete prqDetail._id;
        delete prqDetail.srNo;
        delete prqDetail.actions;

        var model = {
          //...this.preparePrqDataModel({...prqDetail})
          cID: localStorage.getItem("companyCode"),
          pRQNO: prqDetail.prqNo || prqDetail.docNo || "",
          sTS: prqDetail.statusCode,
          sTSNM: prqDetail.status,
        };
        const res = await updatePrqStatus(model, this.masterService);
        if (res) {
          goBack("PRQ");
        }
        return true;
      }
    }
  }
  //................end.............//

  //---here is for vehicle status update
  async vehicleStatusUpdate(
    rptLoc,
    companyCode,
    arrivalData,
    prqdata,
    isClose
  ) {
    try {
      if (!rptLoc || !companyCode || !arrivalData || !arrivalData.vehNo) {
        throw new Error(
          "Missing required data for vehicle status update. Ensure all parameters are provided."
        );
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
              updateDate: new Date().toISOString(),
            }
          : {}),
      };

      const reqBody = {
        companyCode,
        collectionName: "vehicle_status",
        filter: { _id: arrivalData.vehNo },
        update: { ...vehicleDetails },
      };

      const vehicleUpdate = await firstValueFrom(
        this.operation.operationMongoPut("generic/update", reqBody)
      );

      return vehicleUpdate; // Optionally, you can return the updated vehicle data.
    } catch (error) {
      throw error; // Re-throw the error to be handled at a higher level or log it.
    }
  }
  //................end.............//

  // This async function retrieves PRQ (Purchase Request) detail data from an API using the masterService.
  async getPrqDetailFromApi() {
    const reqBarnch = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "location_detail",
      filter: {locCode:this.branchCode},
    }

    const resBarnch = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBarnch));
    let barnchCode;
    if(resBarnch.success){
      barnchCode = resBarnch.data.length > 0 ?resBarnch.data[0].locLevel:undefined
    }
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "prq_summary",
      filter: barnchCode && barnchCode == 1?{}:{ bRCD: this.branchCode },
    };

    // Make an asynchronous request to the API using masterMongoPost method
    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/get", reqBody)
    );

    // Filter out PRQ data with status "4" or "5"
    const prqData = res.data.filter((x) => x.sTS !== 4 && x.sTS !== 5);

    let prqList = [];

    // Map and transform the PRQ data
    prqData.map((element, index) => {
      let pqrData = this.preparePrqDetailObject(element, index);
      prqList.push(pqrData);
      // You need to return the modified element
    });
    // Sort the PRQ list by pickupDate in descending order
    const sortedData = prqList.sort((a, b) => {
      const dateA: Date | any = new Date(a.createDateOrg);
      const dateB: Date | any = new Date(b.createDateOrg);

      // Compare the date objects
      return dateB - dateA; // Sort in descending order
    });

    // Create an object with sorted PRQ data and all PRQ details
    const prqDetail = {
      tableData: sortedData,
      allPrqDetail: res.data,
    };

    return prqDetail;
  }

  async getPrqForBooking(barnch, billingParty, payType) {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "prq_summary",
      filter: {
        bRCD: barnch,
        pAYTYP: payType,
        bPARTY: billingParty,
        sTS: { D$in: [2, 3] },
      },
    };

    // Make an asynchronous request to the API using masterMongoPost method
    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/get", reqBody)
    );

    let prqList = res.data.map((element, index) => {
      return this.preparePrqDetailObject(element, index);
    });

    // Sort the PRQ list by pickupDate in descending order
    const sortedData = prqList.sort((a, b) => {
      const dateA: Date | any = new Date(a.createDateOrg);
      const dateB: Date | any = new Date(b.createDateOrg);

      // Compare the date objects
      return dateB - dateA; // Sort in descending order
    });

    // Create an object with sorted PRQ data and all PRQ details
    const prqDetail = {
      tableData: sortedData,
      allPrqDetail: prqList,
    };

    return prqDetail;
  }

  async getAllPrqDetail() {
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "prq_summary",
      filter: { bRCD: this.branchCode },
    };

    // Make an asynchronous request to the API using masterMongoPost method
    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/get", reqBody)
    );

    let prqList = [];
    const prqDetails = res.data;
    // Map and transform the PRQ data
    prqDetails.map((element, index) => {
      let prqDataItem = this.preparePrqDetailObject(element, index);
      prqList.push(prqDataItem);
    });

    // Sort the PRQ list by pickupDate in descending order
    const sortedData = prqList.sort((a, b) => {
      const dateA: Date | any = new Date(a.createDateOrg);
      const dateB: Date | any = new Date(b.createDateOrg);

      // Compare the date objects
      return dateB - dateA; // Sort in descending order
    });

    // Create an object with sorted PRQ data and all PRQ details
    const prqDetail = {
      tableData: sortedData,
      allPrqDetail: res.data,
    };

    return prqDetail;
  }
  async getAllPrqDetailWithFilters(billingParty: any) {
    const startDate = moment(new Date()).add(-15, "days").toDate();
    const endDate = new Date();
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "prq_summary",
      filter: {
        cID: localStorage.getItem("companyCode"),
        bRCD: this.branchCode,
        bPARTY: billingParty,
        pICKDT: {
          D$gte: startDate,
          D$lt: endDate,
        },
      },
    };

    // Make an asynchronous request to the API using masterMongoPost method
    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/get", reqBody)
    );

    let prqList = [];
    const prqDetails = res.data;

    // Map and transform the PRQ data
    prqDetails.map((element, index) => {
      let prqDataItem = this.preparePrqDetailObject(element, index);
      prqList.push(prqDataItem);
    });

    // Sort the PRQ list by pickupDate in descending order
    const sortedData = prqList.sort((a, b) => {
      const dateA: Date | any = new Date(a.createDateOrg);
      const dateB: Date | any = new Date(b.createDateOrg);

      // Compare the date objects
      return dateB - dateA; // Sort in descending order
    });

    // Create an object with sorted PRQ data and all PRQ details
    const prqDetail = {
      tableData: sortedData,
      allPrqDetail: prqList,
    };

    return prqDetail;
  }

  preparePrqDetailObject(element, index) {
    let prqDataItem = {
      srNo: (element.srNo = index + 1),
      prqNo: element?.pRQNO || "",
      vehicleSize: element?.vEHSIZENM || "",
      vehicleSizeCode: element?.vEHSIZE || "",
      size: element.sIZE || 0,
      billingParty: element?.bPARTYNM || "",
      billingPartyCode: element?.bPARTY || "",
      fromToCity: element?.fCITY + "-" + element?.tCITY,
      fromCity: element?.fCITY || "",
      toCity: element?.tCITY || "",
      contactNo: element?.pHNO || "",
      carrierType: element?.cARTYPNM || "",
      carrierTypeCode: element?.cARTYP || "",
      vehicleNo: element?.vEHNO || "",
      prqBranch: element?.bRCD || "",
      pickUpDate: formatDocketDate(element?.pICKDT || new Date()),
      pickupDate: element?.pICKDT || new Date(),
      status: this.status[element.sTS] || this.status.default,
      statusCode: element.sTS,
      actions: this.statusActions[element.sTS] || this.statusActions.default,
      containerSize: element?.cNTSIZE || "",
      typeContainer: element?.cNTYPNM || "",
      typeContainerCode: element?.cNTYP || "",
      pAddress: element?.pADD || "",
      payType: element?.pAYTYPNM || "",
      payTypeCode: element?.pAYTYP || "",
      contractAmt: element?.cONTRAMT || "",
      vENDTY: element?.vENDTY || "",
      vENDTYNM: element?.vENDTYNM || "",
      vNDCD: element?.vNDCD || "",
      vNDNM: element?.vNDNM || "",
      vEHNO: element?.vEHNO || "",
      createdDate: formatDocketDate(element?.eNTDT || new Date()),
      createDateOrg: element?.eNTDT,
      //Below code added by manan sanghani
      pAddressName: element.pADDNM ?? "",
      oDRNO: element.oDRNO ?? "",
      OrderDate: formatDocketDate(element?.oDRDT || new Date()),
      oDRDT: element?.oDRDT || new Date(),
      oDRBY: element.oDRBY ?? "",
      rMKS: element.rMKS ?? "",
    };

    return prqDataItem;
  }

  preparePrqDataModel(element) {
    let prqDataItem = {
      pRQNO: element?.prqNo || "",
      vEHSIZENM: element?.vehicleSize || "",
      vEHSIZE: element?.vehicleSizeCode || "",
      sIZE: element.size || 0,
      bPARTYNM: element?.billingParty || "",
      bPARTY: element?.billingPartyCode || "",
      fCITY: element?.fromCity || "",
      tCITY: element?.toCity || "",
      pHNO: element?.contactNo || "",
      cARTYPNM: element?.carrierType || "",
      cARTYP: element?.carrierTypeCode || "",
      vEHNO: element?.vehicleNo || "",
      bRCD: element?.prqBranch || "",
      pICKDT: element?.pICKDT || new Date(),
      sTS: element?.statusCode,
      sTSNM: element?.status,
      cNTSIZE: element?.containerSize || "",
      cNTYPNM: element?.typeContainer || "",
      cNTYP: element?.typeContainerCode || "",
      pADD: element?.pAddress || "",
      pAYTYPNM: element?.payType || "",
      pAYTYP: element?.payTypeCode || "",
      cONTRAMT: element?.contractAmt || "",
    };
    return prqDataItem;
  }

  // This function sets the assigned vehicle details.
  setassignVehicleDetail(data: any) {
    this.vehicleDetail = data;
  }

  // This function retrieves the assigned vehicle details.
  getAssigneVehicleDetail() {
    return this.vehicleDetail;
  }
}
