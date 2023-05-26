import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, Firestore, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Scenario } from 'src/app/scenario.model';
import { UserStateService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shared-scenarios',
  templateUrl: './shared-scenarios.component.html',
  styleUrls: ['./shared-scenarios.component.css']
})
export class SharedScenariosComponent {

  userSharedScenarios: Scenario[] = [];  //here are stored the data from all the user's shared scenarios
  sharedScenariosTitles: string[] = [];  //here are the titles of the user's shared scenarios for display
  loading: boolean = true;    //used to control the display of the loading indicator
  db!: Firestore;       //this is the instance of the Firestore database initialized in the ngOnInit method


  constructor(private user :UserStateService) {}

  ngOnInit(): void {
    this.loading = true;//making sure loading indicator is on while loading
    const app = initializeApp(environment.firebase);  //initializing app
    this.db = getFirestore(app);                     //getting Firestore Database instance

    const intervalId = setInterval(() => {  //making sure that a user is still logged in
      //necessary in case someone somehow accesses the page without logging in
      if (this.user.userLoggedIn) {
        clearInterval(intervalId); // stop checking the user login status

        const userID = this.user.currentUser?.uid;  //getting the user's id to use it for searching the database
        const qUserScenarios = query(collection(this.db, 'savedScenarios'), where('uid', '==', userID)); //preparing query for database
        //fetching data
        getDocs(qUserScenarios)
        .then((querySnap) => {
          //preparing data
          querySnap.forEach((doc) => {                    //for each document retrieved
            const sData = doc.data();                         //get document with the Scenario's data
            const loadedScenario = new Scenario(sData['title'],sData['duration'],sData['eduProg'],
                    sData['BloomTaxonomy'],sData['knowledgeGoalsCheck'],sData['knowledgeGoals'],
                    sData['skillGoalsCheck'],sData['skillGoals'],sData['behaviourGoalsCheck'],
                    sData['behaviourGoals'],sData['description'],sData['sciApproach'],
                    sData['connections'],sData['multiApproach'],sData['toolJusti'],
                    sData['sources'],sData['method'],sData['microChanges'],sData['activityEllaboration'],
                    sData['classOrg'],sData['consensus'],sData['difficulties'],
                    sData['noise'],sData['evaluation'],sData['reflection']);      //create the Scenario
            this.userSharedScenarios.push(loadedScenario);     //store Scenario locally before moving up to the next one
            this.sharedScenariosTitles.push(sData['title']);   //add scenario title in an array to display
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

}
