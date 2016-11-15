import { Component, ViewChild } from '@angular/core';
import { Nav, LoadingController , NavController, MenuController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import {PeoplePage} from '../people/people';
import {SQLite} from "ionic-native";

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
    /*this.appService.getPeople().subscribe(
                       employee  => { this.employees=employee; loader.dismiss(); this.loadingComplete = 1;},
                       error =>  this.errorMessage = <any>error);*/
    let db = new SQLite();
    db.openDatabase({name: "data.db", location: "default"}).then(() => { 
      db.executeSql("SELECT tkid from people",[]).then((data) =>{
        if(data.rows.length == 0)
          this.refreshSqliteDb();
        else
          this.loadData(db);
        },
          (error) =>{console.log("Error");});
      },
          //open db error
        (error) => {console.log(error)});
    loader.dismiss();
    this.loadingComplete = 1;
    
  }
  loadData(db){
    db.executeSql("SELECT * from people",[]).then((data) =>{
          this.employees = [];
            for(var i = 0; i < data.rows.length; i++) {
                this.employees.push({
                  tkid: data.rows.item(i).tkid,
                  fullName: data.rows.item(i).fullName,
                  department: data.rows.item(i).department,
                  jobTitle: data.rows.item(i).jobTitle,
                  deptCode: data.rows.item(i).deptCode,
                  extension: data.rows.item(i).extension,
                  altPhone: data.rows.item(i).altPhone,
                  email: data.rows.item(i).email
                });
            }
        },
          (error) =>{console.log("Error");});
  }

  refreshSqliteDb(){
      let db = new SQLite();
       
       db.openDatabase({name: "data.db", location: "default"}).then(() => {
              this.appService.getPeople().subscribe(
                employees  => {
                  this.employees = employees;
                  db.executeSql("DELETE FROM people", []).then((data) => {
                      for(var i = 0; i < employees.length; i++) {
                        this.loadDataIntoSqlite(employees[i],db);
                      } 
                  }, (error) => {
                      //Delete error
                      console.log("ERROR: " + JSON.stringify(error));
                  });},
                  //Service error
                error =>  this.errorMessage = <any>error);
          },
          //open db error
        (error) => {console.log(error)});
  }


  loadDataIntoSqlite(person, db){
      db.executeSql(`INSERT INTO 
                    people (tkid,fullName,email,department,jobTitle,extension,altPhone,deptCode) 
                        VALUES (?,?,?,?,?,?,?,?)
                    `, [person.tkid,person.fullName,person.email,person.department,person.jobTitle,person.extension,person.altPhone,person.deptCode]).then((data) => {
                        console.log("INSERTED: " + JSON.stringify(data));
                    }, (error) => {
                        console.log("ERROR: " + JSON.stringify(error));
                });

  }

  getDepartmentMembers(deptCode : string){
    if(deptCode=="Fav"){

      //let emps = this.appService.getFavorites();

      let db = new SQLite();
       
       db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql("SELECT people.tkid,people.fullName, people.extension, people.email,people.altPhone,people.jobTitle,people.department,people.deptCode FROM favorites JOIN people ON favorites.tkid = people.tkid", []).then((data) => {
            console.log(data);
            if(data.rows.length > 0) {
              let emps=[];
                for(var i = 0; i < data.rows.length; i++) {
                    emps.push({
                      tkid: data.rows.item(i).tkid,
                      fullName: data.rows.item(i).fullName,
                      department: data.rows.item(i).department,
                      jobTitle: data.rows.item(i).jobTitle,
                      deptCode:data.rows.item(i).deptCode,
                      extension: data.rows.item(i).extension,
                      altPhone: data.rows.item(i).altPhone,
                      email: data.rows.item(i).email
                    });
                }
                console.log(emps);
                this.nav.setRoot(PeoplePage,emps);
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});

      //this.nav.setRoot(PeoplePage,emps);
    }
    else{
      
      let db = new SQLite();
       
      db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql("SELECT * FROM people WHERE deptCode = (?)", [deptCode]).then((data) => {
            console.log(data);
            if(data.rows.length > 0) {
              let emps=[];
                for(var i = 0; i < data.rows.length; i++) {
                    emps.push({
                      tkid: data.rows.item(i).tkid,
                      fullName: data.rows.item(i).fullName,
                      department: data.rows.item(i).department,
                      jobTitle: data.rows.item(i).jobTitle,
                      deptCode:data.rows.item(i).deptCode,
                      extension: data.rows.item(i).extension,
                      altPhone: data.rows.item(i).altPhone,
                      email: data.rows.item(i).email
                    });
                }
                console.log(emps);
                this.nav.setRoot(PeoplePage,emps);
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});
      //let emps = this.appService.getDepartmentMembers(deptCode);


      //this.navCtrl.push(PeoplePage,emps);
      //this.nav.setRoot(PeoplePage,emps);
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
