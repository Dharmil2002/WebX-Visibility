import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-beneficiary-master-list',
  templateUrl: './beneficiary-master-list.component.html'
})
export class BeneficiaryMasterListComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  addAndEditPath: string;
  tableData: any = [];
  tableLoad = true;
  linkArray = ['']
  csvFileName: string = '';
  columnHeader = {
    'eNTDT': 'Created Date',
    'beneficiaryType': 'Code',
    'beneficiary': 'Name',
    "actions": "Actions"
  };
  breadScrums = [
    {
      title: "Beneficiary Master",
      items: ["Home"],
      active: "Beneficiary Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  TableStyle = "width:60%"
  headerForCsv = {
    'eNTDT': 'Created Date',
    'beneficiaryType': 'Code',
    'beneficiary': 'Name',
  };
  toggleArray = [""];
  constructor(private masterService: MasterService) {

  }

  ngOnInit(): void {
    this.csvFileName = "Beneficiary Details"
    this.getBeneficiaryDetails()
    this.addAndEditPath = '/Masters/BeneficiaryMaster/AddBeneficiaryMaster'
  }
  //#region to get beneficiary details
  async getBeneficiaryDetails() {
    try {
      // Create a request object to fetch data from "beneficiary_detail" collection
      const req = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "beneficiary_detail"
      };

      // Make the API call and await the response
      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));;

      if (res) {
        // Enrich the data with beneficiary names
        const enrichedData = await this.enrichTableData(res.data);

        // Sort the data by the "eNTDT" property in descending order
        const formattedData = enrichedData.map(obj => ({
          ...obj,
          eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : ''
        })).sort((a, b) => b._id.localeCompare(a._id));

        // Update the tableData and indicate that the table is no longer loading
        this.tableData = formattedData;
        this.tableLoad = false;
      }
    } catch (error) {
      // Handle and log any errors that occur during the main process
      console.error('Error fetching and processing beneficiary details:', error);
    }
  }
  //#endregion

  //#region to define a function to enrich data with beneficiary names and other information
  async enrichTableData(data) {
    const enrichedData = [];

    for (const element of data) {
      // Get the mapping for the beneficiary type (e.g., 'Customer', 'Vendor')
      const mapping = this.getMappingForBeneficiaryType(element.beneficiaryType);

      if (mapping) {
        const { filterKey, collectionName } = mapping;

        // Create a filter to fetch data specific to the element's beneficiary
        const filter = { [filterKey]: element.beneficiary };

        try {
          // Fetch data using the filter
          const res = await this.fetchData(collectionName, filter);
          if (res) {
            // Extract the beneficiary's name based on beneficiaryType
            const beneficiaryName = this.findBeneficiaryName(res.data, filterKey, element.beneficiary);
            element.beneficiary = this.getBeneficiaryProperty(beneficiaryName, element.beneficiaryType);
          }
        } catch (error) {
          console.error(error);
        }

        // Add the enriched element to the result array
        enrichedData.push(element);
      }
    }

    return enrichedData;
  }

  // Get the property value (e.g., customerName, vendorName) based on the beneficiaryType
  getBeneficiaryProperty(beneficiaryName, beneficiaryType) {
    switch (beneficiaryType) {
      case 'Customer':
        return beneficiaryName.customerName;
      case 'Vendor':
        return beneficiaryName.vendorName;
      case 'Driver':
        return beneficiaryName.driverName;
      case 'Employee':
        return beneficiaryName.name;
      default:
        return null;
    }
  }

  // Retrieve the filter key and collection name based on the beneficiaryType
  getMappingForBeneficiaryType(beneficiaryType) {
    const mappings = {
      'Customer': { filterKey: 'customerCode', collectionName: 'customer_detail' },
      'Vendor': { filterKey: 'vendorCode', collectionName: 'vendor_detail' },
      'Driver': { filterKey: 'manualDriverCode', collectionName: 'driver_detail' },
      'Employee': { filterKey: 'userId', collectionName: 'user_master' },
    };
    return mappings[beneficiaryType];
  }

  // Fetch data from a specified collection using the provided filter
  async fetchData(collectionName, filter) {
    const req = {
      companyCode: this.companyCode,
      filter,
      collectionName,
    };
    try {
      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Find the beneficiary's name in the data using the filter key and beneficiary value
  findBeneficiaryName(data, filterKey, beneficiary) {
    return data.find(e => e[filterKey] === beneficiary);
  }
  //#endregion
}