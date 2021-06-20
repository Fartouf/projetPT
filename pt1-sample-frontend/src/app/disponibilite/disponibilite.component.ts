import { Component, OnInit } from '@angular/core';
import { DispService } from './disp.service';

@Component({
  selector: 'app-disponibilite',
  templateUrl: './disponibilite.component.html',
  styleUrls: ['./disponibilite.component.css']
})
export class DisponibiliteComponent implements OnInit {

  constructor(private dispService : DispService) { }

  ngOnInit(): void {
  }

   disponibilite : any = [];

  getDisp(val: object){

    this.disponibilite = [];
    this.dispService.getDispo(val).subscribe(res => this.disponibilite.push(res));
    console.log(this.disponibilite);
  }

}
