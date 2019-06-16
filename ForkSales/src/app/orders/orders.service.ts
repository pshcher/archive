import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersUrl = 'api/orders';  // URL to web api

  constructor(private http: HttpClient) { }

  getOrders() : Observable<any[]> {
   return this.http.get<any[]>(this.ordersUrl );
   }
}
