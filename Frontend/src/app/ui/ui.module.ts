import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


// Components
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ErrorComponent } from './error/error.component';
import { AppMaterialModule } from "../app-material.module";

// Routing
import { UiRoute} from "./ui.routes";
import { RouterModule} from "@angular/router";

// Services
import { ThreeBox } from "../services/3box.service";
import { CarrouselComponent } from './carrousel/carrousel.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';

@NgModule({
  declarations: [
    AccountComponent,
    HomeComponent,
    TopNavComponent,
    ErrorComponent,
    CarrouselComponent,
    FooterComponent,
    BodyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UiRoute),
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    TopNavComponent,
    HomeComponent
  ],
  providers: [
    ThreeBox
  ],
})
export class UiModule { }
