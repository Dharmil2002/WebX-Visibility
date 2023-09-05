import { Injectable } from '@angular/core';
import { ApiTracking } from '../../models/apitracking/api-tracking';
import { IndexedDBService } from './indexed-db.service';


@Injectable({
  providedIn: 'root'
})
export class ApiTrackingService {
  constructor(private indexedDBService: IndexedDBService) {}

  addToOutbox(request: ApiTracking): void {
    // Create an OutboxItem with 'pending' status and store it in IndexedDB
    const newItem: ApiTracking = request;
    this.indexedDBService.addToOutbox(newItem);
  }

  async getOutboxItems(): Promise<ApiTracking[]> {
    // Retrieve all items from IndexedDB
    return await this.indexedDBService.getOutboxItems();
  }

  async sendRequestsToServer(): Promise<void> {
    const outboxItems = await this.getOutboxItems();

    for (const item of outboxItems) {
      // Send item.request to the server and handle the response
      // Update the item's status based on the response (success or failure)
      // For example:
      // If the request is successful, set item.status = 'success'
      // If the request fails, set item.status = 'failed'

      // After processing, update the item in IndexedDB to reflect its new status
    //  await this.indexedDBService.updateOutboxItemStatus(item);
    }
  }

}
