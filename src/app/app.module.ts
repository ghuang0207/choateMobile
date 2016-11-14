import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { DailyMeasurePage } from '../pages/dailyMeasure/dailyMeasure';
import { PeoplePage } from '../pages/people/people';
import { TabsPage } from '../pages/tabs/tabs';
import { AppService } from './app.service';
import {ContactsRoot} from '../pages/contacts-root/contacts-root';
import {DailyRoot} from '../pages/daily-root/daily-root';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    PeoplePage,
    DailyMeasurePage,
    TabsPage,
    ContactsRoot,
    DailyRoot
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    PeoplePage,
    DailyMeasurePage,
    TabsPage,
    ContactsRoot,
    DailyRoot
  ],
  providers: [AppService]
})
export class AppModule {}
