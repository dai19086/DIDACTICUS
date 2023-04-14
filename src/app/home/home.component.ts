import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService } from '../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor (private user :UserStateService, private router : Router) { }

  userExists : boolean = this.user.userLoggedIn;

  ngOnInit(): void {
      setInterval(() => {
        this.userExists = this.user.userLoggedIn;
      },100)            //refreshes the userExists value 10 times per second
  }

  //onClick for Log In button
  LogInButton(){           //determines if the Log In button will redirect the user to the log in page
                          // or the user Home page in case a user is already logged in and somehow landed in the non logged in user page
                          // (usually throw a cached logged in user)
    if(this.userExists){
      this.router.navigate(['/userHome'])
    } else{
      this.router.navigate(['login']);
    }
  }
}
