import { Cnote } from "src/app/core/models/Cnote";

export const CNOTEDATA: Cnote[] = [
  { Seq: 1, label: 'CNote No', name: 'CNoteNo', type: 'text', dropdown: '', ActionFunction: "apicall", validation: '' },
  { Seq: 2, label: 'CNote Date', name: 'CnoteDate', type: 'date', dropdown: '', ActionFunction: '', validation: 'Required' },
  {
    Seq: 3, label: 'Payment Type ', name: 'PaymentType', type: 'dropdown', dropdown: [
      { value: 'PAID', label: 'PAID' },
      { value: 'TBB', label: 'TBB' },
      { value: 'TOPAY', label: 'TO PAY' },
      { value: 'FOC', label: 'FOC' }
    ], ActionFunction: '', validation: '  '
  },
  { Seq: 4, label: 'Billing Party', name: 'BillingParty', type: 'text', dropdown: '', ActionFunction: '', validation: 'Required' },
  { Seq: 5, label: 'Origin', name: 'Origin', type: 'text', dropdown: '', ActionFunction: "apicall", validation: '' },
  {
    Seq: 6, label: 'From City', name: 'FromCity', type: 'dropdown', dropdown: [
      { value: 'Navsari', label: 'Navsari' },
      { value: 'Surat', label: 'Surat' },
      { value: 'Delhi', label: 'Delhi' },
    ], ActionFunction: '', validation: 'Required'
  },
  { Seq: 7, label: 'Destination', name: 'Destination', type: 'text', dropdown: '', ActionFunction: "apicall", validation: 'Required' },
  {
    Seq: 8, label: 'To City', name: 'ToCity', type: 'dropdown', dropdown: [
      { value: 'Navsari', label: 'Navsari' },
      { value: 'Surat', label: 'Surat' },
      { value: 'Delhi', label: 'Delhi' },
    ], ActionFunction: '', validation: 'Required'
  },
  { Seq: 9, label: 'PRQ NO', name: 'PRQNO', type: 'dropdown', dropdown: '', ActionFunction: '', validation: '' },
  {
    Seq: 10, label: 'Product', name: 'Product', type: 'text', dropdown: [
      { value: 'AIR', label: 'AIR' },
      { value: 'EXPRESS', label: 'EXPRESS' },
      { value: 'RAIL', label: 'RAIL' },
      { value: 'ROAD', label: 'ROAD' },
    ], ActionFunction: '', validation: ''
  },
  {
    Seq: 11, label: 'Service Type', name: 'ServiceType', type: 'dropdown', dropdown: [
      { value: 'FCL', label: 'FCL' },
      { value: 'FTL', label: 'FTL' },
      { value: 'LTL', label: 'LTL' }
    ], ActionFunction: '', validation: ''
  },
  { Seq: 12, label: 'Type of Movement ', name: 'TypeofMovement ', type: 'dropdown', dropdown: '', ActionFunction: '', validation: 'Required' },
  { Seq: 13, label: 'Pickup/Delivery ', name: 'PickupDelivery ', type: 'dropdown',dropdown: [
    { value: 'Door PickUp - Door Delivery', label: 'Door PickUp - Door Delivery' },
    { value: 'Door PickUp - GodDown Delivery', label: 'Door PickUp - GodDown Delivery' },
    { value: 'GodDown Delivery   - Door Delivery', label: 'GodDown Delivery   - Door Delivery' },
  ], ActionFunction: '', validation: '' },
  { Seq: 14, label: 'Packaging Type', name: 'PackagingType', type: 'dropdown',dropdown: [
    { value: 'WoodenBox', label: 'WoodenBox' },
    { value: 'BAG', label: 'BAG' },
    { value: 'Drum', label: 'Drum' },
    { value: 'Cars', label: 'Cars' },
    { value: 'Plasticdrum', label: 'Plasticdrum' },
  ], ActionFunction: '', validation: '' },
  { Seq: 15, label: 'Is Market Vehicle ', name: 'IsMarketVehicle ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '' },
  { Seq: 16, label: 'Vehicle No', name: 'VehicleNo', type: 'text', dropdown: '', ActionFunction: "", validation: '' },
  { Seq: 17, label: 'ODA', name: 'ODA ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '' },
  { Seq: 18, label: 'Local CNote', name: 'LocalCNote ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '' },
  {Seq: 19, label: 'Special Instruction', name: 'SpecialInstruction', type: 'text', dropdown: '', ActionFunction: "", validation: '' },
  { Seq: 20, label: 'Business Type', name: 'BusinessType', type: 'dropdown',dropdown: [
    { value: 'ExpressCargo', label: 'Express-Cargo' },
    { value: 'AIRCARGO', label: 'AIR CARGO' },
    { value: 'Containercargo', label: 'Container cargo' },
    { value: 'FTL', label: 'FTL' }
  ], ActionFunction: '', validation: 'Required' },
  { Seq: 21, label: 'Multidelivery', name: 'Multidelivery ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '' },
  { Seq: 22, label: 'Multipickup', name: 'Multipickup ', type: 'toggle', dropdown: '', ActionFunction: '', validation: '' },
  { Seq: 23, label: 'Source CNote', name: 'Multipickup ', type: 'dropdown', dropdown: '', ActionFunction: '', validation: '' },
  
];