import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Scenario } from 'src/app/scenario.model';
import { MyNavigationExtras } from 'src/app/myNavigationExtras.interface';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { UserStateService } from 'src/app/shared/auth.service';



@Component({
  selector: 'app-saved-scenarios',
  templateUrl: './saved-scenarios.component.html',
  styleUrls: ['./saved-scenarios.component.css']
})
export class SavedScenariosComponent implements OnInit{

  userSavedScenarios: Scenario[] = [];
  savedScenariosTitles: string[] = [];
  loading: boolean = true;
  


  constructor(private router: Router, private user :UserStateService) {}

  ngOnInit(): void {
    this.loading = true;//making sure loading indicator is on while loading
    const app = initializeApp(environment.firebase);  //initializing app
    const db = getFirestore(app);                     //getting Firestore Database instance
    
    const intervalId = setInterval(() => {  //making sure that a user is still logged in
                                            //necessary in case someone somehow accesses the page without logging in
      if (this.user.userLoggedIn) {
        clearInterval(intervalId); // stop checking the user login status

        const userID = this.user.currentUser?.uid;  //getting the user's id to use it for searching the database
        const qUserScenarios = query(collection(db, 'savedScenarios'), where('uid', '==', userID)); //preparing query for database
        //fetching data
        getDocs(qUserScenarios)
          .then((querySnap) => {
             //preparing data
            querySnap.forEach((doc) => {                    //for each document retrieved
              const sData = doc.data();                         //get document with the Scenario's data
              const loadedScenario = new Scenario();            //create the Scenario
              this.userSavedScenarios.push(loadedScenario);     //store Scenario locally before moving up to the next one
              this.savedScenariosTitles.push(sData['title']);   //add scenario title in an array to display
              console.log(doc.id, ' => ', sData['title']);
            });
            //switching off loading indicator and showing data
            this.loading = false;

          })
          .catch((error) => {
            //signalling error
            console.log(error);
          });
      }

    }, 100); // check the user login status 10 times per second
  }

  //onClick method for Open Scenario button
  openScenario(scenarioNumber: number){
    //const requestedData = this.data[scenarioNumber];//gets number of reffered data
    //const scenarioToOpen = new Scenario();//creates empty scenario
    //const navigationData: MyNavigationExtras = { scenario: scenarioToOpen};
    
    //this.router.navigate(['/newScenario'],navigationData);
  }

}
