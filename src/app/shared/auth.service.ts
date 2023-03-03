import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Injectable({  providedIn: 'root'})
//This service checks if a user is logged in or is just using the application anonymously
export class UserStateService {
  currentUser: User | null = null;
  userLoggedIn: boolean = false;

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      if (user) {
        //gets the user's id, username and email if a user is logged in
        this.currentUser = {
          uid: user.uid,
          displayName: user.displayName!,
          email: user.email!
        };
        this.userLoggedIn = true;
      } else {
        //empties the user if there isn't a user logged in or the user has signed out
        this.currentUser = null;
        this.userLoggedIn = false;
      }
    });
  }
}

@Injectable({  providedIn: 'root'})
//This servise provides methods for user sign in, sign out and sign up
export class AuthService {

  constructor(private fireauth : AngularFireAuth, private router : Router) { }

  //login method
  logIn(email : string, password : string){
    this.fireauth.signInWithEmailAndPassword(email,password).then( () =>{           //logs in with email and password
      this.router.navigate(['/userHome']);                                          //redirects to UserScreen page
    }, err => {
      alert('Something went wrong! UNSUCCESSFULL LOGIN');
      this.router.navigate(['/login']);                               //if an error occurs alert and return to Log In screen
    })
  }

  //sign up method
  async signUp(username : string, email : string, password : string){
    try {
      const { user } = await this.fireauth.createUserWithEmailAndPassword(email, password);   //creates a user with the given email and password
      await user?.updateProfile({ displayName: username });                                   //add the user's username
      await this.router.navigate(['/login']);                                                 //once it's done redirect to Log In screen
      return true;
    } catch (error) {
      console.error('Error occurred during sign up:', error);             //catching errors that might occur
      return false;
    }
  }

  //sign out method
  logOut(){
    this.fireauth.signOut().then( () => {
      this.router.navigate(['/'])            //redirects to non-(Logged in) home page if sign out was successfull
    }, err =>{
      alert(err.message);
    })
  }
  
}
