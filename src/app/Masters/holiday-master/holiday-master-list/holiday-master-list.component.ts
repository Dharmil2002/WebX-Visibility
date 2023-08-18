import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { AddEditHolidayComponent } from "../add-edit-holiday-master/add-edit-holiday.component";

@Component({
    selector: 'app-holiday-master-list',
    templateUrl: './holiday-master-list.component.html'
})

export class HolidayMasterComponent implements OnInit {
    tableLoad = true;
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    dateWiseData: any[];
    toggleArray = ["isActive"];
    addAndEditPath: string;
    viewComponent: any;
    dialogData = 'a'
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
    }

    ngOnInit(): void {
        this.width = "750px";
        this.height = "400px";
        this.getHolidayDetails();
        this.viewComponent = AddEditHolidayComponent;
    }

    getHolidayDetails() {
        let req = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "holiday_detail"
        }
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                if (res) {

                    // Generate srno for each object in the array
                    const dataWithSrno = res.data.map((obj, index) => {
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
        });
    }

    IsActiveFuntion(det) {
        let id = det.id;
        // Remove the "id" field from the form controls
        delete det.id;
        delete det.srNo;
        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            type: "masters",
            collection: "holiday_detail",
            id: id,
            updates: det
        };
        this.masterService.masterPut('common/update', req).subscribe({
            next: (res: any) => {
                if (res) {
                    // Display success message
                    Swal.fire({
                        icon: "success",
                        title: "Successful",
                        text: res.message,
                        showConfirmButton: true,
                    });
                    this.getHolidayDetails();
                }
            }
        });
    }
}