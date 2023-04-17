import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-ewaybill-config',
  templateUrl: './ewaybill-config.component.html',
  styleUrls: ['./ewaybill-config.component.sass']
})
export class EwaybillConfigComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getEWayBill() {
    const url = 'http://localhost:3000/api/courses/ewaybill';
    const headers = {
      'Ocp-Apim-Subscription-Key': 'd141e1390212494bb9a577af2d4ccb74',
      'Content-Type': 'application/json'
    };
    const data = {
      'UserName': 'liveapi@scorpiongroup.in',
      'Password': 'L1ve@API!2018',
      'CustomerId': '51',
      'LoginGSTIN': '88AAJCS7860C1ZK',
      'EWBNo': '261575640736'
    };
    this.http.post(url, data).subscribe(response => {
      console.log(response);
    });
  }
  

}
