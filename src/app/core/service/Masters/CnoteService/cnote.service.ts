import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CnoteService {

  savedData: any; // Holds the saved data.
  Departure: any; // Represents the departure information.
  loadingSheetData: any; // Contains the data for loading sheets.
  vehicleLoadingData: any; // Contains the data for vehicle loading.
  runSheetData: any; // Stores the data for run sheets.
  departRunSheetData: any; // Stores the data for departed run sheets.
  VehiceLodingSheetData: any; // Contains the data for vehicle loading sheets.
  MeniFlexPackageData: any; // Stores the data for MeniFlex packages.
  vehicleArrivalData: any; // Represents the vehicle arrival information.
  shipingData:any[]; // Contains the shipping-related data.
  meniFlexDetails: any; // Stores the MeniFlex details.
  departVehicleData: any; // Contains the data for departed vehicles.
  updateShipingData: any; // Holds the data for updating shipping information.
  shipmentData: any;

  getData(): any {
    return this.savedData;
  }
  setData(data: any): void {
    this.Departure = data;
  }
  getDeparture(): any {
    return this.Departure;
  }
  setDeparture(data: any): void {
    this.Departure = data;
  }
  setLsData(data: any) {
    this.loadingSheetData = data;
  }
  getLsData() {
    return this.loadingSheetData
  }
  setvehicelodingData(data: any) {
    this.vehicleLoadingData = data;
  }
  getVehicleLoadingData() {
    return this.vehicleLoadingData;
  }
  setRunSheetData(data: any) {
    this.runSheetData = data;
  }
  getRunSheetData() {
    return this.runSheetData;
  }
  setdepartRunSheetData(data: any) {
    this.departRunSheetData = data;

  }
  getdepartRunSheetData() {
    return this.departRunSheetData;
  }
  setVehicleLoadingData(data: any) {
    this.VehiceLodingSheetData = data;
  }
  getVehicleLoadingSheetData() {

    return this.VehiceLodingSheetData;
  }
  setMeniFlexPackageData(data) {
    this.MeniFlexPackageData = data
  }
  getMeniFlexPackageData() {
    return this.MeniFlexPackageData
  }
  /*Here Function Call to Set VehicleArrivalData in
   arriva-Dashboard.page.component.ts*/

  setVehicleArrivalData(data) {
    this.vehicleArrivalData = data
  }
  //End//

  /*for Shiping Data*/
  setShipingData(data) {
    this.shipingData = data;
  }
  /*end*/

  /*getShipingData*/

  getShipingData() {
    return this.shipingData;
  }

  /*End*/

  /**
   * Sets and retrieves the updated shipment data.
   */
  setUpdatedShipmentData(data: any): void {
    this.updateShipingData = data; // Sets the updated shipment data.
  }

  getUpdatedShipmentData(): any {
    return this.updateShipingData; // Retrieves the updated shipment data.
  }

  /*--End---*/

  /*here Function call to Get VehicleArrivalData in Mark-arrival-component.ts*/
  getVehicleArrivalData() {
    return this.vehicleArrivalData;
  }
  /*----- End ------ */
  /*Set meniflex data */

  setMeniFestDetails(data) {
    this.meniFlexDetails = data
  }

  /*---End-----*/
  /*getMeniFestDetails*/
  getMeniFestDetails() {

    return this.meniFlexDetails
  }
  /*---End-----*/

  /*Depart vehicle*/
  setDepartvehicleData(data) {
    this.departVehicleData = data
  }
  /*End*/
  /*getDepartVehicleData*/
  getDepartVehicleData() {
    return this.departVehicleData
  }
  /*End*/
  /* above  data will be removed once the API integration is completed. 
    In this improved version, the comment specifies the purpose of the code as
    temporary data storage for API integration and clarifies that the data will
     be removed once the integration is done.*/

  constructor(private http: HttpClient) { }
  // GetCnoteFormcontrol() {
  //   return this.http.get<any>(
  //     `http://localhost:3000/api/`
  //   );
  // }
  getCnoteBooking(ApiURL, req) {

    return this.http.get<any>(
      `${environment.APIBaseURL}` + ApiURL + req
    );
  }
  getNewCnoteBooking(ApiURL, req) {

    return this.http.get<any>(
      `${environment.APIBaseBetaURL}` + ApiURL + req
    );
  }

  cnotePost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  cnoteNewPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseBetaURL}` + ApiURL, Request);
  }
  CnoteMongoPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  /*below function is used set and get shipment data to used in loadingsheet */

  setShipmentData(data) {
    this.shipmentData = data;
  }
  getShipmentData() {

    return this.shipmentData
  }
  /*End*/
}
