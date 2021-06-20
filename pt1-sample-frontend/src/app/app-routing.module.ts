import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { DisponibiliteComponent } from './disponibilite/disponibilite.component';

const routes: Routes = [{path: "reservation", component: ReservationComponent}, {path: "disponibilite", component: DisponibiliteComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }


