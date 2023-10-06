import { Component, OnInit } from "@angular/core";
import { debug } from "console";
import { ApiTracking } from "src/app/core/models/apitracking/api-tracking";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { RetryAndDownloadService } from "src/app/core/service/api-tracking-service/retry-and-download.service";
import { GeolocationService } from "src/app/core/service/geo-service/geolocation.service";
import { geoDataServices } from "src/app/operation/error-handing/outbox-utility";
import Swal from "sweetalert2";

@Component({
    selector: 'app-user-master-list',
    templateUrl: './user-master-list.component.html'
})

export class UserMasterListComponent implements OnInit {
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    addAndEditPath: string;
    csvFileName: string;
    toggleArray = ["isActive"];
    linkArray = [];
    retryCount = 0;
    maxRetries = 3;
    csv: any;
    dynamicControls = {
        add: true,
        edit: true,
        csv: true
    }
    breadScrums = [
        {
            title: "User Master",
            items: ["Master"],
            active: "User Master",
        },
    ];
    columnHeader = {
        "entryDate": "Created Date",
        "userId": "User Code",
        "name": "User Name",
        "multiLocation": "Locations",
        "role": "User Role",
        "isActive": "Active Flag",
        "actions": "Action"
    };
    headerForCsv = {
        // "internalId": 'InternalID',
        "userId": 'UserId',
        "userpassword": 'Password',
        "name": 'Name',
        "gender": 'Gender',
        "secretQuestion": 'SecretQuestion',
        "secretAnswer": 'SecretAnswer',
        "dateOfJoining": 'DateofJoining',
        "managerId": 'ManagerID',
        "branchCode": 'Location',
        "dateOfBirth": 'DateofBirth',
        "residentialAddress": 'ResidentialAddress',
        "multiLocation": 'Multi Location',
        "mobileNo": 'MobileNo',
        "emailId": 'EmailId',
        "role": 'Role',
        "userType": 'UserType',
        "userStatus": 'UserStatus',
        "multiDivisionAccess": 'Multi Division Access',
        "entryBy": 'EntryBy',
        "entryDate": 'Entry Date',
        "isActive": 'Activeflag'
    };

    ngOnInit(): void {
        this.csvFileName = "User Details";
        this.addAndEditPath = "/Masters/UserMaster/AddUser";
        this.getUserDetails();
    }
    constructor(
        private masterService: MasterService,
    ) {
    }

    async getUserDetails() {
        let req = {
            "companyCode": this.companyCode,
            "collectionName": "user_master",
            "filter": {}
        };
        try {
            const res = await this.masterService.masterPost("generic/get", req).toPromise()
            if (res) {
                // Generate srno for each object in the array
                const dataWithSrno = res.data.map((obj, index) => {
                    return {
                        ...obj,
                        //srNo: index + 1
                    };
                });
                const sortedData = dataWithSrno.sort((a, b) => {
                    const dateA: Date | any = new Date(a.entryDate);
                    const dateB: Date | any = new Date(b.entryDate);

                    // Compare the date objects
                    return dateB - dateA; // Sort in descending order
                });
                this.csv = sortedData;
                this.tableLoad = false;
            }

        } catch (error) {

        }
    }

    functionCallHandler($event) {
        // console.log("fn handler called", $event);
        let field = $event.field;                   // the actual formControl instance
        let functionName = $event.functionName;     // name of the function , we have to call
        // function of this name may not exists, hence try..catch
        try {
            this[functionName]($event);
        } catch (error) {
            // we have to handle , if function not exists.
            console.log("failed");
        }
    }

    async IsActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        delete det.srNo;
        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "user_master",
            filter: {
                _id: id,
            },
            update: det
        };
        const res = await this.masterService.masterPut("generic/update", req).toPromise()
        if (res) {
            // Display success message
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: res.message,
                showConfirmButton: true,
            });
            this.getUserDetails();
        }
    }
    // Function to make the API call as a promise with retry logic


}
