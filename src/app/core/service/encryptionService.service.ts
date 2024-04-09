import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const secretKey = 'WebXpress';
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = secretKey; // Replace with your secret key

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

export function encrypt(data: string): string {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedData;
}

export function decrypt(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}