//  import { Cnote } from "src/app/core/models/Cnote";

import { Cnote } from "src/app/core/models/Cnote";

// // export const CNOTEDATA: Cnote[] = [
// //   { Seq: 1, label: 'CNote No', name: 'CNoteNo', type: 'text', dropdown: '', ActionFunction: "apicall", validation: '', disable: 'true' },
// //   {
// //     Seq: 2, label: 'CNote Date', name: 'CnoteDate', type: 'date', dropdown: '', ActionFunction: '', validation: 'Required', disable: ''
// //   },
// //   {
// //     Seq: 3, label: 'Payment Type ', name: 'PaymentType', type: 'dropdown', dropdown: [
// //       { value: 'PAID', label: 'PAID' },
// //       { value: 'TBB', label: 'TBB' },
// //       { value: 'TOPAY', label: 'TO PAY' },
// //       { value: 'FOC', label: 'FOC' }
// //     ], ActionFunction: '', validation: '', disable: ''
// //   },
// //   { Seq: 4, label: 'Billing Party', name: 'BillingParty', type: 'text', dropdown: '', ActionFunction: '', validation: 'Required',disable: '' },
// //   { Seq: 5, label: 'Origin', name: 'Origin', type: 'text', dropdown: '', ActionFunction: "apicall", validation: '', disable: '' },
// //   {
// //     Seq: 6, label: 'From City', name: 'FromCity', type: 'dropdown', dropdown: [
// //       { value: 'Navsari', label: 'Navsari' },
// //       { value: 'Surat', label: 'Surat' },
// //       { value: 'Delhi', label: 'Delhi' },
// //     ], ActionFunction: '', validation: 'Required', disable: ''
// //   },
// //   { Seq: 7, label: 'Destination', name: 'Destination', type: 'text', dropdown: '', ActionFunction: "apicall", validation: 'Required', disable: '' },
// //   {
// //     Seq: 8, label: 'To City', name: 'ToCity', type: 'dropdown', dropdown: [
// //       { value: 'Navsari', label: 'Navsari' },
// //       { value: 'Surat', label: 'Surat' },
// //       { value: 'Delhi', label: 'Delhi' },
// //     ], ActionFunction: '', validation: 'Required', disable: ''
// //   },
// //   { Seq: 9, label: 'PRQ NO', name: 'PRQNO', type: 'dropdown', dropdown: '', ActionFunction: '', validation: '', disable: '' },
// //   {
// //     Seq: 10, label: 'Product', name: 'Product', type: 'text', dropdown: [
// //       { value: 'AIR', label: 'AIR' },
// //       { value: 'EXPRESS', label: 'EXPRESS' },
// //       { value: 'RAIL', label: 'RAIL' },
// //       { value: 'ROAD', label: 'ROAD' },
// //     ], ActionFunction: '', validation: '', disable: ''
// //   },
// //   {
// //     Seq: 11, label: 'Service Type', name: 'ServiceType', type: 'dropdown', dropdown: [
// //       { value: 'FCL', label: 'FCL' },
// //       { value: 'FTL', label: 'FTL' },
// //       { value: 'LTL', label: 'LTL' }
// //     ], ActionFunction: '', validation: '', disable: ''
// //   },
// //   { Seq: 12, label: 'Type of Movement ', name: 'TypeofMovement ', type: 'dropdown', dropdown: '', ActionFunction: '', validation: 'Required', disable: '' },
// //   {
// //     Seq: 13, label: 'Pickup/Delivery ', name: 'PickupDelivery ', type: 'dropdown', dropdown: [
// //       { value: 'Door PickUp - Door Delivery', label: 'Door PickUp - Door Delivery' },
// //       { value: 'Door PickUp - GodDown Delivery', label: 'Door PickUp - GodDown Delivery' },
// //       { value: 'GodDown Delivery   - Door Delivery', label: 'GodDown Delivery   - Door Delivery' },
// //     ], ActionFunction: '', validation: '', disable: ''
// //   },
// //   {
// //     Seq: 14, label: 'Packaging Type', name: 'PackagingType', type: 'dropdown', dropdown: [
// //       { value: 'WoodenBox', label: 'WoodenBox' },
// //       { value: 'BAG', label: 'BAG' },
// //       { value: 'Drum', label: 'Drum' },
// //       { value: 'Cars', label: 'Cars' },
// //       { value: 'Plasticdrum', label: 'Plasticdrum' },
// //     ], ActionFunction: '', validation: '', disable: ''
// //   },
// //   { Seq: 15, label: 'Is Market Vehicle ', name: 'IsMarketVehicle ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', disable: '' },
// //   { Seq: 16, label: 'Vehicle No', name: 'VehicleNo', type: 'text', dropdown: '', ActionFunction: "", validation: '', disable: '' },
// //   { Seq: 17, label: 'ODA', name: 'ODA ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', disable: '' },
// //   { Seq: 18, label: 'Local CNote', name: 'LocalCNote ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', disable: '' },
// //   { Seq: 19, label: 'Special Instruction', name: 'SpecialInstruction', type: 'text', dropdown: '', ActionFunction: "", validation: '', disable: '' },
// //   {
// //     Seq: 20, label: 'Business Type', name: 'BusinessType', type: 'dropdown', dropdown: [
// //       { value: 'ExpressCargo', label: 'Express-Cargo' },
// //       { value: 'AIRCARGO', label: 'AIR CARGO' },
// //       { value: 'Containercargo', label: 'Container cargo' },
// //       { value: 'FTL', label: 'FTL' }
// //     ], ActionFunction: '', validation: 'Required',
// //   },
// //   { Seq: 21, label: 'Multidelivery', name: 'Multidelivery ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', disable: '' },
// //   { Seq: 22, label: 'Multipickup', name: 'Multipickup ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', disable: '' },
// //   { Seq: 23, label: 'Source CNote', name: 'Multipickup ', type: 'dropdown', dropdown: '', ActionFunction: '', validation: '', disable: '' },

