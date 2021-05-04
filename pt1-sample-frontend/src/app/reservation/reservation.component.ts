import { Component, OnInit } from '@angular/core';
import { ComServiceService } from './com-service.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  constructor(private comService : ComServiceService) { }

  ngOnInit(): void {
    
  }

  //Question
  startAdress : string | undefined;
  
  //question reset form
  getValues(val: string){
    this.startAdress = val;
    this.comService.getAdresseDepart();
    console.log(this.startAdress);
  }

}
