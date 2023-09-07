import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : string = '';
  password : string = '';

  constructor (private auth : AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

  }

  //onClick for opening Sign Up page
  redirectToSignUp(){
    const params = this.route.snapshot.queryParamMap;

    if (params.has('scenario')){
      const newParams: NavigationExtras = {    //add it to the new navigation query parameters
        queryParams: {scenario: params.get('scenario') as string}
      }
      this.router.navigate(['/signup'], newParams); //redirect with params
    }else{
      this.router.navigate(['/signup']); //redirect without params
    }
  }

  login() {

    if(this.email == ''){
      alert('Παρακαλώ εισάγετε το Email σας.');
      return;
    }

    if(this.password == ''){
      alert('Παρακαλώ εισάγετε τον κωδικό πρόσβασής σας.');
      return;
    }


    //loading navigation parameters if any
    const params = this.route.snapshot.queryParamMap;
    let logInParams;
    if (params.has('scenario')){
      logInParams = params.get('scenario') as string;
    }else{
      logInParams = '';
    }

    this.auth.logIn(this.email,this.password,logInParams);
    
    this.email='';
    this.password='';
  }
}
