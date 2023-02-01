import { Cnote } from "src/app/core/models/Cnote";

export const CNOTEDATA:Cnote[]= [
    {loadingSequance:1,label:'Vehicle No',name: 'VehicleNo',type:'text',dropdown:'',ActionFunction:"apicall"},
    {loadingSequance:2,label:'Special Instration',name: 'SpecialInstration',type:'text',dropdown:'',ActionFunction:'' },
    {loadingSequance:3,label:'PRQ NO',name: 'PRQNO',type:'text',dropdown:'',ActionFunction:'' },
    {loadingSequance:4,label:'Source CNote',name: 'SourceCNote',type:'text',dropdown:'',ActionFunction:'' },
    {loadingSequance:5,label:'CNote Date',name: 'CnoteDate',type:'date',dropdown:'',ActionFunction:'' },
    {loadingSequance:6,label:'Payment Type ',name: 'PaymentType',type:'dropdown',dropdown: [
      { value: 'PAID', label: 'PAID' },
      { value: 'TBB', label: 'TBB' },
      { value: 'TOPAY', label: 'TO PAY' },
      { value: 'FOC', label: 'FOC' }
    ],ActionFunction:'' },
    {loadingSequance:7, label:'City',name: 'City',type:'dropdown',dropdown: [
      { value: 'Navsari', label: 'Navsari' },
      { value: 'Surat', label: 'Surat' },
      { value: 'Delhi', label: 'Delhi' },
    ],ActionFunction:'' },
   
  ];