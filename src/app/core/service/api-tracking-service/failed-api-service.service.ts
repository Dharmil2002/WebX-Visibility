import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FailedApiServiceService {
  private failedRequests: any[] = [];

 
  constructor() { }
  addFailedRequest(requestData: any) {
    this.failedRequests.push(requestData);
  }

  getFailedRequests() {
    return this.failedRequests;
  }
}
