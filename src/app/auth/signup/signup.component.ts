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
  confirmPassword : string = '';


  constructor (private auth : AuthService) { }

  ngOnInit(): void {

  }

  signup() {

    if(this.username == ''){
      alert('Παρακαλώ εισάγετε το όνομα χρήστη.');
      return;
    }

    if(this.email == ''){
      alert('Παρακαλώ εισάγετε email');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(this.email)) {
      alert('Μη έγκυρο email. Παρακαλώ προσπαθήστε ξανά!')
      this.email='';
      return;
    }

    if(this.password == '' || this.password.length<6){
      alert('Παρακαλώ εισάγετε έναν ασφαλή κωδικό με 6 ή παραπάνω χαρακτήρες.');
      this.password='';
      return;
    }

    if(this.password != this.confirmPassword){
      alert('Ο Κωδικός και η Επιβεβαίωση Κωδικού πρέπει να ταυτίζονται!');
      this.password = '';
      this.confirmPassword = '';
      return;
    }
    
    this.auth.signUp(this.username,this.email,this.password);

    this.username='';
    this.email='';
    this.password='';
    this.confirmPassword = '';
  }

}
