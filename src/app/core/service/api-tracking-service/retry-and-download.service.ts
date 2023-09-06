import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FailedApiServiceService } from './failed-api-service.service';
import { format, isValid, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class RetryAndDownloadService {

  constructor(private http: HttpClient,
    private failedApiService: FailedApiServiceService) { }
  async retryWithDownload(
    masterService: any,
    url: string,
    req: any,
    maxRetries: number,
    sourceModule: string,
    location: any
  ): Promise<any> {
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        const res = await masterService.masterMongoPost(url, req).toPromise();
        return res; // Success
      } catch (error) {
        retryCount++;

        if (retryCount >= maxRetries) {
          // const userConfirmed = window.confirm(
          //   `You have had ${maxRetries} failed attempts. Do you want to download the failed requests?`
          // );
          this.failedApiService.addFailedRequest({
            id: this.failedApiService.getFailedRequests().length,
            url: url,
            method: 'POST',
            request: req,
            error: error, // Include error information
            source: sourceModule,
            createdOn: new Date().toUTCString(),
            createdBy: localStorage.getItem("Username"),
            createdAt: location,
            attempts: 0
          });

          // if (userConfirmed) {

          //   await this.downloadFailedRequests();
          // }
        }
      }
    }

    throw new Error('Maximum retries reached');
  }

  async downloadFailedRequests() {
    const companyCode = localStorage.getItem("companyCode");
    let formattedDate = "";

    try {
      const parsedDate = parseISO(new Date().toISOString());
      if (isValid(parsedDate)) {
        formattedDate = format(parsedDate, "dd-MM-yy HHmm"); // Remove spaces and colons
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }

    const failedRequests = this.failedApiService.getFailedRequests();

    // Trigger a download of the request body data (e.g., as a JSON file)
    if (failedRequests) {
      const blob = new Blob([JSON.stringify(failedRequests)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webxpress-velocity-${companyCode}-${formattedDate}-failedrequests.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }


}
