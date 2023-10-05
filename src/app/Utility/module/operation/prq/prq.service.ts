import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { updatePrqStatus } from "src/app/operation/prq-entry-page/prq-utitlity";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class PrqService {
  vehicleDetail: any;
  constructor(
    private masterService: MasterService,
    private operation: OperationService
  ) { }

  // the function for prq generation
  getPrqNextNumber() {
    // Get the current number from localStorage
    let currentNum = parseInt(localStorage.getItem("sequenceNumber"));

    // If the number doesn't exist in localStorage, initialize it to 1
    if (!currentNum) {
      currentNum = 1;
    } else {
      currentNum = currentNum + 1;
    }

    // Format the number with leading zeros (e.g., 001, 002, ...)
    const formattedNumber = currentNum.toString().padStart(7, "0");

    // Store the new number in localStorage
    localStorage.setItem("sequenceNumber", currentNum.toString());

    // Return the formatted number
    return formattedNumber;
  }
  //................end.............//

  //here the function for add prq Detail
  async addPrqData(prqData) {

    const reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "prq_detail",
      data: prqData,
      docType: "PRQ",
      branch: localStorage.getItem("Branch"),
      party: prqData?.billingParty.toUpperCase()||'',
      finYear: "2223",
    };

    const res = await this.masterService
      .masterMongoPost("operation/prq/create", reqBody)
      .toPromise();
    return res;
  }

  //................end.............//

  //here the code to update prq status
  async updatePrqStatus(prqData) {
    delete prqData.srNo;
    delete prqData.Action;
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "prq_detail",
      filter: { prqNo: prqData.prqNo || prqData.prqId || "" },
      update: {
        ...prqData,
      },
    };
    const res = await this.masterService
      .masterMongoPut("generic/update", reqBody)
      .toPromise();
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
      prqDetail.status = status;
      delete prqDetail._id;
      delete prqDetail.srNo;
      delete prqDetail.actions;

      const res = await updatePrqStatus(prqDetail, this.masterService);
      if (res) {
        goBack(tabIndex);
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
            updateBy: localStorage.getItem("Username"),
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

      const vehicleUpdate = await this.operation
        .operationMongoPut("generic/update", reqBody)
        .toPromise();
      return vehicleUpdate; // Optionally, you can return the updated vehicle data.
    } catch (error) {
      throw error; // Re-throw the error to be handled at a higher level or log it.
    }
  }
  //................end.............//

  // This async function retrieves PRQ (Purchase Request) detail data from an API using the masterService.
  async getPrqDetailFromApi() {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "prq_detail",
      filter: {},
    };

    // Make an asynchronous request to the API using masterMongoPost method
    const res = await this.masterService
      .masterMongoPost("generic/get", reqBody)
      .toPromise();

    // Filter out PRQ data with status "4" or "5"
    const prqData = res.data.filter(
      (x) => x.status.trim() !== "4" && x.status.trim() !== "5"
    );

    let prqList = [];

    // Map and transform the PRQ data
    prqData.map((element, index) => {
      let prqDataItem = {
        srNo: (element.srNo = index + 1),
        prqNo: element?.prqNo || "",
        vehicleSize: element?.vehicleSize || "",
        size: element.vehicleSize
          ? element.vehicleSize + " " + "MT"
          : element.containerSize
            ? element.containerSize+ " " + "MT"
            : "",
        billingParty: element?.billingParty || "",
        fromToCity: element?.fromCity + "-" + element?.toCity,
        fromCity: element?.fromCity || "",
        contactNo: element?.contactNo || "",
        toCity: element?.toCity || "",
        transMode: element?.transMode || "",
        vehicleNo: element?.vehicleNo || "",
        prqBranch: element?.prqBranch || "",
        pickUpDate: formatDocketDate(element?.pickUpTime || new Date()),
        pickupDate: element?.pickUpTime || new Date(),
        status:
          element?.status === "0"
            ? "Awaiting Confirmation"
            : element.status === "1"
              ? "Awaiting Assign Vehicle"
              : element.status == "2"
                ? "Awaiting For Docket"
                : element.status == "3"
                  ? "Ready For THC"
                  : "THC Generated",
        actions:
          element?.status === "0"
            ? ["Confirm", "Reject", "Modify"]
            : element.status === "1"
              ? ["Assign Vehicle"]
              : element.status == "2"
                ? ["Add Docket"]
                : element.status == "3"
                  ? ["Add Docket", "Create THC"]
                  : [""],
        containerSize: element?.containerSize || "",
        typeContainer: element?.typeContainer || "",
        pAddress: element?.pAddress || "",
        payType: element?.payType || "",
        contractAmt: element?.contractAmt || "",
        createdDate: formatDocketDate(element?.entryDate || new Date()),
      };
      prqList.push(prqDataItem);
    });

    // Sort the PRQ list by pickupDate in descending order
    const sortedData = prqList.sort((a, b) => {
      const dateA: Date | any = new Date(a.pickupDate);
      const dateB: Date | any = new Date(b.pickupDate);

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

  async getAllPrqDetail() {
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "prq_detail",
      filter: {},
    };

    // Make an asynchronous request to the API using masterMongoPost method
    const res = await this.masterService
      .masterMongoPost("generic/get", reqBody)
      .toPromise();
      let prqList = [];

      // Map and transform the PRQ data
      res.data.map((element, index) => {
        let prqDataItem = {
          srNo: (element.srNo = index + 1),
          prqNo: element?.prqNo || "",
          vehicleSize: element?.vehicleSize || "",
          size: element.vehicleSize
            ? element.vehicleSize + " " + "MT"
            : element.containerSize
              ? element.containerSize
              : "",
          billingParty: element?.billingParty || "",
          fromToCity: element?.fromCity + "-" + element?.toCity,
          fromCity: element?.fromCity || "",
          contactNo: element?.contactNo || "",
          toCity: element?.toCity || "",
          transMode: element?.transMode || "",
          vehicleNo: element?.vehicleNo || "",
          prqBranch: element?.prqBranch || "",
          pickUpDate: formatDocketDate(element?.pickUpTime || new Date()),
          pickupDate: element?.pickUpTime || new Date(),
          status:
            element?.status === "0"
              ? "Awaiting Confirmation"
              : element.status === "1"
                ? "Awaiting Assign Vehicle"
                : element.status == "2"
                  ? "Awaiting For Docket"
                  : element.status == "3"
                    ? "Ready For THC"
                    : "THC Generated",
          actions:
            element?.status === "0"
              ? ["Confirm", "Reject", "Modify"]
              : element.status === "1"
                ? ["Assign Vehicle"]
                : element.status == "2"
                  ? ["Add Docket"]
                  : element.status == "3"
                    ? ["Add Docket", "Create THC"]
                    : [""],
          containerSize: element?.containerSize || "",
          typeContainer: element?.typeContainer || "",
          pAddress: element?.pAddress || "",
          payType: element?.payType || "",
          contractAmt: element?.contractAmt || "",
          createdDate: formatDocketDate(element?.entryDate || new Date()),
        };
        prqList.push(prqDataItem);
      });
  
      // Sort the PRQ list by pickupDate in descending order
      const sortedData = prqList.sort((a, b) => {
        const dateA: Date | any = new Date(a.pickupDate);
        const dateB: Date | any = new Date(b.pickupDate);
  
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
  // This function sets the assigned vehicle details.
  setassignVehicleDetail(data: any) {
    this.vehicleDetail = data;
    
  }

  // This function retrieves the assigned vehicle details.
  getAssigneVehicleDetail() {
    return this.vehicleDetail;
  }
}
