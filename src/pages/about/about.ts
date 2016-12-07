import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public device:any;
  public profile:any={};
  public showInfo: boolean;
  public timer:any;
  
  constructor(public navCtrl: NavController, public appService:AppService) {
    this.device  = appService.getDeviceInfo();
    this.showInfo = appService.profileLoaded;
    this.timer = setInterval(()=> this.assignPerson(),2000);
    //this.profile = appService.profile;
    //appService.getLoginProfile(this.device["uuid"]);
  }
    public assignPerson(){
        
        this.profile = this.appService.profile;
        
        if(this.appService.profileLoaded == true){
            this.stopInterval();
        }

    }
    public stopInterval(){
        clearInterval(this.timer);
        //this.showInfo = true;
    }

}
