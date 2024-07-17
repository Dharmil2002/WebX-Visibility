import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import { EditShipmentDetailsComponent } from "src/app/operation/vehicle-update-upload/edit-shipment-details/edit-shipment-details.component";
import { DocCalledAs, DocCalledAsModel } from "src/app/shared/constants/docCalledAs";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";

@Injectable({
    providedIn: "root",
})
export class StockUpdate implements IFieldDefinition {
    private docCalledAs: DocCalledAsModel;
    public columnHeader: any = {
        checkBoxRequired: {
            Title: "",
            class: "matcolumncenter",
            Style: "max-width:80px",
          },      
        Shipment: {
            Title: `${ DocCalledAs.Docket} No`,
            class: "matcolumnleft",
            Style: "min-width:18%",
        },
        Suffix: {
            Title: "Suffix",
            class: "matcolumncenter",
            Style: "min-width:6%",
        },
        Origin: {
            Title: "Origin",
            class: "matcolumnleft",
            Style: "min-width:8%",
        },
        Destination: {
            Title: "Destination",
            class: "matcolumnleft",
            Style: "min-width:10%",
        },
        Packages: {
            Title: "Pkgs",
            class: "matcolumncenter",
            Style: "min-width:16%",
            datatype: "number",
            sticky: true
        },
        weight: {
            Title: "Wt",
            class: "matcolumncenter",
            Style: "min-width:16%",
            datatype: "number",
        },
        unloadedPkg: {
            Title: "Pkgs",
            class: "matcolumncenter",
            Style: "min-width:16%",
            datatype: "number",
        },
        unloadedWT: {
            Title: "Wt",
            datatype: "number",
            class: "matcolumncenter",
            Style: "min-width:16%",
        },
        pendPkg: {
            Title: "Pkgs",
            datatype: "number",
            class: "matcolumnleft",
            Style: "min-width:6%",
        },
        pendWt: {
            Title: "Wt",
            datatype: "number",
            class: "matcolumncenter",
            Style: "min-width:10%",
        },
        Leg: {
            Title: "Leg",
            class: "matcolumncenter",
            Style: "min-width:10%",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumncenter",
            Style: "max-width:6%",
            stickyEnd: true,
        }
    };
    public summaryGroup: any[] = [{
            Name: "Docket Details",
            Title: "",
            class: "matcolumncenter",
            ColSpan: 5,
            sticky: true
        },
        {
            Name: "Arrived",
            Title: "Arrived",
            class: "matcolumncenter",
            ColSpan: 2,
            sticky: true
        },
        {
            Name: "Un-Loaded",
            Title: "Un-Loaded",
            class: "matcolumncenter",
            ColSpan: 2,
            sticky: true
        },
        {
            Name: "Pending",
            Title: "Pending",
            class: "matcolumncenter",
            ColSpan: 2,
            sticky: true
        },
        {
            Name: "leg",
            Title: "",
            class: "matcolumncenter",
            ColSpan: 3,
            sticky: true
        }
    ];
    public staticField: string[] = [
        "Shipment",
        "Suffix",
        "Origin",
        "Destination",
        "Packages",
        "weight",
        "unloadedPkg",
        "unloadedWT",
        "pendPkg",
        "pendWt",
        "Leg"
    ];

    constructor(
        private controlPanel: ControlPanelService
    ) { 
        this.docCalledAs = this.controlPanel.DocCalledAs;

        this.columnHeader.Shipment.Title = `${this.docCalledAs.Docket} No`;

        this.summaryGroup.filter((item) => item.Name === "Docket Details")[0].Title = `${this.docCalledAs.Docket} Details`;
        //this.staticField[0] = `${this.docCalledAs.Docket} No`;
    }   
    
    menuItems = [
        { label: 'Update', componentDetails: EditShipmentDetailsComponent, function: "GeneralMultipleView" },
    ];
    getColumn(columnName: string): any | undefined {
        return this.columnHeader[columnName] ?? undefined;
    }

    getColumnDetails(columnName: string, field: string): any | undefined {
        const columnInfo = this.columnHeader[columnName];
        return columnInfo ? columnInfo[field] : undefined;
    }

    getColumnTitle(columnName: string): string | undefined {
        return this.getColumnDetails(columnName, "Title");
    }

    getColumnClass(columnName: string): string | undefined {
        return this.getColumnDetails(columnName, "class");
    }

    getColumnStyle(columnName: string): string | undefined {
        return this.getColumnDetails(columnName, "Style");
    }
}
