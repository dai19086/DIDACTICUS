import { NavigationExtras } from "@angular/router";
import { Scenario } from "./scenario.model";

export interface MyNavigationExtras extends NavigationExtras {
    scenario: Scenario;
  }