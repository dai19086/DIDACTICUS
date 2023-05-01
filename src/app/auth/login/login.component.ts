import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : string = '';
  password : string = '';

  constructor (private auth : AuthService) { }

  ngOnInit(): void {

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

    this.auth.logIn(this.email,this.password);
    
    this.email='';
    this.password='';
  }
}
