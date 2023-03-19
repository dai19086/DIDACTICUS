import { Component } from '@angular/core';
import * as PDFDocument from 'pdfkit';

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
    { value: "Α'Δημοτικού", label: "Α'Δημοτικού" },
  ];
  goalsTip : string = "Αποφύγετε μη ενεργητικά και αφηρημένα ρήματα όπως 'να μάθουν', 'να γνωρίζουν', 'να κατανοήσου', ή εκφράσεις όπως 'να μπορούν' ή 'να είναι σε θέση'. Αντ' αυτού προτιμήστε ενεργητικά ρήματα για την περιγραφή των στόχων του Σεναρίου σας.";




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
}
