import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from './confirmation.service';

@Component({
  selector: 'app-comfirmation',
  templateUrl: './comfirmation.component.html',
  styleUrls: ['./comfirmation.component.css']
})
export class ComfirmationComponent implements OnInit {

  constructor(private ConfirmationService : ConfirmationService) { }

  ngOnInit(): void {
  }

  reponse : any = [];

  confirmation(data: object){
    this.reponse = [];
    this.ConfirmationService.confirmReservation(data).subscribe(res => this.reponse.push(res));
    console.log(this.reponse);
  }

}
