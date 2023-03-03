import { Component } from '@angular/core';
import { UserStateService } from 'src/app/shared/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  animations: [                               //sets animation for the Welcome banner.
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate(2000)
      ])
    ])
  ]
})
export class UserHomeComponent {

  username : string = "";
  usernameExists: boolean = false;

  constructor (private user : UserStateService) { }

  ngOnInit(): void {
    setTimeout(() =>{                                         //waits 1 second so the UserStateService gets to initialize the currentUser
      if (this.user.userLoggedIn){
        this.username = this.user.currentUser?.displayName!;  //gets the username
        this.usernameExists = true;                           //make the flag for the banner to show up true
      }else{
        alert('No user');  //error message, unexpected behaviour (THIS SHOULD NOT SHOW UP)
        this.username = "";
        this.usernameExists = false;
      }
    }, 1000);
  }

}
