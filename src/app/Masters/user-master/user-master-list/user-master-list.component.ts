import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
    selector: 'app-user-master-list',
    templateUrl: './user-master-list.component.html'
})

export class UserMasterListComponent implements OnInit {
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
    addAndEditPath: string;
    data: [] | any;
    uploadComponent: any;
    csvFileName: string;
    toggleArray = ["isActive"]
    linkArray = []
    
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
        "srNo": "Sr No",
        "userId": "User Code",
        "name": "User Name",
        "location": "User Branch",
        "isActive": "Active Flag",
        "actions": "Action"
    };
    headerForCsv = {
        "internalID": 'InternalID',
        "userId": 'UserId',
        "password": 'Password',
        "name": 'Name',
        "gender": 'Gender',
        "secretQuestion": 'SecretQuestion',
        "secretAnswer": 'SecretAnswer',
        "dateOfJoining": 'DateofJoining',
        "managerID": 'ManagerID',
        "branchCode": 'Location',
        "dateOfBirth": 'DateofBirth',
        "residentialAddress": 'ResidentialAddress',
        "mobileNo": 'MobileNo',
        "emailId": 'EmailId',
        "role": 'Role',
        "userType": 'UserType',
        "userStatus": 'UserStatus',
        "isActive": 'Activeflag'
    };
    csv: any;

    ngOnInit(): void {
        this.csvFileName = "User Details";
        this.addAndEditPath = "/Masters/UserMaster/AddUser";
        //setting csv file Name so file will be saved as per this name
        this.getUserDetails();
    }

    constructor(private masterService: MasterService) {
    }

    getUserDetails() {
        // Fetch data from the JSON endpoint

        this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
            this.data = res;
            this.csv = this.data['userData'];
            this.tableLoad = false;
        });
    }
    functionCallHandler($event) {
        // console.log("fn handler called", $event);

        let field = $event.field;                   // the actual formControl instance
        let functionName = $event.functionName;     // name of the function , we have to call

        // we can add more arguments here, if needed. like as shown
        // $event['fieldName'] = field.name;

        // function of this name may not exists, hence try..catch 
        try {
            this[functionName]($event);
        } catch (error) {
            // we have to handle , if function not exists.
            console.log("failed");
        }
    }

}