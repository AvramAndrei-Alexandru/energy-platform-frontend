import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DeviceTableComponent } from './components/device-table/device-table.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MeasurementsTableComponent } from './components/measurements-table/measurements-table.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponentComponent } from './components/dialog-component/dialog-component.component';
import { RPCPageComponent } from './components/rpcpage/rpcpage.component';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    UsersTableComponent,
    DeviceTableComponent,
    LoginComponent,
    HeaderComponent,
    RegisterComponent,
    MeasurementsTableComponent,
    DialogComponentComponent,
    RPCPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    MatIconModule,
    ButtonsModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    LabelModule,
    DateInputsModule,
    LayoutModule,
    LabelModule,
    DropDownsModule,
    MatDialogModule,
    ChartsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
