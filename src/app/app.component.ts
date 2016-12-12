import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AppService } from '../app/app.service';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar, Splashscreen, Device, AppVersion } from 'ionic-native';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;
  
  constructor(platform: Platform, private appService: AppService, public storage:Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // grab the device information - query db table to identify the login
      let d = Device.device;
      
      AppVersion.getVersionNumber().then((appversion) => {
        d["appversion"] = appversion;
        appService.setDeviceInfo(d)
      }, (err) => {console.log(err)}
       );
    
      appService.setAllEmployees();
      appService.getLoginProfile(d["uuid"]);

    });
  }
}
