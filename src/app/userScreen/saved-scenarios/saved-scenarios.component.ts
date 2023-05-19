import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Scenario } from 'src/app/scenario.model';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { UserStateService } from 'src/app/shared/auth.service';
import { Firestore } from '@angular/fire/firestore';



@Component({
  selector: 'app-saved-scenarios',
  templateUrl: './saved-scenarios.component.html',
  styleUrls: ['./saved-scenarios.component.css']
})
export class SavedScenariosComponent implements OnInit{

  userSavedScenarios: Scenario[] = [];  //here are stored the data from all the user's saved scenarios
  savedScenariosTitles: string[] = [];  //here are the titles of the user's saved scenarios for display
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

  //onClick for delete scenario button
  async delete(deleteScenario: number){
    const confirmation = confirm("Είστε σίγουρος/η ότι θέλετε να ΔΙΑΓΡΑΨΕΤΕ αυτό το Σενάριο; Δεν θα μπορείτε να αναιρέσετε αυτήν την ενέργεια!");//get confirmation for deleting the item

    if (confirmation) {
      const userID = this.user.currentUser?.uid;  //getting the user's id to create the deleteDocumentID
      const deleteDocumentID = userID + '_' + this.userSavedScenarios[deleteScenario].title;  //create deleteDocumentID
      await deleteDoc(doc(this.db,'savedScenarios',deleteDocumentID));  //delete document based on documentID
      //this ID is specificly saved that way when the scenario is saved and is unique

      //reload page
      const currentRoute = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentRoute]);
      });
    }
  }

  //onClick method for PDF button
  getPDF(scenarioNumber: number){
    this.userSavedScenarios[scenarioNumber].getScenarioPDF();     //find the scenario by number and save automatically
  }

  //onClick method for Open Scenario button
  openScenario(scenarioNumber: number){
    const scenarioSerialized = this.userSavedScenarios[scenarioNumber].serialize();   //serialize the saved scenario

    const params: NavigationExtras = {    //add it to the navigation query parameters
      queryParams: { scenario: scenarioSerialized}
    };

    this.router.navigate(['/newScenario'], params); //send it to newScenario page to open
  }

}
