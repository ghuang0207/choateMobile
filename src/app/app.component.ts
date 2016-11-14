import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';
import { AppService } from '../app/app.service';
import { TabsPage } from '../pages/tabs/tabs';


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
      //Splashscreen.hide();

      // init SQLite
      debugger;
      
      let db = new SQLite();
        db.openDatabase({
            name: "data.db",
            location: "default"
        }).then(() => {
            db.executeSql(`CREATE TABLE IF NOT EXISTS people (
                tkid TEXT PRIMARY KEY, 
                department TEXT,
                fullName Text,
                jobTitle TEXT,
                extension TEXT,
                email TEXT,
                altPhone TEXT
            )`, {}).then((data) => {
                console.log("TABLE CREATED: ", data);
            }, (error) => {
                console.error("Unable to execute sql", error);
            })
        }, (error) => {
            console.error("Unable to open database", error);
        });

    });
  }
}
