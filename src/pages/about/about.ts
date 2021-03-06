import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,Platform } from 'ionic-angular';
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
  
  constructor(public platform:Platform, public storage:Storage, public navCtrl: NavController, public appService:AppService) {
    this.device  = appService.getDeviceInfo();
    this.showInfo = appService.profileLoaded;
    // we need to continuely watching if the profile of the logged in user is ready.
    this.timer = setInterval(()=> this.assignPerson(),2000);

    //this.profile = appService.profile;
    //appService.getLoginProfile(this.device["uuid"]);
  }
    public assignPerson(){
        // in the about page, we don't get profile from local, but just from service
        this.profile = this.appService.profile;
        
        if(this.appService.profileLoaded == true){
            // stop watching
            this.stopInterval();
        }

    }
    public stopInterval(){
        
        if (this.profile.fullName == null){
            this.profile = null;
        }
        else{
            this.profile.extension = "617-248-" + this.profile.extension;
        }
        // stop watching
        clearInterval(this.timer);
        //this.showInfo = true;
    }

}
