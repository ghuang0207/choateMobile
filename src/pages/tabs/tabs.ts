import { Component } from '@angular/core';

//import { DailyMeasurePage } from '../dailyMeasure/dailyMeasure';
import {ContactsRoot} from '../contacts-root/contacts-root';
import {DailyRoot} from '../daily-root/daily-root';

//import { PeoplePage } from '../people/people';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ContactsRoot;
  tab2Root: any = DailyRoot;
  tab3Root: any = AboutPage;

  constructor() {

  }
}
