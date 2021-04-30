import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxiServiceService {

  serviceUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {
  }

  getTaxis() {
    return this.http.get<any[]>
    (this.serviceUrl + "/allTaxis");
  }

}
