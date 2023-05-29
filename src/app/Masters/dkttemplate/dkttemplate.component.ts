import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dkttemplate',
  templateUrl: './dkttemplate.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DKTTemplateComponent implements OnInit {
  dateControl = new FormControl();

  ngOnInit(): void {
  }
  apiUrl = 'https://webxpress.azure-api.net/paytrans/ewaybill/GetEWayBillByEWBNo';
  subscriptionKey = 'd141e1390212494bb9a577af2d4ccb74';

  username: string;
  password: string;
  customerId: string;
  loginGSTIN: string;
  ewbNo: string;
  transGSTIN: string;
  ewbDate: string;

  constructor(private http: HttpClient) {}

  onSubmit() {
    const headers = new HttpHeaders()
    //.set('Origin', 'http://localhost:4200') // Replace with your application's domain
    .set('Ocp-Apim-Subscription-Key', 'd141e1390212494bb9a577af2d4ccb74')
    .set('Content-Type', 'application/json');


    const payload = {
      UserName: 'liveapi@scorpiongroup.in',
      Password:'L1ve@API!2018',
      CustomerId: '51',
      LoginGSTIN: '88AAJCS7860C1ZK',
      EWBNo: '361585957191',
      TransGSTIN: '88AAJCS7860C1ZK',
      EWBDate:'12 Apr 2023'
    };

    this.http.post(this.apiUrl, payload,{ headers, withCredentials: true }).subscribe(response => {
      console.log(response);
    });
  }
}
