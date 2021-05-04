import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

  //Question
  startAdress : string | undefined;
  
  //question reset form
  getValues(val: string){
    this.startAdress = val;
    console.log(this.startAdress);
  }

}
