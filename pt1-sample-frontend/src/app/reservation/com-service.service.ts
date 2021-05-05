import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComServiceService {

  serviceUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {
  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  }

  //envoyer l'adresse
  newReservation(adresseDepart : string) : Observable<string> {
    console.log("test");
    return this.http.get<string>(this.serviceUrl + "/reservation/" + adresseDepart);
  }
}
