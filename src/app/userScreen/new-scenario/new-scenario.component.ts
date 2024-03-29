import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { initializeApp } from '@angular/fire/app';
import { collection, doc, getDocs, getFirestore, query, setDoc, Timestamp, where } from '@angular/fire/firestore';

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

  goalsTip : string = "Αποφύγετε μη ενεργητικά και αφηρημένα ρήματα. "; //tip for goal fields in the form (modified in onBloomSelect() method)

  eduProg : string = '';    //link to educational program (modified in onSelect() method)

  tip : string[] = [];    //array of tipLines to display in tip section (modified in showTip/hideTip methods)
  //used for determining which show/hide buttons will appear and where
  showTipButtonList: boolean[] = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  //tips for TIP section
  tipList: string[][] = [
    /*0*/['Σαφής τίτλος που περιέχει οπωσδήποτε:',
          'Tην ενότητα του αναλυτικού προγράμματος που θα διδαχθεί',
          'Tο λογισμικό ή την τεχνική που θα χρησιμοποιηθεί.',
          'Επίσης όταν χρησιμοποιούμε μια γνωστή τεχνική (π.χ. εννοιολογική χαρτογράφηση) αρκεί η αναφορά της τεχνικής και δε χρειάζεται αναφορά συγκεκριμένου λογισμικού.',
          'Προαιρετικά μπορεί να υπάρχει και ένας υπέρτιτλος. Π.χ. «Μάντεψε τον αριθμό! – Δομές επανάληψης με το ‘Scratch’».'],
    /*1*/['Αν είναι μεγαλύτερος του συνήθους (π.χ. 4 ώρες), ίσως απαιτείται μια πολύ συνοπτική κατανομή των δραστηριοτήτων (π.χ. ανά 2ωρο).',
          'Αν ο χρόνος εξαρτάται από κάποιους παράγοντες (π.χ. ηλικία, εμπειρία και αριθμό μαθητών), αυτοί πρέπει να αναφερθούν.'],
    /*2*/['Ο όρος «συνοπτική» είναι σχετικός.',
          'Καταρχάς δίνεται η «κεντρική ιδέα» του σεναρίου, δηλαδή σε τι αποσκοπεί το σενάριο, τι επιδιώκουμε να διδάξουμε με αυτό, σε μια σύντομη παράγραφο.',
          'Στη συνέχεια, καταθέτουμε ένα επεξηγηματικό χρονοδιάγραμμα εκτέλεσης του σεναρίου με βάση τις δραστηριότητες των φύλλων εργασίας.',
          'Ειδικά στην περίπτωση που χρησιμοποιούμε μαθησιακό αντικείμενο του Φωτόδεντρου, αναφέρουμε τον τίτλο του και τη διεύθυνσή του στον Παγκόσμιο Ιστό ως υπερσύνδεσμο.',
          'Δίνουμε οδηγίες προς τον εκπαιδευτικό για τα διάφορα βήματα διεξαγωγής του σεναρίου, ειδικά αν έχουμε εντοπίσει δύσκολα σημεία στη διεξαγωγή του.',
          'Προτείνουμε, αν είναι σκόπιμο, κάποια βιωματική δραστηριότητα για να βοηθήσουμε τους μαθητές στην καλύτερη κατανόηση εννοιών και μεθόδων.',
          'Περιγράφουμε τους ρόλους των συντελεστών της εκπαιδευτικής διαδικασίας (ομάδες μαθητών, μαθητής ως άτομο, εκπαιδευτικός).'],
    /*3*/['ΕΠΙΣΤΗΜΟΛΟΓΙΚΗ ΠΡΟΣΕΓΓΙΣΗ:',
          'Σύντομη εξήγηση της επιστημονικής σπουδαιότητας του γνωστικού αντικειμένου και των επιμέρους εννοιών που πραγματεύεται το σενάριο.',
          'Αναδεικνύουμε την αξία των εννοιών η δημιουργία και η εξέλιξη των οποίων είναι συνέπεια των εξελίξεων στον αντίστοιχο επιστημονικό κλάδο ή των κοινωνικών πρακτικών που συνδέονται με αυτές.',
          'Ενίοτε απαιτείται, εκτός από το γνωστικό αντικείμενο, να προσεγγιστεί επιστημολογικά και το εκπαιδευτικό ψηφιακό εργαλείο που θα χρησιμοποιηθεί.',
          'ΕΝΝΟΙΟΛΟΓΙΚΗ ΑΝΑΛΥΣΗ:',
          'Διασυνδέουμε τις διδασκόμενες έννοιες με ανάλογες έννοιες σε άλλα μαθήματα ή ακόμη και στην καθημερινότητα.',
          'Σε ορισμένες περιπτώσεις ίσως απαιτείται μια ανάλυση – με τη μορφή υπενθύμισης προς τον εκπαιδευτικό – της έννοιας που πρόκειται να διδαχθεί όταν αυτή παρουσιάζει μια σχετική πολυπλοκότητα (π.χ. στις δομές επανάληψης ίσως απαιτείται μια ανάλυση των συστατικών στοιχείων τους και της λειτουργίας τους).',
          'Τέλος, εδώ μπορούμε να εντάξουμε θέματα διδακτικού μετασχηματισμού.'],
    /*4*/['Ένταξη του γνωστικού αντικειμένου στην αλληλουχία της διδασκαλίας των διαφόρων ενοτήτων του μαθήματος.',
          'Επεκτείνουμε τις διδασκόμενες έννοιες προς άλλες δραστηριότητες, άλλα προβλήματα, περαιτέρω εμβάθυνση, κ.λπ.'],
    /*5*/['Αναφέρουμε άλλα, διαφορετικά πλαίσια εκφοράς ή αναπαράστασης των διδασκομένων εννοιών.',
          'Π.χ.: προσομοιώσεις των αλγορίθμων ταξινόμησης φυσαλίδας με χορούς.'],
    /*6*/['Καταγραφή των δυσκολιών των μαθητών που μπορεί να οφείλονται:',
          'Στις εμπειρίες από την καθημερινή τους ζωή που σε πολλά σημεία είναι ασύμβατες με τον αλγοριθμικό τρόπο σκέψης που απαιτεί η επιστήμη της πληροφορικής.',
          'Στην πρότερη τυχόν εμπειρία τους με «παλαιότερα» εκπαιδευτικά ψηφιακά περιβάλλοντα (π.χ. Scratch στο Δημοτικό και στο Γυμνάσιο και στη συνέχεια App Inventor, «Γλωσσομάθεια», Python στο Λύκειο).',
          'Στο είδος των προβλημάτων που έχουν κληθεί να επιλύσουν σε πρότερη ενασχόλησή τους με την πληροφορική.',
          'Εδώ εξυπηρετεί πάρα πολύ η προσωπική εμπειρία του εκπαιδευτικού, αλλά και η επαρκής γνώση της βιβλιογραφίας.',
          'Καλό είναι δίπλα σε κάθε αναφερόμενη δυσκολία να υπάρχει έστω μια πρόταση για τον τρόπο υπέρβασής της.',
          'Πώς πιθανόν το ίδιο το λογισμικό δημιουργεί μια κατάλληλη προδιάθεση και βοηθά στην υπέρβαση αυτών των δυσκολιών, π.χ. με τον παιγνιώδη χαρακτήρα του (Scratch) ή με την καταλληλότητά του για τη δημιουργία παιχνιδιών (App Inventor).'],
    /*7*/['Σαφής αναφορά των εκπαιδευτικών ψηφιακών περιβαλλόντων θα χρησιμοποιηθούν καθώς και των απαιτούμενων ψηφιακών μέσων (εργαστήριο, υπολογιστές, βιντεοπροβολέας, σύνδεση στο Διαδίκτυο, κ.λπ.).',
          'Γιατί τα προτεινόμενα εκπαιδευτικά περιβάλλοντα είναι κατάλληλα για τη διδασκαλία του συγκεκριμένου γνωστικού αντικειμένου;',
          'Οι επιλογές θα πρέπει να αξιολογούνται με βάση όχι (μόνο) τον καινοτόμο χαρακτήρα τους, αλλά την εκτιμώμενη διδακτική τους αποτελεσματικότητα.',
          'Πρέπει να καθίσταται φανερή η συμβολή της τεχνολογίας στην επίτευξη συγκεκριμένων διδακτικών στόχων.',
          'Αντίλογος και επιφυλάξεις που έχουν εκφραστεί για τη χρήση των συγκεκριμένων εκπαιδευτικών ψηφιακών περιβαλλόντων (μειονεκτήματα κ.λπ.). Μήπως τα ψηφιακά μέσα δεν είναι απαραίτητα για τη σχεδιαζόμενη μαθησιακή δραστηριότητα; (π.χ. εννοιολογική χαρτογράφηση).',
          'Ανάγκη ή μη εγκατάστασης του εκπαιδευτικού ψηφιακού περιβάλλοντος ή εκτέλεσή του μέσω Διαδικτύου κ.λπ.',
          'Προβλήματα που τυχόν παρουσιάζουν.',
          'Προσδοκάται η συμβολή στο γνωστικό πεδίο ή η ανάπτυξη μιας συγκεκριμένης δεξιότητας;',
          'Απαιτείται π.χ. ένα χρονικό διάστημα για την εξοικείωση των μαθητών με ένα νέο περιβάλλον εργασίας και ενδεχομένως απαιτούνται πόροι και υποδομή που δεν είναι διαθέσιμοι;',
          'Μήπως είναι πρόωρη η εισαγωγή της αν δεν έχει εξασφαλιστεί άλλη σχετική γνώση ή δεξιότητες;',
          'Υπάρχει κίνδυνος να δημιουργηθεί παρανόηση για κάποιο θέμα στους μαθητές;',
          'Είναι ενδεχόμενη μια απώλεια σε θέματα δεξιοτήτων;',
          'Αναφέρουμε αν τυχόν το χρησιμοποιούμενο εκπαιδευτικό ψηφιακό περιβάλλον μπορεί να θεωρηθεί επέκταση κάποιου άλλου.',
          'Ειδικά στην περίπτωση που χρησιμοποιούμε μαθησιακό αντικείμενο του Φωτόδεντρου, μπορούμε να μεταβούμε στη «σελίδα του αντικειμένου» και να αντλήσουμε πληροφορίες σχετικά με τη διδακτική αξία του από τα πεδία «ΠΕΡΙΓΡΑΦΗ» και «ΣΗΜΕΙΩΣΕΙΣ ΓΙΑ ΔΙΔΑΚΤΙΚΗ ΑΞΙΟΠΟΙΗΣΗ».'],
    /*8*/['Πρόβλεψη και τρόπος αντιμετώπισης πιθανών αιτιών διδακτικού θορύβου, όπως «καταρρεύσεις» λόγω σφαλμάτων λογισμικού, ασυμβατότητες λογισμικού-υλικού, αργή σύνδεση στο Διαδίκτυο, απώλεια χρόνου κατά τη συγκρότηση των ομάδων σε μια ομαδοσυνεργατική διδασκαλία, ελλείψεις και ασάφειες στο περιεχόμενο των φύλλων εργασίας, ανεπαρκής προετοιμασία όλων των προαπαιτουμένων της διδασκαλίας κ.λπ.',
          'Πρόσθετη πηγή διδακτικού θορύβου, μη τεχνικής φύσεως, μπορεί να είναι η έλλειψη προαπαιτούμενων γνώσεων των μαθητών. Ο εκπαιδευτικός, δηλαδή, μπορεί να υποθέτει ότι οι μαθητές έχουν κάποιες γνώσεις από προηγούμενα μαθήματα (ή ακόμη και από άλλες τάξεις), αλλά αυτό να μην είναι ορθό – κυρίως αν πρόκειται για έννοιες ή μεθόδους που θεωρούνται «δύσκολες» από τους μαθητές.',
          'Σε κάθε περίπτωση, η αναφορά οποιασδήποτε πηγής διδακτικού θορύβου πρέπει να συνοδεύεται έστω από μια πρόταση για τον τρόπο εξάλειψης ή τουλάχιστον μείωσής της.'],
    /*9*/['Αναφορά όλης της βιβλιογραφίας και διαδικτυογραφίας που χρησιμοποιήθηκε κατά τη συγγραφή του σεναρίου ή μπορεί να αποτελέσει βοήθημα για περαιτέρω μελέτη προς τον εκπαιδευτικό και τους μαθητές',
          'Εάν συμπεριλάβουμε υπερσυνδέσμους (κάτι το οποίο συνιστάται), ελέγχουμε σχολαστικά τη λειτουργικότητά τους.'],
    /*10*/['Ποια/ες θεωρία/ες μάθησης έχει ως βάση το σενάριο;',
            'Πώς επηρεάζουν αυτές το σενάριο; Τι είδους δραστηριότητες προτείνονται στους μαθητές; Με ποια μέθοδο καλούνται να τις υλοποιήσουν;',
            'Σε ποιες θεωρίες μάθησης βασίζονται τα εκπαιδευτικά ψηφιακά περιβάλλοντα που θα χρησιμοποιηθούν;',
            'Ποιες θετικές επιδράσεις έχουν στους μαθητές και στη διεξαγωγή του μαθήματος οι μεθοδολογίες που χρησιμοποιούνται και άρα οι υποκείμενες θεωρίες μάθησης;',
            'Ποιες τυχόν δυσκολίες αναμένεται να παρατηρηθούν κατά τη διεξαγωγή του μαθήματος εξαιτίας των θεωριών μάθησης που θα χρησιμοποιηθούν και πώς θα ξεπεραστούν;'],
    /*11*/['Οι μικρομεταβολές και οι τρόποι ενσωμάτωσης και υπέρβασής τους αφορούν τη μετάβαση:',
            'Από το μάθημα χωρίς υπολογιστή στο μάθημα με υπολογιστή.',
            'Από τη «καθαρή» επιστημονική θεώρηση ορισμένων εννοιών στη θεώρησή τους μέσα από το πρίσμα των εκπαιδευτικών ψηφιακών περιβαλλόντων.',
            'Από ένα είδος εκπαιδευτικού περιβάλλοντος σε άλλο.',
            'Από μια έκδοση εκπαιδευτικού περιβάλλοντος σε άλλη.'],
    /*12*/['Πώς αναμένεται να ανταποκριθούν οι μαθητές καθ’ όλη τη διάρκεια εκτέλεσης του σεναρίου;',
            'Υπάρχει ενδεχόμενο σε κάποιο σημείο της ροής της δραστηριότητας να παραβιαστεί το διδακτικό συμβόλαιο;',
            'Επισημαίνουμε ιδίως τις περιπτώσεις στις οποίες το διδακτικό συμβόλαιο με κάποιον τρόπο παραβιάζεται διότι τότε συνήθως γίνεται αντιληπτή η ύπαρξή του.'],
    /*13*/['Πώς θα οργανώσουμε τους μαθητές, τους διαθέσιμους υπολογιστές, την εργασία των μαθητών, τον χρόνο;',
            'Συγκρότηση ομάδων μαθητών, αν απαιτείται. Λόγοι που υπαγορεύουν την παραπάνω ομαδοσυνεργατική οργάνωση της τάξης ή οποιανδήποτε άλλη.',
            'Πόσο εφικτή είναι η υλοποίηση του σχεδιασμού που περιλαμβάνει το σενάριο;'],
    /*14*/['Σύνταξη των φύλλων εργασίας.',
            'Διατύπωση προτάσεων για την αξιολόγηση των μαθητών («φύλλο αξιολόγησης»).',
            'Συνήθως αυτή περιλαμβάνεται σε ιδιαίτερο φύλλο εργασίας («φύλλο αξιολόγησης»)',
            'Μπορεί να περιέχει: ερωτήσεις κλειστού τύπου (σωστού-λάθους, πολλαπλής επιλογής κ.λπ.), σταυρόλεξα, κρυπτόλεξα, εκτέλεση έτοιμων προγραμμάτων στο χαρτί για τη διάγνωση δυσκολιών/παρανοήσεων που αφορούν τη ροή εκτέλεσης, ανάπτυξη προγραμμάτων κ.λπ.',
            'Μπορεί να γίνεται και με χρήση ρουμπρίκας, δηλαδή ειδικής φόρμας που περιέχει (συνήθως με μορφή πίνακα) άξονες/κριτήρια και κλίμακες αξιολόγησης. Ειδικά για την περίπτωση αυτή, καλό είναι οι άξονες της ρουμπρίκας να αντιστοιχούν, αν όχι να ταυτίζονται, με τους στόχους του σεναρίου.',
            'Μπορούμε να ζητήσουμε από τους μαθητές μια ομότιμη αξιολόγηση ή αλληλοαξιολόγηση (με την προϋπόθεση ότι οι στόχοι του μαθήματος έχουν παρουσιαστεί με σαφήνεια).']
  ];


  userExists : boolean = this.user.userLoggedIn;  //for saveButton function
  id : string | undefined = "0";    //the user's id
  lastSavedTime : string = '';   //initial timestamp before saving
  page : number = 0;        //used for dectating the page of the form that is currently displayed
  scenario: Scenario = new Scenario();

  

  //used for button styling for logged in or guest users
  buttonOpacity: number = 1;            //opacity for save button
  buttonVisibility: string = 'hidden';  //visibility for log in button
  saveBtnText: string = 'Αποθήκευση Σεναρίου';  //used for save scenario button
  savedScenariosLimit: number = 5;  //number of available saved scenarios for each user

  constructor (private user :UserStateService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    //initialize tip buttons to false (Give me a TIP)
    for (let i = 0; i < this.showTipButtonList.length; i++) {
      this.showTipButtonList[i]=false;
    }
    //reseting starting step to the 1st
    this.page = 1;

    //getting possible preloaded scenario from the url
    const params = this.route.snapshot.queryParamMap;
  if (params.has('scenario')) {
      const scenarioSerialized = params.get('scenario') as string;
      this.scenario = Scenario.deserialize(scenarioSerialized);     //initialize page with preloaded scenario
    } else {
      this.scenario = new Scenario();                               //initialize page with new empty scenario
    }

    //call onChange methods in case preloaded data should make any changes
    this.onSelect();
    this.onBloomChange();

    //check if any user is logged in (because the should behave differntly if there were not)
    setInterval(() => {
        this.userExists = this.user.userLoggedIn;
      },100)            //refreshes the userExists value 10 times per second
      console.log("New Scenario Page loaded successfully!")
  }

  //onClick for the Next & Previous step Buttons
  onClickNextPrevious(direction : string){
    //undo any changes that where done in this step on the tip buttons
    for (let i = 0; i < this.showTipButtonList.length; i++) {
      this.showTipButtonList[i]=false;
    }
    //empty tip bar
    this.tip = [];
    //change step accordingly
    if (direction=='next'){
      this.page = this.page +1;
    }else{
      this.page = this.page -1;
    }
  }

  //onClick for showTIP  button
  showTip(sectionBtnClicked: number){
    //reveart the rest of the buttons in their initial state
    for (let i = 0; i < this.showTipButtonList.length; i++) {
      this.showTipButtonList[i]=false;
    }
    //change the clicked button
    this.showTipButtonList[sectionBtnClicked]=true;
    //change the tip section
    this.tip = this.tipList[sectionBtnClicked];
  }

  //onClick for hideTIP  button
  hideTip(sectionBtnClicked: number){
    //reveart clicked button to initial state
    this.showTipButtonList[sectionBtnClicked]=false;
    //empty and hide tip section
    this.tip = [];
  }

  //onClick for Log In button by retaining the scenario
  redirectToLogIn(){

    if (this.scenario.isNotEmpty()){
      const scenarioSerialized = this.scenario.serialize();   //serialize the scenario

      const params: NavigationExtras = {    //add it to the navigation query parameters
        queryParams: { scenario: scenarioSerialized}
      };

      this.router.navigate(['/login'], params); //redirect with params
    }else{
      this.router.navigate(['/login']);         //redirect without params
    }
    
  }

  //onClick for ExportDOCX button
  downloadAsDOCX(){
    //call the DOCX method for the current scenario
    this.scenario.getScenarioDOCX();
  }

  //onClick for ExportPDF button
  downloadAsPDF() {
    //call the PDF method for the current scenario
    this.scenario.getScenarioPDF();
  }

  //onClick for the Save Button
  async saveButton(){
    if(this.userExists){  //check if user exists and should be able to save the scenario
      const saveScenarioText = this.saveBtnText;  //used to maintain the initial button text
      this.saveBtnText = "Αποθήκευση....";          //change the button text while waiting to save
      //initialize firebase database
      const app = initializeApp(environment.firebase);  //initializing app
      const db = getFirestore(app);                     //getting Firestore Database instance

      if(this.scenario.title === ''){           //setting RULES(cases) that will NOT be submitting the scenario
        alert("ΔΕΝ ΜΠΟΡΕΙΤΕ ΝΑ ΑΠΟΘΗΚΕΥΣΕΤΕ ΣΕΝΑΡΙΟ ΧΩΡΙΣ ΤΙΤΛΟ!")
      }else{                                    //IF rules are met
        //look at the rest of this user's saved scenarios
        const userID = this.user.currentUser?.uid;  //getting the user's id to use it for searching the database
        const qUserScenarios = query(collection(db, 'savedScenarios'), where('uid', '==', userID)); //preparing query for database
        const savedScenariosTitles: string[] = [];  //create an array with the titles to check for existence of title trying to be saved
        //fetching data
        console.log("start loading");
        await getDocs(qUserScenarios)
          .then((querySnap) => {
            //preparing data
            querySnap.forEach((doc) => {                    //for each document retrieved
              const sData = doc.data();                         //get document with the Scenario's data
              savedScenariosTitles.push(sData['title']);        //add scenario title in savedScenariosTitles array
              console.log(sData['title']);
            });
          }).catch((error) => {console.log(error);});   //signalling error
          console.log("finished loading " + savedScenariosTitles.length + " titles");
      
        let proceedSave: boolean = false;   //flag that finally allows the saving process
        
        if (savedScenariosTitles.includes(this.scenario.title)){  //if Scenario with the same title already exists ask if the user means to replace it
          proceedSave = confirm("Υπάρχει ήδη σενάριο με τίτλο " + this.scenario.title + ". Αποθήκευση αυτού του Σεναρίου θα ΑΝΤΙΚΑΤΑΣΤΗΣΕΙ το παλαιότερο με τον ίδιο τίτλο. ΘΑ ΘΕΛΑΤΕ ΝΑ ΠΡΟΧΩΡΗΣΕΤΕ ΣΕ ΑΝΤΙΚΑΤΑΣΤΑΣΗ ΤΟΥ " + this.scenario.title + " ;");
        }else{  //this is a new saved scenario
          if (savedScenariosTitles.length<this.savedScenariosLimit){    //checking if the number of scenarios is less than the maximum set(20)
            proceedSave = confirm("Με την ΑΠΟΘΗΚΕΥΣΗ αυτού του Σεναρίου θα έχετε " + (savedScenariosTitles.length + 1) + " Αποθηκευμένα Σενάρια (Όριο: " + this.savedScenariosLimit + "). Επιθυμείτε να συνεχίσετε με την ΑΠΟΘΗΚΕΥΣΗ του Σεναρίου: " + this.scenario.title + " ;");
          }else{
            //if the maximum has been reached inform the user
            alert("ΔΕΝ ΜΠΟΡΕΙΤΕ να αποθηκεύσετε πάνω από " + this.savedScenariosLimit + " Σενάρια! Για να αποθηκεύσετε άλλο Σενάριο θα πρέπει να διαγράψετε κάποιο από τα παλαιότερά σας. Διαφορετικά μπορείτε να εξάγετε το νέο σας Σενάριό σε μορφή αρχείου .docx ή .pdf!")
          }
        }

        if(proceedSave){
          //save senario
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

        this.saveBtnText = saveScenarioText;  //revert to the original button's text

      }
      
    } else{
      //notify that you have to be logged in to use this feature
      alert("Μόνο συνδεδεμένοι χρήστες έχουν δυνατότητα αποθήκευσης Σεναρίων. Παρακαλώ συνδεθείτε και ξαναπροσπαθήστε!");
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
