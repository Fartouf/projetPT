import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {


  serviceUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {
  }

  confirmReservation(data : any) {
    return this.http.post<any[]>
    (this.serviceUrl + "/confirmReservation", data);
  }
}
