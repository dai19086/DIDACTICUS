import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NewScenarioComponent } from './userScreen/new-scenario/new-scenario.component';
import { SavedScenariosComponent } from './userScreen/saved-scenarios/saved-scenarios.component';
import { UserHomeComponent } from './userScreen/user-home/user-home.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'forgotPass', component: ForgotPassComponent},
  {path:'newScenario', component: NewScenarioComponent},
  {path:'savedScenarios', component: SavedScenariosComponent},
  {path:'userHome', component: UserHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