// // ];
// export const CNOTEDATA: Cnote[] = [
// { Seq: 24, label: 'From Master Or Walk-In', name: 'ConsignorFromMasterOrWalkIn', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 25, label: 'Consignor', name: 'Consignor', type: 'dropdown', dropdown: '', ActionFunction: '', validation: 'Required', formgrp: 'step-2' },
// { Seq: 26, label: 'GSTIN No', name: 'ConsignorGSTINNo', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 27, label: 'Address' , name: 'ConsignorAddress', type: 'text', dropdown: '', ActionFunction: '', validation: 'Required', formgrp: 'step-2' },
// { Seq: 28, label: 'City-Pincode' , name: 'ConsignorCityPincode', type: 'dropdown', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 29, label: 'Telephone No' , name: 'ConsignorTelphone', type: 'text', dropdown: '', ActionFunction: '', validation: 'Required', formgrp: 'step-2' },
// { Seq: 30, label: 'Mobile No' , name: 'ConsignorMobno', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 31, label: 'From Master Or Walk-In', name: 'ConsigneeFromMasterOrWalkIn', type: 'toggle', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 32, label: 'Consignee', name: 'Consignee', type: 'dropdown', dropdown: '', ActionFunction: '', validation: 'Required', formgrp: 'step-2' },
// { Seq: 33, label: 'GSTIN No', name: 'ConsigneeGSTINNo', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 34, label: 'Address' , name: 'ConsigneeAddress', type: 'text', dropdown: '', ActionFunction: '', validation: 'Required', formgrp: 'step-2' },
// { Seq: 35, label: 'City-Pincode' , name: 'ConsigneeCityPincode', type: 'dropdown', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 36, label: 'Telephone No' , name: 'ConsigneeTelphone', type: 'text', dropdown: '', ActionFunction: '', validation: 'Required', formgrp: 'step-2' },
// { Seq: 37, label: 'Mobile No' , name: 'ConsigneeorMobno', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 38, label: 'Risk Type' , name: 'RiskType', type: 'dropdown', dropdown: [
//   { value: "Carrier's risk", label: "Carrier's risk" },
//   { value: "Owner's risk", label: "Owner's risk" },
// ], ActionFunction: '', validation: '', formgrp: 'step-2' },
// {Seq: 39, label: 'Customer Ref Number' , name: 'CustomerRefNumber', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// {Seq: 40, label: 'Container No 1' , name: 'ContainerNo1', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 41, label: 'Size' , name: 'Size1', type: 'dropdown', dropdown: [
//   { value: "20FT", label: "20FT" },
//   { value: "40FT", label: "40FT" },
//   { value: "45FT", label: "45FT" },
//   { value: "C17FT", label: "C17FT" },
//   { value: "C13FT", label: "C13FT" },
//   { value: "C24FT", label: "C24FT" },
//   { value: "C30FT", label: "C30FT" },
// ], ActionFunction: '', validation: '', formgrp: 'step-2' },
// {Seq: 42, label: 'Container No 1' , name: 'ContainerNo1', type: 'text', dropdown: '', ActionFunction: '', validation: '', formgrp: 'step-2' },
// { Seq: 43, label: 'Size' , name: 'Size2', type: 'dropdown', dropdown: [
//   { value: "20FT", label: "20FT" },
//   { value: "40FT", label: "40FT" },
//   { value: "45FT", label: "45FT" },
//   { value: "C17FT", label: "C17FT" },
//   { value: "C13FT", label: "C13FT" },
//   { value: "C24FT", label: "C24FT" },
//   { value: "C30FT", label: "C30FT" },
// ], ActionFunction: '', validation: '', formgrp: 'step-2' },

