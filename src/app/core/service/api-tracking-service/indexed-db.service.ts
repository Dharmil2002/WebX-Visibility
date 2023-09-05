import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'OutboxDB';
  private storeName = 'outboxStore';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initializeDB();
  }

  private initializeDB() {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };

    request.onsuccess = (event) => {
      this.db = request.result;
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  }

  addToOutbox(item: any): void {
    const transaction = this.db?.transaction(this.storeName, 'readwrite');
    const store = transaction?.objectStore(this.storeName);
    store?.add({ request: item });
  }

  getOutboxItems(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(this.storeName, 'readonly');
  
      if (!transaction) {
        reject(new Error('Transaction is null or undefined.'));
        return;
      }
  
      const store = transaction.objectStore(this.storeName);
      const request: IDBRequest<any[]> = store.getAll();
  
      request.onsuccess = (event: Event) => {
        const result: any[] = (event.target as IDBRequest<any[]>).result;
        resolve(result);
      };
  
      request.onerror = (event) => {
        console.error('Error getting outbox items:', event);
        reject(event);
      };
    });
  }
  
  
}
