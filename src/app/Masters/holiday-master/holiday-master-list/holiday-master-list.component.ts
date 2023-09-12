import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { AddEditHolidayComponent } from "../add-edit-holiday-master/add-edit-holiday.component";

@Component({
    selector: 'app-holiday-master-list',
    templateUrl: './holiday-master-list.component.html'
})

export class HolidayMasterComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    tableLoad = true;
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    data: [] | any;
    dateWiseData: any[];
    dayWiseData: any[];
    toggleArray = ["isActive"];
    addAndEditPath: string;
    viewComponent: any;
    dialogData = "a";
    breadScrums = [
        {
            title: "Holiday Master",
            items: ["Masters"],
            active: "Holiday Master",
        },
    ];
    columnHeader =
        {
            "srNo": "Sr No",
            "holidayDate": "Holiday Date",
            "days": "Day of Hoilday",
            "holidayNote": "Holiday Note",
            "isActive": "Active",
            "View": "Edit"
        }
    dynamicControls = {
        add: true,
        edit: true,
        csv: false
    };
    linkArray = [];
    menuItems = [];
    width: string;
    height: string;


    constructor(private masterService: MasterService) {
        super();
    }

    ngOnInit(): void {
        this.width = "750px";
        this.height = "380px";
        this.getHolidayDetails();
        this.viewComponent = AddEditHolidayComponent;
    }

    async getHolidayDetails() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "holiday_detail",
            filter: {}
        }
        const res = await this.masterService.masterPost("generic/get", req).toPromise()
        if (res) {
            // Generate srno for each object in the array
            const holidayDetail = res.data.filter((x) => x.type === "DATE");
            const dataWithSrno = holidayDetail.
                map((obj, index) => {
                    // obj.isActive = obj.activeflag == 'Y' ? true : false
                    return {
                        ...obj,
                        srNo: index + 1
                    };
                });
            this.dateWiseData = dataWithSrno;
            this.tableLoad = false;
        }
    }

    async IsActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        delete det.srNo;
        let req = {
            companyCode: this.companyCode,
            collectionName: "holiday_detail",
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
              }).then((result) => {
                if (result.isConfirmed) {
                  // Add your event code here
                  // This code will run when the user clicks "OK"
                }
              });
              
            this.getHolidayDetails();
        }
    }
}