import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { DailyMeasurePage} from '../dailyMeasure/dailyMeasure';

/*
  Generated class for the DailyRoot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-daily-root',
  templateUrl: 'daily-root.html'
})
export class DailyRoot {
  rootPage: any = DailyMeasurePage;
  constructor(private menuCtrl: MenuController, public navCtrl: NavController) {
    
  }

  ionViewDidLoad() {
    console.log('Hello DailyRoot Page');
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(true, "dailyMenu");
    this.menuCtrl.enable(false, "contactsMenu");
  }

}
