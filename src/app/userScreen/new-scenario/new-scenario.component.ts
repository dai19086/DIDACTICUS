import { Component } from '@angular/core';

import { Scenario } from 'src/app/scenario.model';

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
    { value: "Α'Δημοτικού", label: "Α'Δημοτικού" },

    { value: "Νηπιαγωγείο", label: "Νηπιαγωγείο" }
  ];
  goalsTip : string = "Αποφύγετε μη ενεργητικά και αφηρημένα ρήματα όπως 'να μάθουν', 'να γνωρίζουν', 'να κατανοήσου', ή εκφράσεις όπως 'να μπορούν' ή 'να είναι σε θέση'. Αντ' αυτού προτιμήστε ενεργητικά ρήματα για την περιγραφή των στόχων του Σεναρίου σας.";

  eduProg : string = '';    //link to educational program
  
  page : number = 0;        //used for dectating the page of the form that is currently displayed

  id : number = 0;    //the user's id
  scenario: Scenario = new Scenario();

  constructor () { }

  ngOnInit(): void {
    this.page = 1;
    this.scenario = new Scenario();



  }

  //onClicks for the Next & Previous Buttons
  onClickPrevious(){this.page = this.page -1;}
  onClickNext(){this.page = this.page +1;}

  //used onChange detection to subsequently change the URL that is displayed to the user once a school grade is chosen
  onSelect() {
    switch (this.scenario.eduProg) {
      case "Γ'Λυκείου":
        this.eduProg = 'https://www.youtube.com/';
        break;
      case "Β'Λυκείου":
        this.eduProg = 'ΔευτέραΛ';
        break;
      case "Α'Λυκείου":
        this.eduProg = 'https://mail.google.com/';
        break;

        case "Γ'Γυμνασίου":
        this.eduProg = 'ΤρίτηΓ';
        break;
      case "Β'Γυμνασίου":
        this.eduProg = 'https://drive.google.com/';
        break;
      case "Α'Γυμνασίου":
        this.eduProg = 'ΠρώτηΓ';
        break;

        case "ΣΤ'Δημοτικού":
        this.eduProg = 'https://www.facebook.com/';
        break;
      case "Ε'Δημοτικού":
        this.eduProg = 'ΠέμπτηΔ';
        break;
      case "Δ'Δημοτικού":
        this.eduProg = 'ΤετάρτηΔ';
        break;
        case "Γ'Δημοτικού":
        this.eduProg = 'ΤρίτηΔ';
        break;
      case "Β'Δημοτικού":
        this.eduProg = 'ΔευτέραΔ';
        break;
      case "Α'Δημοτικού":
        this.eduProg = 'ΠρώτηΔ';
        break;

        case "Νηπιαγωγείο":
        this.eduProg = 'https://openeclass.uom.gr/';
        break;

      default:
        this.eduProg = '';
        break;
    }
  }
}
