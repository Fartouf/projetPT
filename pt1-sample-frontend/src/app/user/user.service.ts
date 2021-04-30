import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  serviceUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {
  }

  //unse r--> see interface
  getUsers() {
    return this.http.get<User[]>
    (this.serviceUrl + "/allPeople");
  }

}
