import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationExtras, Router } from '@angular/router';
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
  logIn(email : string, password : string, logInParams : string){
    this.fireauth.signInWithEmailAndPassword(email,password).then( () =>{           //logs in with email and password
      if (logInParams==''){
        this.router.navigate(['/userHome']);      //redirects to UserScreen page
      }else{
        const params: NavigationExtras = {    //add it to the navigation query parameters
          queryParams: {scenario: logInParams}
        }
        this.router.navigate(['/newScenario'],params);      //redirects to New Scenario page retaining the scenario the  user had started
      }
      
      
    }, err => {
      alert('Κάτι πήγε στραβά! ΜΗ ΕΠΙΤΥΧΗΣ ΣΥΝΔΕΣΗ!');  //if an error occurs alert and return to Log In screen
      if (logInParams==''){
        this.router.navigate(['/login']);      //just reloads page
      }else{
        const params: NavigationExtras = {    //add it to the navigation query parameters
          queryParams: {scenario: logInParams}
        }
        this.router.navigate(['/login'],params);      //reload page retaining the navigation parameters
      }
    })
  }

  //sign up method
  async signUp(username : string, email : string, password : string, ScenarioParams : string){
    try {
      const { user } = await this.fireauth.createUserWithEmailAndPassword(email, password);   //creates a user with the given email and password
      await user?.updateProfile({ displayName: username });                                   //add the user's username
      if (ScenarioParams==''){
        //once Signed Up
        await this.router.navigate(['/userHome']);         //simply redirects to user Home page
      }else{
        const params: NavigationExtras = {    //add it to the navigation query parameters
          queryParams: {scenario: ScenarioParams}
        }
        //once Signed Up
        await this.router.navigate(['/newScenario'],params);  //redirects to new Scenario page  rataining the scenario the  user had started
      }
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

  //forgot password method
  async forgotPass(email: string) : Promise<boolean> {
    return this.fireauth.sendPasswordResetEmail(email).then(() => {
      return true;
    }, err => {
      alert('Κάτι πήγε στραβά! Το Email ΔΕΝ ΣΤΑΛΘΗΚΕ!');
      return false;
    });
  }

  //check email availability method to check if a user exists with a certain email
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const result = await this.fireauth.fetchSignInMethodsForEmail(email);
      return result.length === 0; // Email is available if no sign-in methods are associated with it
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false; // Return false if there's an error
    }
  }
  
}
