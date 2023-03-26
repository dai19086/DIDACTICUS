//import * as stream from 'stream';
//import * as zlib from 'zlib';

import { Component } from '@angular/core';
//import * as PDFDocument from 'pdfkit';
//import { Writable } from 'stream';
//import { saveAs } from 'file-saver';


import { Scenario } from 'src/app/scenario.model';
import { UserStateService } from 'src/app/shared/auth.service';

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

  page : number = 0;        //used for dectating the page of the form that is currently displayed

  id : string | undefined = "0";    //the user's id
  scenario: Scenario = new Scenario();

  userExists : boolean = this.user.userLoggedIn;  //for saveButton function

  //used for button styling for logged in or guest users
  buttonOpacity: number = 1;
  buttonVisibility: string = 'hidden';

  constructor (private user :UserStateService) { }

  ngOnInit(): void {
    this.page = 1;
    this.scenario = new Scenario();

    setInterval(() => {
        this.userExists = this.user.userLoggedIn;
      },100)            //refreshes the userExists value 10 times per second

      if(this.userExists){
        this.buttonOpacity = 1;
      }else{
        this.buttonOpacity = 0.5;
      }
  }

  //onClicks for the Next & Previous Buttons
  onClickPrevious(){this.page = this.page -1;}
  onClickNext(){this.page = this.page +1;}


  //TODO:
    //-Change pdf file name
    //-Add file content
    //-Fix webpack error
    
  //onClick for ExportPDF button
  /*downloadAsPDF() {
    const doc = new PDFDocument();
    const chunks: Uint8Array[] = [];
    // Creates writable stream that writes the data to a Blob object
    doc.pipe(new Writable({
      write: (chunk, encoding, next) => {
        chunks.push(chunk);
        next();
      },
      final: () => {
        const blob = new Blob(chunks, { type: 'application/pdf' });
  
        // Download the file using the saveAs function
        saveAs(blob, 'Scenario.pdf');
      }
    }));
    // Arrange the PDF's text
    doc.text('Hello, world!');
    doc.end();
  }*/

  //onClick for the Save Button
  saveButton(){
    if(this.userExists){
      this.id=this.user.currentUser?.uid;
      alert(this.id);
      //save senario
    } else{
      //decrease opacity and show warning(maybe a button to log in)
      alert("Only users can access the Save Scenario feature. Please log in and try again!");
      this.buttonVisibility = 'visible';
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
