import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
 
  encrypt(data: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, environment.secretKey || 'WebXpress').toString();
    return encryptedData;
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, environment.secretKey || 'WebXpress');
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}

export function encrypt(data: string): string {
  const encryptedData = CryptoJS.AES.encrypt(data, environment.secretKey || 'WebXpress').toString();
  return encryptedData;
}

export function decrypt(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, environment.secretKey || 'WebXpress');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}