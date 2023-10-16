import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'WebXpress'; // Replace with your secret key

  encrypt(data: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}