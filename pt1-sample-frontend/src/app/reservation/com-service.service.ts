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
  getAdresseDepart() {
    console.log("test");
    return this.http.get<any[]>
    (this.serviceUrl + "/getAdresseDepart?depart=70, chemin de la louye");
  }
}
