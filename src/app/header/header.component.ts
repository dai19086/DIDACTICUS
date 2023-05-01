import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserStateService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor (private auth : AuthService, private user :UserStateService, private router : Router) { }

  userExists : boolean = this.user.userLoggedIn;

  ngOnInit(): void {
      setInterval(() => {
        this.userExists = this.user.userLoggedIn;
      },100)            //refreshes the userExists value 10 times per second
  }

  userScreenButton(){           //determines if the home button will redirect the user to the logged in or non logged in version of the homepage
    if(this.userExists){
      this.router.navigate(['/userHome'])
    } else{
      this.router.navigate(['/']);
    }
  }

  logOut(){                   //logs out the user if he is logged in and redirects him to the non-(Logged in) page
    if(!(this.user.currentUser == null)){
      const confirmation = confirm("Είστε σίγουρος/η ότι θέλετε να ΑΠΟΣΥΝΔΕΘΕΙΤΕ;");////get confirmation for user log out
      if (confirmation) {
        this.auth.logOut();
        alert('Καλή συνέχια ' + this.user.currentUser.displayName + '!');
      }
    }else{
      alert('ΣΦΑΛΜΑ.Δεν υπάρχει συνδεδεμένος χρήστης!')
    }
  }


}
