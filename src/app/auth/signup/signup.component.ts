import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  username : string = '';
  email : string = '';
  password : string = '';


  constructor (private auth : AuthService) { }

  ngOnInit(): void {

  }

  signup() {

    if(this.username == ''){
      alert('Please enter username');
      return;
    }

    if(this.email == ''){
      alert('Please enter email');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(this.email)) {
      alert('Invalid email. Please try again!')
      this.email='';
      return;
    }

    if(this.password == '' || this.password.length<6){
      alert('Please enter a password with 6 or more characters.');
      this.password='';
      return;
    }
    
    this.auth.signUp(this.username,this.email,this.password);

    this.username='';
    this.email='';
    this.password='';
  }

}
