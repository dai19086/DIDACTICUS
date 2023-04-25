//import * as stream from 'stream';
//import * as zlib from 'zlib';

import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { initializeApp } from '@angular/fire/app';
import { doc, getFirestore, setDoc, Timestamp } from '@angular/fire/firestore';
//import * as PDFDocument from 'pdfkit';
//import { Writable } from 'stream';
//import { saveAs } from 'file-saver';

import { Scenario } from 'src/app/scenario.model';
import { UserStateService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-scenario',
  templateUrl: './new-scenario.component.html',
  styleUrls: ['./new-scenario.component.css']
})
export class NewScenarioComponent {

  options = [                                    //the options given to the user on the school grade field of the form
    { value: "Γ'Λυκείου", label: "Γ'Λυκείου" },
    { value: "Β'Λυκείου", label: "Β'Λυκείου" },
    { value: "Α'Λυκείου", label: "Α'Λυκείου" },

    { value: "Γ'Γυμνασίου", label: "Γ'Γυμνασίου" },
    { value: "Β'Γυμνασίου", label: "Β'Γυμνασίου" },
    { value: "Α'Γυμνασίου", label: "Α'Γυμνασίου" },

    { value: "ΣΤ'Δημοτικού", label: "ΣΤ'Δημοτικού" },
    { value: "Ε'Δημοτικού", label: "Ε'Δημοτικού" },
    { value: "Δ'Δημοτικού", label: "Δ'Δημοτικού" },
    { value: "Γ'Δημοτικού", label: "Γ'Δημοτικού" },
    { value: "Β'Δημοτικού", label: "Β'Δημοτικού" },
    { value: "Α'Δημοτικού", label: "Α'Δημοτικού" }
  ];

  bloom = [                               //the options given to the user for the bloom taxonomy of the goals
    { value: "Απομνημόνευση", label: "Απομνημόνευση" },
    { value: "Κατανόηση", label: "Κατανόηση" },
    { value: "Εφαρμογή", label: "Εφαρμογή" },
    { value: "Ανάλυση", label: "Ανάλυση" },
    { value: "Αξιολόγηση", label: "Αξιολόγηση" },
    { value: "Σύνθεση", label: "Σύνθεση" }
  ]

  goalsTip : string = "Αποφύγετε μη ενεργητικά και αφηρημένα ρήματα. ";
  eduProg : string = '';    //link to educational program

  


  userExists : boolean = this.user.userLoggedIn;  //for saveButton function
  id : string | undefined = "0";    //the user's id
  lastSavedTime : string = '';   //initial timestamp before saving
  page : number = 0;        //used for dectating the page of the form that is currently displayed
  scenario: Scenario = new Scenario();

  

  //used for button styling for logged in or guest users
  buttonOpacity: number = 1;
  buttonVisibility: string = 'hidden';

  constructor (private user :UserStateService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.page = 1;

    const params = this.route.snapshot.queryParamMap;
  if (params.has('scenario')) {
      const scenarioSerialized = params.get('scenario') as string;
      this.scenario = Scenario.deserialize(scenarioSerialized);
      console.log('The page was called without query parameters');
    } else {
      this.scenario = new Scenario();
    }

    this.onSelect();
    this.onBloomChange();


    setInterval(() => {
        this.userExists = this.user.userLoggedIn;
      },100)            //refreshes the userExists value 10 times per second
  }

  //onClicks for the Next & Previous Buttons
  onClickPrevious(){this.page = this.page -1;}
  onClickNext(){this.page = this.page +1;}


  //TODO:
    //-Add file content
    
  //onClick for ExportPDF button
  downloadAsPDF() {
    this.scenario.getScenarioPDF();
  }

  //onClick for the Save Button
  async saveButton(){
    const app = initializeApp(environment.firebase);
    const db = getFirestore(app);
    
    if(this.userExists){
      //save senario
      if(this.scenario.title === ''){           //setting RULES(cases) that will NOT submitting the scenario
        alert("YOU CANNOT SAVE A SCENARIO WITHOUT TITLE!")
      }else{                                    //IF rules are met
        this.id=this.user.currentUser?.uid;           //get user ID
        const scenarioID = this.id + '_' + this.scenario.title;   //create the scenario id that will be stored
        await setDoc(doc(db, "savedScenarios", scenarioID), this.scenario.getFirestoreEntry(this.id));  //save the scenario


        //reload with new url to ensure that the changes are saved in the page in case the user reloads
        const scenarioSerialized = this.scenario.serialize();
        const params: NavigationExtras = {    //add the saved serialized scenario to the navigation extras
          queryParams: { scenario: scenarioSerialized}
        };
        this.router.navigate(['/newScenario'], params); //reload the page with the scenario saved in the url for safe reload

        //show banner with confirmation of saving
        const cDate = new Date();
        this.lastSavedTime = cDate.getDate().toString() + '/' + (cDate.getMonth()+1).toString() + ' ' +
                            cDate.getHours().toString() + ':' + cDate.getMinutes().toString() + ':' + cDate.getSeconds().toString();
      }
      
    } else{
      //notify that you have to be logged in to use this feature
      alert("Only users can access the Save Scenario feature. Please log in and try again!");
      this.buttonOpacity = 0.5;         //fade save button
      this.buttonVisibility = 'visible';  //show log in button
    }
  }



