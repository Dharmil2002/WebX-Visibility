import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'demo-iframe-dialog',
  styles: [
    `
      .map-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 30px;
      }

      .map-frame {
        border: 2px solid black;
        height: 100%;
      }

      #map {
        height: 100%;
      }
    `,
  ],
  template: `
    <button mat-button (click)="onCloseClick()" mat-dialog-close>Close</button>
    <div style="height: 500px;width:500px">
      <div id="map"></div>
    </div>
  `,
})
export class MapRender {
  private map;
  Lat: any;
  Long: any;
  modulename: any;
  constructor(
    public dialogRef: MatDialogRef<MapRender>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    this.Lat='';
    this.Long='';
    this.modulename= this.data.Modulename;
  }
  ngOnInit() {
    this.initMap();
    this.map;
  }
  
  initMap(): void {
    this.map = L.map('map', {
      center: [21.146633, 79.0886],
      zoom: 5,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    this.map.on(
      'click',
      function (e) {
        this.Lat = e.latlng.lat;
        this.Long = e.latlng.lng;
        this.onCloseClick();
      },
      this
    );

    tiles.addTo(this.map);
  }
  onCloseClick(): void {

    if(this.Lat==''||this.Long==''){
      this.dialogRef.close(this.data='');
      if(this.modulename == "CustomerMaster"){
        this.router.navigateByUrl('Masters/CustomerMaster/AddCustomerMaster');
      }
      else{
      this.router.navigateByUrl('Masters/LocationMaster/AddLocationMaster');
      }
    }else{
    this.data = this.Lat.toFixed(6) + ',' + this.Long.toFixed(6);
    this.dialogRef.close(this.data);
    if(this.modulename == "CustomerMaster"){
      this.router.navigateByUrl('Masters/CustomerMaster/AddCustomerMaster');
    }
    else{
    this.router.navigateByUrl('Masters/LocationMaster/AddLocationMaster');
    }
  }}
}
