import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DispService {

  serviceUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  getDispo(data : any){
    return this.http.post<any[]>
    (this.serviceUrl + "/getDispo", data)
  }
}
