import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComServiceService {

  serviceUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {
  }

  //envoyer l'adresse
  getAdresseDepart(data : any) {
    console.log(data);
    return this.http.post<any[]>
    (this.serviceUrl + "/getData", data);
  }
}
