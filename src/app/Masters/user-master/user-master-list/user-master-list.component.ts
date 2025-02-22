import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
@Component({
    selector: 'app-user-master-list',
    templateUrl: './user-master-list.component.html'
})

export class UserMasterListComponent implements OnInit {
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    companyCode: any = 0;
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
    // columnHeader = {
    //     "eNTDT": "Created Date",
    //     "userId": "User Code",
    //     "name": "User Name",
    //     "multiLocation": "Locations",
    //     "role": "User Role",
    //     "isActive": "Active Flag",
    //     "actions": "Action"
    // };

        columnHeader = {
            eNTDT: {
              Title: "Created Date",
              class: "matcolumnleft",
              Style: "min-width:200px",
              sticky: true,
            
            },
            userId: {
              Title: "User Code",
              class: "matcolumnleft",
              Style: "min-width:100px",
              sticky: true,
         
            },
            name: {
              Title: "User Name",
              class: "matcolumnleft",
              Style: "min-width:150px",
              sticky: true,
              
            },
            multiLocation: {
              Title: "Locations",
              class: "matcolumnleft",
              Style: "max-width:300px ",
            
            },
            role: {
              Title: "User Role",
              class: "matcolumnleft",
              Style: "min-width:100px",
           
            },
            isActive: {
              Title: "Active Status",
              class: "matcolumncenter",
              Style: "min-width:100px",
           
            },
            actions: {
              Title: "Action",
              class: "matcolumncenter",
              Style: "min-width:100px",
              stickyEnd: true
            }
        
            // "Route": "Route",
            // "VehicleNo": "Veh No",
            // "TripID": "Trip ID",
            // "Location": "Location",
            // "Scheduled": "STA",
            // "Expected": "ETA",
            // "Status": "Status",
            // "Hrs": "Hrs.",
            // "Action": "Action"
          }
    
    headerForCsv = {
        // "internalId": 'InternalID',
        "userId": 'UserId',
        //"userpassword": 'Password',
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
    constructor(private masterService: MasterService, private storage: StorageService) {
        this.companyCode = this.storage.companyCode;
     }
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
        det['mODBY'] = this.storage.userName
        det['mODLOC'] = this.storage.branch
        let req = {
            companyCode: this.storage.companyCode,
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