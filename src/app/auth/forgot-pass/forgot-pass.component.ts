import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent {

  email : string = '';
  sent : boolean = false;

  constructor (private auth : AuthService, private router : Router) { }

  ngOnInit(): void {
    this.email = '';
    this.sent = false;
  }

  async forgotPass(){
    this.auth.checkEmailAvailability(this.email).then(async isAvailable => {  //checking if an account with this email exists

      const emailFound = !isAvailable;

      if(isAvailable){
        alert("Δεν υπάρχει λογαριασμός με αυτό το email. Παρακαλώ δώστε έγκυρο email!");
        return;
      }
      
      //if a user with this email exists
      if(emailFound){
        const awaitSent = await this.auth.forgotPass(this.email);   //send the mail
        this.sent = awaitSent;  //get the confirmation to show the confirmation text
        this.email = '';        //empty the input field
        if(this.sent){  //if everything succeeded
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);       //wait for 3 seconds and the redirect to login page
        }
      }
    });
  }

}
