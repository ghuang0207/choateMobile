import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AppService } from '../app/app.service';
import { TabsPage } from '../pages/tabs/tabs';
import { Device } from 'ionic-native';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;
  
  constructor(platform: Platform, private appService: AppService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // grab the device information - query db table to identify the login
      debugger;
      console.log("UUID",Device.device.uuid);
      console.log("Device",Device.device);
      console.log("Model",Device.device.model);
      console.log("Version",Device.device.version);
      

      // init SQLite
      /*let db = new SQLite();
        db.openDatabase({
            name: "data.db",
            location: "default"
        }).then(() => {
            
        }, (error) => {
            console.error("Unable to open database", error);
        });*/

    });
  }
}
