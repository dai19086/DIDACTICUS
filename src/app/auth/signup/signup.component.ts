import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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


  constructor (private auth : AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

  }

  //onClick for opening Log In page
  redirectToLogIn(){
    const params = this.route.snapshot.queryParamMap;

    if (params.has('scenario')){
      const newParams: NavigationExtras = {    //add it to the new navigation query parameters
        queryParams: {scenario: params.get('scenario') as string}
      }
      this.router.navigate(['/login'], newParams); //redirect with params
    }else{
      this.router.navigate(['/login']); //redirect without params
    }
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

    this.auth.checkEmailAvailability(this.email).then(isAvailable => {
      if(!isAvailable){
        alert('Αυτή η διεύθυνση email χρησιμοποιείται ήδη! Δοκιμάστε να εισάγετε μια νέα ή αν έχετε λογαριασμό δοκιμάστε να ΣΥΝΔΕΘΕΙΤΕ.');
        this.email = '';
        return;
      }
    })
    
    //loading navigation parameters if any
    const params = this.route.snapshot.queryParamMap;
    let ScenarioParams;
    if (params.has('scenario')){
      ScenarioParams = params.get('scenario') as string;
    }else{
      ScenarioParams = '';
    }

    this.auth.signUp(this.username,this.email,this.password,ScenarioParams);

    this.username='';
    this.email='';
    this.password='';
    this.confirmPassword = '';
  }

}
