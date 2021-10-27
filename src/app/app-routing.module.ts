import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceTableComponent } from './components/device-table/device-table.component';
import { LoginComponent } from './components/login/login.component';
import { MeasurementsTableComponent } from './components/measurements-table/measurements-table.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoutingConstants } from './utils/routes';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'users', component: UsersTableComponent, canActivate: [AuthGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuardService] },
  { path: RoutingConstants.DEVICES, component: DeviceTableComponent, canActivate: [AuthGuardService] },
  { path: 'measurements', component: MeasurementsTableComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
