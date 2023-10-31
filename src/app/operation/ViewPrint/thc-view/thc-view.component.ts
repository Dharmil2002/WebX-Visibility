import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FleetMaster } from 'src/app/Models/fleet-Master/fleet';
import { VehicleService } from 'src/app/Utility/module/masters/vehicle-master/vehicle-master-service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FieldMapping, GetHtmlTemplate } from './thc-data';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import moment from 'moment';

@Component({
    selector: 'app-thc-view',
    templateUrl: './thc-view.component.html'
})
export class THCViewComponent implements OnInit {
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    vehicleNestedDetail: FleetMaster[];
    labelArrival: string;
    companylogo: string;
    imageUrl: string;
    thcDetails: any;
    thcNestedData: any;
    tripId: any;
    Json: any;
    FieldMapping = FieldMapping;
    HtmlTemplate: any;
    totalAmt: number;
    contractAmt: number;
    THCViewPrint = false
    otherAmt: number;
    deductionAmt: number;
    ETA: number;
    Departed: number;
    vehicleData: any;
    jsonData: any;

    constructor(

        private masterService: MasterService,
        // private vehicleService: VehicleService,
        private renderer: Renderer2,
        private router: ActivatedRoute
    ) {
        this.renderer.setStyle(
            document.querySelector("nav.navbar"),
            "display",
            "none"
        ); // Hide Navbar
        this.renderer.setStyle(
            document.querySelector("#leftsidebar"),
            "display",
            "none"
        ); //Hide Sidebars
        this.router.queryParams.subscribe((params) => {

            this.tripId = params["THC"];

        });
    }

    ngOnInit(): void {
        //this.getTHC()
        this.HtmlTemplate = GetHtmlTemplate()
        this.getThcDetail()
    }

    // * retrieves detailed information about a vehicle.
    //  * Uses the vehicle service to fetch nested details based on the vehicle number.
    //     * The result is assigned to the 'vehicleNestedDetail' property.
    // async getVehicleDetail() {
    // Using the vehicle service to get nested details for the specified vehicle number
    //     this.vehicleNestedDetail = await this.vehicleService.getVehicleNestedDetail({ vehicleNo: this.thcNestedData.vehicle })
    //     this.getDocketDetail()
    // }

    // Function to retrieve THC data
    // getTHC() {
    //     // Prepare request object for THC data retrieval
    //     const req = {
    //         companyCode: this.companyCode,
    //         collectionName: "thc_detail",
    //         filter: { tripId: this.tripId },
    //     };
    //     // Subscribe to the master service to fetch THC data
    //     this.masterService.masterPost("generic/get", req).subscribe({
    //         next: (res: any) => {
    //             // Check if data is present in the response
    //             if (res.data && res.data.length > 0) {
    //                 // Split the route into origin and destination parts
    //                 const routeParts = res.data[0].route.split('-');
    //                 // Check if the route format is valid (should have exactly two parts)
    //                 if (routeParts.length === 2) {
    //                     // Extract origin and destination from routeParts
    //                     const origin = routeParts[0].trim();
    //                     const destination = routeParts[1].trim();
    //                     // Update thcNestedData with additional properties
    //                     this.thcNestedData = {
    //                         ...res.data[0],
    //                         origin: origin,
    //                         dest: destination,
    //                         updateDate: res.data[0]?.updateDate || new Date()
    //                     };
    //                     const originalDate = new Date(this.thcNestedData.updateDate);
    //                     this.ETA = originalDate.setDate(originalDate.getDate() + 2);
    //                     this.Departed = this.thcNestedData.updateDate
    //                     // Fetch additional vehicle details
    //                     this.getVehicleDetail()
    //                 } else {
    //                     console.error("Invalid route format:", res.data[0].route);
    //                 }
    //             } else {
    //                 console.error("No data received or empty array.");
    //             }
    //         },
    //         error: (err: any) => {
    //             console.error("Error fetching THC data:", err);
    //         },
    //     });
    // }

    // async getDocketDetail() {
    //     const req = {
    //         companyCode: this.companyCode,
    //         collectionName: "docket_temp",
    //         filter: { docketNumber: this.thcNestedData.docket[0] },
    //     };
    //     // Subscribe to the master service to fetch THC data
    //     const Res = await this.masterService.masterPost("generic/get", req).toPromise()
    //     if (Res.success && Res.data.length > 0) {
    //         this.thcNestedData = Res.data[0];
    //         this.thcNestedData = {
    //             ...this.thcNestedData,
    //             otherAmount: Res.data[0].otherAmount,
    //             transMode: Res.data[0].transMode,
    //             invoiceDetails: Res.data[0].invoiceDetails[0],
    //             totalAmt: parseFloat(this.thcNestedData.contAmt) + parseFloat(Res.data[0].otherAmount)
    //         }
    //         this.getvendorName()
    //     }
    // }

    // async getvendorName() {
    //     const req = {
    //         companyCode: this.companyCode,
    //         collectionName: "vendor_detail",
    //         filter: { vendorCode: this.thcNestedData.vendorName },
    //     };
    //     // Subscribe to the master service to fetch THC data
    //     const Res = await this.masterService.masterPost("generic/get", req).toPromise()
    //     if (Res.success && Res.data.length > 0) {
    //         this.thcNestedData = {
    //             ...this.thcNestedData,
    //             vendorName_code: Res.data[0].vendorCode + ' - ' + Res.data[0].vendorName
    //         }

    //     }
    //     this.JsonData = {
    //         ...this.vehicleNestedDetail,
    //         ...this.thcNestedData,
    //     };
    //     
    // }

    async getThcDetail() {
        const res = await this.masterService.getJsonFileDetails("thcDetail").toPromise();
        this.THCViewPrint = true
        this.jsonData = res.data[0]
    }
}
