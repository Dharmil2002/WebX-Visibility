import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FleetMaster } from 'src/app/Models/fleet-Master/fleet';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { VehicleService } from 'src/app/Utility/module/masters/vehicle-master/vehicle-master-service';
import { MasterService } from 'src/app/core/service/Masters/master.service';

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
    constructor(
        
        private masterService: MasterService,
        private vehicleService: VehicleService,
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
            console.log(this.tripId);
        });
       
    }

    ngOnInit(): void {
        this.getTHC()
    }


    // * retrieves detailed information about a vehicle.
    //  * Uses the vehicle service to fetch nested details based on the vehicle number.
    //     * The result is assigned to the 'vehicleNestedDetail' property.
    async getVehicleDetail() {
        // Using the vehicle service to get nested details for the specified vehicle number
        this.vehicleNestedDetail = await this.vehicleService.getVehicleNestedDetail({ vehicleNo: this.thcNestedData.vehicle })
    }

    // Function to retrieve THC data
    getTHC() {
        // Extract tripId from THC details column data, default to 0 if not present
        
        // Prepare request object for THC data retrieval
        const req = {
            companyCode: this.companyCode,
            collectionName: "thc_detail",
            filter: { tripId: this.tripId },
        };
        // Subscribe to the master service to fetch THC data
        this.masterService.masterPost("generic/get", req).subscribe({
            next: (res: any) => {
                // Check if data is present in the response
                if (res.data && res.data.length > 0) {
                    // Split the route into origin and destination parts
                    const routeParts = res.data[0].route.split('-');
                    // Check if the route format is valid (should have exactly two parts)
                    if (routeParts.length === 2) {
                        // Extract origin and destination from routeParts
                        const origin = routeParts[0].trim();
                        const destination = routeParts[1].trim();

                        // Update thcNestedData with additional properties
                        this.thcNestedData = {
                            ...res.data[0],
                            origin: origin,
                            dest: destination,
                            updateDate: formatDocketDate(res.data[0]?.updateDate || new Date())
                        };
                        
                        // Determine label based on THC status for arrival information
                        this.labelArrival = this.thcNestedData.status == "1" ? "ETA" : "Arrived"
                        // Fetch additional vehicle details
                        this.getVehicleDetail()
                    } else {
                        console.error("Invalid route format:", res.data[0].route);
                    }
                } else {
                    console.error("No data received or empty array.");
                }
            },
            error: (err: any) => {
                console.error("Error fetching THC data:", err);
            },
        });
    }

}
