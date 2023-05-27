import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Scenario } from 'src/app/scenario.model';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { AuthService, UserStateService } from 'src/app/shared/auth.service';
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

  shareScenarioInitButton: boolean[] = [];        //boolean array used for display of share buttons
  userToShare: string = '';                   //used to save the desired user email
  userToShareDoesNotExists: boolean = false;  //used to diplay error message in html
  sharedSuccesfully: boolean = false;         //used to display success message

  constructor(private router: Router, private user :UserStateService, private auth : AuthService) {}

  ngOnInit(): void {
    this.userToShare = '';                  //initializing userToShare
    this.userToShareDoesNotExists = false;  //initializing userToShareExists
    this.sharedSuccesfully =false;            //initializing sharedSuccesfully

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
              
              //add the share button to show
              this.shareScenarioInitButton.push(false);
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
    const confirmation = confirm("Είστε σίγουρος/η ότι θέλετε να ΔΙΑΓΡΑΨΕΤΕ αυτό το Σενάριο; Διαγράφοντας αυτό το Σενάριο διαγράφετε και οποιονδήποτε δοιαμοιρασμό αυτού έχετε πραγματοποιήσει! Δεν θα μπορείτε να αναιρέσετε αυτήν την ενέργεια!");//get confirmation for deleting the item

    if (confirmation) {
      const userID = this.user.currentUser?.uid;  //getting the user's id to create the deleteDocumentID
      const deleteDocumentID = userID + '_' + this.userSavedScenarios[deleteScenario].title;  //create deleteDocumentID
      await deleteDoc(doc(this.db,'savedScenarios',deleteDocumentID));  //delete document based on documentID
      //this ID is specificly saved that way when the scenario is saved and is unique

      //find shared versions of this scenario
      const qUserScenarios = query(collection(this.db, 'sharedScenarios'), where('shareScenarioID', '==', deleteDocumentID));
      getDocs(qUserScenarios)
          .then((querySnap) => {
            //delete documents that refer to the deleted scenario
            querySnap.forEach(async (documentToDelete) => {
              const shareToDelete = documentToDelete.id;
              await deleteDoc(doc(this.db,'sharedScenarios',shareToDelete));
            });

          });

      //reload page
      const currentRoute = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentRoute]);
      });
    }
  }

  //onClick for the initial share button
  openShareForm(scenarioNumber: number){
    //reveart the rest of the share buttons in their initial state
    for (let i = 0; i < this.shareScenarioInitButton.length; i++) {
      this.shareScenarioInitButton[i]=false;
    }
    //make the clicked button invisible and open the share form
    this.shareScenarioInitButton[scenarioNumber] = true;
    //reinitiallizing items
    this.userToShare = '';
    this.userToShareDoesNotExists = false;
    this.sharedSuccesfully =false 
  }

  //onClick for finalization of scenario sharing
  shareScenario(scenarioNumber: number){
    this.auth.checkEmailAvailability(this.userToShare).then(async isAvailable => {  //checking if an account with this email exists
      this.userToShareDoesNotExists = isAvailable;  //updating value to show warning if the user doesn't exist (because the email is still available)
      if(!isAvailable){ //if the email matches that of a user's email
        if(this.user.userLoggedIn){ //check again if someone's logged in
          const emailRegex = /\S+@\S+\.\S+/;  //set rule to recognize a valid email address
          if (!emailRegex.test(this.userToShare)){  //check if entered email address is valid
            alert ('Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email!');
            return;
          }
          if(this.userToShare === this.user.currentUser?.email){   //deter user from sharing scenario with himself
            alert ('Δυστυχώς δεν είναι δυνατό να διαμοιραστείτε σενάρια με τον εαυτό σας! Παρακαλώ ξαναπροσπαθήστε με την διεύθυνση email άλλου χρήστη.');
            return;
          }
          //share scenario
          //create the id with which the share link will be stored
          const shareLinkID = this.user.currentUser?.uid + '_' + this.userToShare + '_' + this.savedScenariosTitles[scenarioNumber];
          //creating the link that the user will use to get the shared scenario and IDs for the sender and the receiver (email is unique for each user) that will be saved to firestore
          const shareLink = {
            userSendID: this.user.currentUser?.uid,           //sender's ID
            userSendName: this.user.currentUser?.displayName, //sender's name for display
            userReceiveEmail: this.userToShare,               //receiver's ID
            sharedScenarioTitle: this.savedScenariosTitles[scenarioNumber], //scenario title for display
            shareScenarioID: this.user.currentUser?.uid + '_' + this.savedScenariosTitles[scenarioNumber]    //senario ID to load
          }
          //create and save document to firestore
          await setDoc(doc(this.db,'sharedScenarios',shareLinkID),shareLink);
          //display confirmation that the scenario was shared succesfully
          this.sharedSuccesfully = true;
        }
      }
    });
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