// ]

// export const CNOTEDATA: Cnote[] = [
//     { "Seq": 44, "label": "Volumetric", "name": "Volumetric", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 45, "label": "CFT Ratio", "name": "CFT Ratio", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 46, "label": "CFT Total", "name": "CFTTotal", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 47, "label": "Charged No of Pkg.", "name": "ChargedNoofPkg.", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 48, "label": "Charged Weight", "name": "ChargedWeight", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 49, "label": "Total Declared Value", "name": "TotalDeclaredValue", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 50, "label": "Charged KM", "name": "ChargedKM", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 51, "label": "Total Part Quantity", "name": "TotalPartQuantity", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 52, "label": "EDD", "name": "EDD", "type": "date", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 53, "label": "Invoice", "name": "Invoice", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 54, "label": "Invoice Date", "name": "InvoiceDate", "type": "date", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 55, "label": "Declared Value", "name": "DeclaredValue", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 56, "label": "No of Pkgs", "name": "NoofPkgs", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 57, "label": "Actual Weight(KG)", "name": "ActualWeight(KG)", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 58, "label": "Product", "name": "Product", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 59, "label": "HSN Code", "name": "HSNCode", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 60, "label": "EWB Number", "name": "EWBNumber", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 61, "label": "EWBDate", "name": "EWBDate", "type": "date", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 62, "label": "EWBExpiredDate", "name": "EWBExpiredDate", "type": "date", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "formarray" },
//     { "Seq": 63, "label": "Serial Scan", "name": "SerialScan", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 64, "label": "Each Scan", "name": "EachScan", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3" },
//     { "Seq": 65, "label": "From", "name": "From", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "BSTformarray" },
//     { "Seq": 66, "label": "To", "name": "To", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "BSTformarray" },
// ]
export const CNOTEDATA = [
    {
        "Seq": 2, "label": "CNote Date", "name": "CnoteDate", "type": "date", "dropdown": "", "ActionFunction": "apicall", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "TodayDate"
    },
    {
        "Seq": 3, "label": "Payment Type ", "name": "PaymentType", "type": "dropdown", dropdown: [
            { value: 'PAID', label: 'PAID' },
            { value: 'TBB', label: 'TBB' },
            { value: 'TOPAY', label: 'TO PAY' },
            { value: 'FOC', label: 'FOC' }
        ], "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "TBB"
    },
    {
        "Seq": 5, "label": "Origin", "name": "Origin", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "Mumbai"
    },
    {
        "Seq": 10, "label": "Product", "name": "Product", "type": "text", "dropdown": [
            { value: 'AIR', label: 'AIR' },
            { value: 'EXPRESS', label: 'EXPRESS' },
            { value: 'RAIL', label: 'RAIL' },
            { value: 'ROAD', label: 'ROAD' },
        ], "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "ROAD"
    },
    {
        "Seq": 12, "label": "Type of Movement", "name": "TypeofMovement", "type": "dropdown", "dropdown": "", "ActionFunction": "apicall", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "0.50-1.00MT"
    },
    {
        "Seq": 13, "label": "Pickup/Delivery", "name": "PickupDelivery", "type": "dropdown", "dropdown": [
            { value: 'Door PickUp - Door Delivery', label: 'Door PickUp - Door Delivery' },
            { value: 'Door PickUp - GodDown Delivery', label: 'Door PickUp - GodDown Delivery' },
            { value: 'GodDown Delivery   - Door Delivery', label: 'GodDown Delivery   - Door Delivery' },
        ], "ActionFunction": "apicall", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "Door PickUp - Door Delivery"
    },
    {
        "Seq": 14, "label": "Packaging Type", "name": "PackagingType", "type": "dropdown", "dropdown": [
            { value: 'WoodenBox', label: 'WoodenBox' },
            { value: 'BAG', label: 'BAG' },
            { value: 'Drum', label: 'Drum' },
            { value: 'Cars', label: 'Cars' },
            { value: 'CartonBox', label: 'Carton Box' },
            { value: 'Plasticdrum', label: 'Plasticdrum' },
        ], "ActionFunction": "apicall", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "CartonBox"
    },
    {
        "Seq": 15, "label": "Contents", "name": "Contents", "type": "dropdown", "dropdown": [
            { value: 'YarnAndHosieryitems', label: 'Yarn And Hosiery items' },
            { value: 'Medicine', label: 'Medicine' },
            { value: 'CLOTH', label: 'CLOTH' },
            { value: 'FoodGrain', label: 'Food Grain' },
            { value: 'MobilePhone', label: 'Mobile Phone' },
            { value: 'ElectornicsShipment', label: 'Electornics Shipment' }
        ], "ActionFunction": "apicall", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": "FoodGrain"
    },
    {
        "Seq": 16, "label": "Is Market Vehicle ", "name": "IsMarketVehicleOrigin", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": false
    },
    {
        "Seq": 18, "label": "ODA", "name": "ODA", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": false, "DefaultValue": false
    },
    {
        "Seq": 19, "label": "Local CNote", "name": "LocalCNote ", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": false
    },
    {
        "Seq": 21, "label": "Business Type", "name": "BusinessType ", "type": "dropdown", "dropdown": [
            { value: 'ExpressCargo', label: 'Express-Cargo' },
            { value: 'AIRCARGO', label: 'AIR CARGO' },
            { value: 'Containercargo', label: 'Container cargo' },
            { value: 'FTL', label: 'FTL' }
        ], "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "ExpressCargo": false
    },
    {
        "Seq": 22, "label": "Multidelivery", "name": "Multidelivery ", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": false
    },
    {
        "Seq": 23, "label": "Multipickup", "name": "Multipickup ", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-1", "display": true, "enable": true, "DefaultValue": false
    },
    {
        "Seq": 25, "label": "From Master Or Walk-In", "name": "ConsignorFromMasterOrWalkIn ", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-2", "display": true, "enable": true, "DefaultValue": true
    },
    {
        "Seq": 29, "label": "City-Pincode", "name": "ConsignorCityPincode ", "type": "dropdown", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-2", "display": true, "enable": true, "DefaultValue": "395001"
    },
    {
        "Seq": 32, "label": "From Master Or Walk-In", "name": "ConsigneeFromMasterOrWalkIn ", "type": "dropdown", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-2", "display": true, "enable": true, "DefaultValue": "395001"
    },
    {
        "Seq": 36, "label": "City-Pincode", "name": "ConsigneeCityPincode ", "type": "dropdown", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-2", "display": true, "enable": true, "DefaultValue": "395001"
    },
    {
        "Seq": 39, "label": "Risk Type", "name": "RiskType ", "type": "dropdown", "dropdown": [
            { value: "Carrier's risk", label: "Carrier's risk" },
            { value: "Owner's risk", label: "Owner's risk" },
        ], "ActionFunction": "", "validation": "", "formgrp": "step-2", "display": true, "enable": true, "DefaultValue": "Carrier's risk"
    },
    { "Seq": 45, "label": "Volumetric", "name": "Volumetric", "type": "toggle", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": true, "DefaultValue": false },
    { "Seq": 48, "label": "Charged No of Pkg.", "name": "ChargedNoofPkg.", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": true, "DefaultValue": 0.00 },
    { "Seq": 49, "label": "Charged Weight", "name": "Charged Weight.", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": true, "DefaultValue": 0.00 },
    { "Seq": 50, "label": "Total Declared Value", "name": "TotalDeclaredValue", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": false, "DefaultValue": 0.00 },
    { "Seq": 51, "label": "Charged KM", "name": "ChargedKM", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": false, "DefaultValue": 0 },
    { "Seq": 52, "label": "Total Part Quantity", "name": "TotalPartQuantity", "type": "text", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": false, "DefaultValue": 0.00 },
    { "Seq": 53, "label": "EDD", "name": "EDD", "type": "date", "dropdown": "", "ActionFunction": "", "validation": "", "formgrp": "step-3", "display": true, "enable": false, "DefaultValue": "Today" },
    {
        "Seq": 55, "label": "Invoice Date", "name": "InvoiceDate", "type": "date", "dropdown": "", "ActionFunction": "apicall", "validation": "", "formgrp": "formarray", "display": true, "enable": true, "DefaultValue": "TodayDate"
    },
    {
        "Seq": 62, "label": "EWBDate", "name": "EWBDate", "type": "date", "dropdown": "", "ActionFunction": "apicall", "validation": "", "formgrp": "formarray", "display": true, "enable": true, "DefaultValue": "TodayDate"
    },
    {
        "Seq": 63, "label": "EWBExpiredDate", "name": "EWBExpiredDate", "type": "date", "dropdown": "", "ActionFunction": "apicall", "validation": "", "formgrp": "formarray", "display": true, "enable": true, "DefaultValue": "TodayDate"
    },
    {
        "Seq": 64, "label": "Serial Scan", "name": "SerialScan", "type": "toggle", "dropdown": "", "ActionFunction": "BSTYP", "validation": "", "formgrp": "step-3", "display": true, "enable": false, "DefaultValue": true
    },
    {
        "Seq": 65, "label": "Each Scan", "name": "EachScan", "type": "toggle", "dropdown": "", "ActionFunction": "BSTYP", "validation": "", "formgrp": "step-3", "display": true, "enable": false, "DefaultValue": false
    },
]

