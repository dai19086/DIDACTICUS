import { Component } from '@angular/core';

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
  eduProg : string = '';    //link to educational program
  
  page : number = 0;        //used for dectating the page of the form that is currently displayed

  id : number = 0;    //the user's id
  scenario: string[] =['','','','','','','','','','','','','','','','','','',''];   //the scenario's structure that the user inputed
  //----------page1
  //0:title
  //1:duration
  //2:eduProg
  //----------page2
  //3:goals
  //4:description
  //5:sciApproach
  //--------------page3
  //6:connections
  //7:multiApproach
  //8:toolJusti
  //9:sources
  //----------page4
  //10:method
  //11:microChanges
  //12:activityEllaboration
  //13:classOrg
  //------------page5
  //14:consensus
  //15:difficulties
  //16:noise
  //--------------page6
  //17:evaluation
  //18:reflection


  constructor () { }

  ngOnInit(): void {
    this.page = 1;



  }

  //onClicks for the Next & Previous Buttons
  onClickPrevious(){this.page = this.page -1;}
  onClickNext(){this.page = this.page +1;}

  //used onChange detection to subsequently change the URL that is displayed to the user once a school grade is chosen
  onSelect() {
    switch (this.scenario[2]) {
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
