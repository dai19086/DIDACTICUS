import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Scenario } from 'src/app/scenario.model';
import { UserStateService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shared-scenarios',
  templateUrl: './shared-scenarios.component.html',
  styleUrls: ['./shared-scenarios.component.css']
})
export class SharedScenariosComponent {

  sharedScenarios: string[] = [];        //here are stored the data from all the user's shared scenarios
  sharedScenariosTitles: string[] = [];  //here are the titles of the user's shared scenarios
  sharedFromUserID: string[] = [];       //here are stored the IDs of the users that shared each scenario with the current user
  shareFromUserName: string[] = [];      //here are stored the names of the users that shared each scenario with the current user
  loading: boolean = true;    //used to control the display of the loading indicator
  db!: Firestore;       //this is the instance of the Firestore database initialized in the ngOnInit method


  constructor(private router: Router, private user :UserStateService) {}

  ngOnInit(): void {
    this.loading = true;//making sure loading indicator is on while loading
    const app = initializeApp(environment.firebase);  //initializing app
    this.db = getFirestore(app);                     //getting Firestore Database instance

    const intervalId = setInterval(() => {  //making sure that a user is still logged in
      //necessary in case someone somehow accesses the page without logging in
      if (this.user.userLoggedIn) {
        clearInterval(intervalId); // stop checking the user login status

        const userEmail = this.user.currentUser?.email;  //getting the user's email to use as an ID for searching the database (since every users email address is unique from sign up)
        const qUserScenarios = query(collection(this.db, 'sharedScenarios'), where('userReceiveEmail', '==', userEmail)); //preparing query for database
        //fetching data
        getDocs(qUserScenarios)
        .then((querySnap) => {
          //preparing data
          querySnap.forEach((documentShared) => {                        //for each document retrieved
            const sharedData = documentShared.data();                        //get document's data
            const sharedScenarioID = sharedData['shareScenarioID'];          //get the shared scenario's ID
            this.sharedScenarios.push(sharedScenarioID);     //store scenarioID locally for calling reference when needed
            this.sharedScenariosTitles.push(sharedData['sharedScenarioTitle']);   //add scenario title in an array
            this.sharedFromUserID.push(sharedData['userSendID']);         //add the sharer's ID to an array (to use for locating shared documents)
            this.shareFromUserName.push(sharedData['userSendName']);      //add the sharer's name to an array (for title display)
            console.log(sharedData['sharedScenarioTitle'] + ' (by user "' + sharedData['userSendName'] + '")');
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

  //onClick for deleteShare button
  async deleteShared(shareNumber: number){
    const confirmation = confirm("Είστε σίγουρος ότι θέλετε να διαγράψετε αυτόν τον διαμοιρασμό? Μετά την διαγραφή ΔΕΝ ΘΑ ΜΠΟΡΕΙΤΕ ΝΑ ΑΠΟΘΗΚΕΥΣΕΤΕ το Σενάριο " + this.sharedScenariosTitles[shareNumber] + ".");

    if (confirmation) {
      const deleteSharedDocumentID = this.sharedFromUserID[shareNumber] + '_' + this.user.currentUser?.email + '_' + this.sharedScenariosTitles[shareNumber];
      await deleteDoc(doc(this.db,'sharedScenarios',deleteSharedDocumentID));  //delete document based on documentID
      //this ID is specificly saved that way when the share is saved and is unique

      //reload page
      const currentRoute = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentRoute]);
      });
    }
  }

  //onClick for openScenario button
  async openScenario(shareNumber: number){
    const docSnap = await getDoc(doc(this.db, "savedScenarios", this.sharedScenarios[shareNumber]));  	//get scenario document

    if (docSnap.exists()) {
      const sData = docSnap.data();                         //get document with the Scenario's data
      const loadedScenario = new Scenario(sData['title'],sData['duration'],sData['eduProg'],
              sData['BloomTaxonomy'],sData['knowledgeGoalsCheck'],sData['knowledgeGoals'],
              sData['skillGoalsCheck'],sData['skillGoals'],sData['behaviourGoalsCheck'],
              sData['behaviourGoals'],sData['description'],sData['sciApproach'],
              sData['connections'],sData['multiApproach'],sData['toolJusti'],
              sData['sources'],sData['method'],sData['microChanges'],sData['activityEllaboration'],
              sData['classOrg'],sData['consensus'],sData['difficulties'],
              sData['noise'],sData['evaluation'],sData['reflection']);      //create the Scenario

      const scenarioSerialized = loadedScenario.serialize();   //serialize the saved scenario
      const params: NavigationExtras = {    //add it to the navigation query parameters
        queryParams: { scenario: scenarioSerialized}
      };
      this.router.navigate(['/newScenario'], params); //send it to newScenario page to open

    }else{
      alert("ΣΦΑΛΜΑ! Το Σενάριο δεν βρέθηκε!")
    }
    
  }

}
