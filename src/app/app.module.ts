import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { NewScenarioComponent } from './userScreen/new-scenario/new-scenario.component';
import { SavedScenariosComponent } from './userScreen/saved-scenarios/saved-scenarios.component';
import { UserHomeComponent } from './userScreen/user-home/user-home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { FirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { SharedScenariosComponent } from './userScreen/shared-scenarios/shared-scenarios.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NewScenarioComponent,
    SavedScenariosComponent,
    UserHomeComponent,
    ForgotPassComponent,
    SharedScenariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    FirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
