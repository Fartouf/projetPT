import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// forms

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { TaxiComponent } from './taxi/taxi.component';
import { ReservationComponent } from './reservation/reservation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { DisponibiliteComponent } from './disponibilite/disponibilite.component';
import { ComfirmationComponent } from './comfirmation/comfirmation.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent,
    TaxiComponent,
    ReservationComponent,
    DisponibiliteComponent,
    ComfirmationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
