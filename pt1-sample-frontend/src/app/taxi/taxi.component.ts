import { Component, OnInit } from '@angular/core';
import { TaxiServiceService } from './taxi-service.service';

@Component({
  selector: 'app-taxi',
  templateUrl: './taxi.component.html',
  styleUrls: ['./taxi.component.css']
})
export class TaxiComponent implements OnInit {

  constructor(private taxiService: TaxiServiceService) { }

  taxis  = this.taxiService.getTaxis();


  ngOnInit(): void {
  }

}
