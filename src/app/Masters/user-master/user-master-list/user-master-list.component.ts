import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from 'src/app/core/service/Masters/master.service';
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
        "eNTDT": "Created Date",
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
        "dateOfJoining": 'DateofJoining',
        "dateOfBirth": 'DateofBirth',
        "residentialAddress": 'ResidentialAddress',
        "multiLocation": 'Multi Location',
        "mobileNo": 'MobileNo',
        "emailId": 'EmailId',
        "role": 'Role',
        "userType": 'UserType',
        "multiDivisionAccess": 'Multi Division Access',
        "entryBy": 'EntryBy',
        "eNTDT": 'Entry Date',
        "isActive": 'Activeflag'
    };

    ngOnInit(): void {
        this.csvFileName = "User Details";
        this.addAndEditPath = "/Masters/UserMaster/AddUser";
        this.getUserDetails();
    }
    constructor(private masterService: MasterService,) { }
    //#region to get user list
    async getUserDetails() {
        try {
            const req = {
                companyCode: this.companyCode,
                collectionName: "user_master",
                filter: { companyCode: this.companyCode}
            };

            const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));

            if (res && res.data && Array.isArray(res.data)) {
                const dataWithFormattedDate = res.data.map(obj => ({
                    ...obj,
                    eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : ''
                })).sort((a, b) => b._id.localeCompare(a._id));

                this.csv = dataWithFormattedDate;
                this.tableLoad = false;
            } else {
                console.error("No data found");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }
    //#endregion

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
        delete det.eNTDT
        det['mODDT'] = new Date()
        det['mODBY'] = localStorage.getItem("UserName")
        det['mODLOC'] = localStorage.getItem("Branch")
        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "user_master",
            filter: { _id: id, },
            update: det
        };
        const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
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
}
