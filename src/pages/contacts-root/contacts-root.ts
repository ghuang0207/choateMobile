import { Component, ViewChild } from '@angular/core';
import { Nav, LoadingController , NavController, MenuController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import {PeoplePage} from '../people/people';

/*
  Generated class for the ContactsRoot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  
  templateUrl: 'contacts-root.html',
  providers:[AppService]
})
export class ContactsRoot {
  @ViewChild(Nav) nav: Nav;
  employees: any = [];
  errorMessage: any;
  favTKIDs:any = [];
  loadingComplete:any = 0;

  rootPage: any = PeoplePage;
  constructor(private menuCtrl: MenuController ,public navCtrl: NavController, private appService: AppService, public loadingCtrl:LoadingController) {
    let loader = loadingCtrl.create();
    loader.present();
    this.appService.getPeople().subscribe(
                       employee  => { this.employees=employee; loader.dismiss(); this.loadingComplete = 1;},
                       error =>  this.errorMessage = <any>error);
    
  }

  getDepartmentMembers(deptCode : string){
    if(deptCode=="Fav"){

      let emps = this.appService.getFavorites();
      this.nav.setRoot(PeoplePage,emps);
    }
    else{
        let emps = this.appService.getDepartmentMembers(deptCode);
    //this.navCtrl.push(PeoplePage,emps);

      this.nav.setRoot(PeoplePage,emps);
    }

  }


  ionViewDidLoad() {
    console.log('Hello ContactsRoot Page');
    
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(true, "contactsMenu");
    this.menuCtrl.enable(false, "dailyMenu");
    console.log(this.rootPage.employees);
  }

}