  //used onChange detection to subsequently change the URL that is displayed to the user once a school grade is chosen
  onSelect() {

    const eduProgLG : string = 'https://nickpapag.sites.sch.gr/2022/09/23/odhgies-pliroforiki-g-lykeiou-aepp-2022-203/';
    const eduProgLB : string = 'https://nickpapag.sites.sch.gr/2022/09/23/odhgies-eisagogi-arxes-episthmhs-hy-2022-2023/';
    const eduProgLA : string = 'https://nickpapag.sites.sch.gr/2022/09/23/odhgies-efarmoges-pliroforikis-a-lykeiou-2022-2023/';
    const eduProgG : string = 'https://nickpapag.sites.sch.gr/2022/09/14/yli-odhgies-pliroforiki-2022-2023/';
    const eduProgD : string = 'https://blogs.sch.gr/kmaragos/dimotiko/odigies-didaskalias-gia-tis-tpe-sto-dimotiko-scholeio-gia-to-scholiko-etos-2022-2023/';
    
    switch (this.scenario.eduProg) {
      case "Γ'Λυκείου":
        this.eduProg = eduProgLG;
        break;
      case "Β'Λυκείου":
        this.eduProg = eduProgLB;
        break;

      case "Α'Λυκείου":
        this.eduProg = eduProgLA;
        break;

      case "Γ'Γυμνασίου":
      case "Β'Γυμνασίου":
      case "Α'Γυμνασίου":
        this.eduProg = eduProgG;
        break;

        case "ΣΤ'Δημοτικού":
      case "Ε'Δημοτικού":
      case "Δ'Δημοτικού":
        case "Γ'Δημοτικού":
      case "Β'Δημοτικού":
      case "Α'Δημοτικού":
        this.eduProg = eduProgD;
        break;

      default:
        this.eduProg = '';
        break;
    }
  }

  //used to change the prposed verbs for the goals according to the bloom taxonomy selected.
  onBloomChange() {
    //verbs for each level
    const knowledge = 'θυμάμαι, αναφέρω, εντοπίζω, αντιγράφω, αναμεταδίδω, ονομάζω, περιγράφω, αφηγούμαι, αναγνωρίζω, επιλέγω, δηλώνω, ορίζω, καταλογίζω.';
    const understanding = 'κατανοώ, οργανώνω , ταξινομώ, ταιριάζω, επιδεικνύω, εξηγώ , ερμηνεύω, δίνω παράδειγμα, κρίνω, δείχνω, αναπαριστώ, διατυπώνω, υποθέτω, προβλέπω, εξηγώ, επαναπροσδιορίζω, αναθεωρώ, μεταφράζω, συνοψίζω.';
    const applying = 'γενικεύω, λύνω, μεταδίδω, επιλέγω, αξιοποιώ, προβάλω, προεκτίνω, αναθεωρώ, αναγνωρίζω, εξηγώ, ερμηνεύω, κωδικοποιώ, οργανώνω, συστηματοποιώ, δραματοποιώ, σκηνοθετώ, προσωποποιώ, σκιαγραφώ, επιδεικνύω, προτοιμάζω, πραγματοποιώ.';
    const analyzing = 'αναλύω, διακρίνω, κατηγοριοποιώ, ταξινομώ, διαφοροποιώ, ταυτοποιώ παρατηρώ, υποθέτω, αναδεικνύω, αναδομώ, αποκωδικοποιώ, ανασκοπώ, αντιπαραβάλλω.';
    const evaluating = 'κρίνω, αποδεικνύω, ασκώ κριτική, επικυρώνω, αξιολογώ, εκτιμώ, μετρώ, ζυγίζω, εξετάζω, ιεραρχώ, συμπεραίνω, επαληθεύω ελέγχω, εκλέγω.';
    const creating = 'δημιουργώ, σχεδιάζω, επινοώ, επιλύω, ανακαλύπτω, εισάγω, διαγράγω, αναπαριστώ, φαντάζομαι, βελτιώνω, ελαχιστοποιώ, συνδυάζω, συνθέτω, προβλέπω, διαμορφώνω, αναπτύσσω, κατασκευάζω, οργανώνω, παράγω γνώση/ιδέα/έργο.';

    const oldTip = 'Αποφύγετε μη ενεργητικά και αφηρημένα ρήματα. ';  //used to revert to the initial  non selection tip
    const suggest = 'Προτιμήστε ρήματα όπως: ';   //middle standard text (reusable)

    switch (this.scenario.BloomTaxonomy) {
      case "Απομνημόνευση":
        this.goalsTip = oldTip + suggest + knowledge;
        break;
      case "Κατανόηση":
        this.goalsTip = oldTip + suggest + understanding;
        break;

      case "Εφαρμογή":
        this.goalsTip = oldTip + suggest + applying;
        break;

      case "Ανάλυση":
        this.goalsTip = oldTip + suggest + analyzing;
        break;

      case "Αξιολόγηση":
        this.goalsTip = oldTip + suggest + evaluating;
        break;

      case "Σύνθεση":
        this.goalsTip = oldTip + suggest + creating;
        break;

      default:
        this.goalsTip = oldTip;
        break;
    }

  }

}
