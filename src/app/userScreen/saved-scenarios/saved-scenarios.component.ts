import { Component, OnInit } from '@angular/core';


const scenarios = [
  {
    name: 'Scenario1'
  },
  {
    name: 'Scenario2'
  }
]

@Component({
  selector: 'app-saved-scenarios',
  templateUrl: './saved-scenarios.component.html',
  styleUrls: ['./saved-scenarios.component.css']
})
export class SavedScenariosComponent implements OnInit{

  scenarios = scenarios;
  
  constructor() {}

  ngOnInit(): void {
  }

}
