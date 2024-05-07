import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { AddEditHolidayComponent } from "../add-edit-holiday-master/add-edit-holiday.component";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
    selector: 'app-holiday-master-list',
    templateUrl: './holiday-master-list.component.html'
})

export class HolidayMasterComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    tableLoad = true;
    companyCode: any = 0;
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
            "srNo": {
                Title: " # ",
                class: "matcolumncenter",
                Style: "min-width:50px; max-width:50px",
                sticky: true,
              },
              "holidayDate": {
                Title: "Holiday Date",
                class: "matcolumncenter",
                Style: "min-width:150px; max-width:150px",
                datatype: "date",
                sticky: true,
              },
              "days": {
                Title: "Day of Hoilday",
                class: "matcolumnleft",
                Style: "min-width:150px; max-width:100px",
              },
              "holidayNote": {
                Title: "Holiday Note",
                class: "matcolumnleft",
                Style: "min-width:250px; max-width:150px",
              },
              "isActive": {
                Title: "Active",
                class: "matcolumnleft",
                Style: "min-width:80px; max-width:80px",
              },
              view: {                
                Title: "Edit",
                class: "matcolumncenter",
                Style: "min-width:80px; max-width:80px;",         
                iconName: "edit",      
                stickyEnd: true,
              }
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


    constructor(private masterService: MasterService, private storage: StorageService) {
        super();
        this.companyCode = this.storage.companyCode;
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