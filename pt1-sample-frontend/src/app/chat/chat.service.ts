import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url = "http://localhost:3000/";

  socket;

  constructor() { 
    this.socket = io(this.url);
  }

  send(msg : string){
    this.socket.emit("new-message", msg);
  }

  get() : Observable<any>{
    return new Observable(observer => {
      this.socket.on("new-message",function(data){
        observer.next(data.message);
      });
    });
    
  }

}
