import { Routes } from '@angular/router';

// Components
import {AccountComponent} from "./account/account.component";
import {ErrorComponent} from "./error/error.component";
import {HomeComponent} from "./home/home.component";
import { CarrouselComponent } from './carrousel/carrousel.component';

export const UiRoute: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'account', component: AccountComponent},
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: '/404' },
];
