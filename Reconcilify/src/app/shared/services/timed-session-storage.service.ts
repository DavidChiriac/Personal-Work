import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class TimedSessionStorageService {

  constructor(private readonly sessionStorage: SessionStorageService) {}

  setItem(key: string, value: any, ttl: number = 60): void { //ttl is number of minutes
    const expiresAt = new Date().getTime() + ttl * 60 * 1000;
    const item = {
      value,
      expiresAt
    };
    this.sessionStorage.store(key, item);
  }

  getItem(key: string): any {
    const item = this.sessionStorage.retrieve(key);

    if (!item) {
      return null;
    }

    const { value, expiresAt } = item;

    if (new Date().getTime() > expiresAt) {
      this.sessionStorage.clear(key); 
      return null;
    }

    return value;
  }

  removeItem(key: string): void {
    this.sessionStorage.clear(key);
  }
}
