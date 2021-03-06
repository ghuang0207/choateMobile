import { Component, ViewChild } from '@angular/core';
import { Nav, LoadingController , NavController, MenuController, Platform } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import {PeoplePage} from '../people/people';
import {SQLite} from "ionic-native";

/*
  Generated class for the ContactsRoot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  
  templateUrl: 'contacts-root.html'//,
  //providers:[AppService]
})
export class ContactsRoot {
  @ViewChild(Nav) nav: Nav;
  employees: any = [];
  errorMessage: any;
  favTKIDs:any = [];
  loadingComplete:any = 0;
  status: string="";
  loader: any;

  rootPage: any = PeoplePage;
  constructor(public platform: Platform, private menuCtrl: MenuController ,public navCtrl: NavController, public appService: AppService, public loadingCtrl:LoadingController) {
    this.status = "checking database...";
    this.loader = loadingCtrl.create({content: this.status});
    this.loader.present();

    // init of the contact-root component
    platform.ready().then(() => {
      
          let db = new SQLite();
          db.openDatabase({name: "data.db", location: "default"}).then(() => {        
            // create people table if not exists
            this.status = "prepare people table...";    
            db.executeSql(`CREATE TABLE IF NOT EXISTS people (
                    tkid TEXT PRIMARY KEY, 
                    department TEXT,
                    fullName Text,
                    jobTitle TEXT,
                    extension TEXT,
                    email TEXT,
                    departmentCode TEXT,
                    altPhone TEXT,
                    hasPhoto INTEGER
                )`, {}).then((data) => {
                    console.log("People table is ready: ", data);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                });
            this.status = "prepare favorites table...";
            // create favorites table
            db.executeSql(`CREATE TABLE IF NOT EXISTS favorites (
                tkid TEXT PRIMARY KEY
            )`, {}).then((data) => {
                console.log("Favorites table is ready: ", data);
            }, (error) => {
                console.error("Unable to execute sql", error);
            });

            // test to see if there is data in the people table
            db.executeSql("SELECT tkid from people",[]).then((data) =>{
              console.log('init data',data);
              if(data.rows.length == 0)
              {
                //if no data, go on the internet and pull data from api.
                this.status = "fetching data from cloud...";
                // pull data
                this.refreshSqliteDb(db);
              }
              /*else
              {
                // otherwise, pull data directly from database
                this.status = "get data from table...";
                console.log("data from db");
                this.loadData(db);
              }*/
              },
                (error) =>{console.log("Error");});
            },
            //open db error
            (error) => {
              this.refreshSqliteDb(db);
              console.log(error);
            });


          this.loader.dismiss();
          this.loadingComplete = 1;
    });

    
  }

// this function will be called for pull-to-refresh
    public doRefresh() {          
        let db = new SQLite();            
          db.openDatabase({name: "data.db", location: "default"}).then(() => {
            this.refreshSqliteDb(db);                
            this.getDepartmentMembers("All");
          }, (error) => {
              console.log(error);
          }); 
    }

 // retired for now: pull data from sql to an array
 /*
  loadData(db){
    db.executeSql("SELECT * from people",[]).then((data) =>{
          this.employees = [];
          console.log("load data from db ", data);
            for(var i = 0; i < data.rows.length; i++) {
                this.employees.push({
                  tkid: data.rows.item(i).tkid,
                  fullName: data.rows.item(i).fullName,
                  department: data.rows.item(i).department,
                  jobTitle: data.rows.item(i).jobTitle,
                  departmentCode: data.rows.item(i).departmentCode,
                  extension: data.rows.item(i).extension,
                  altPhone: data.rows.item(i).altPhone,
                  email: data.rows.item(i).email,
                  hasPhoto: data.rows.item(i).hasPhoto
                });
            }
        },
          (error) =>{console.log("Error");});
  } */

 // fetch data from api
  refreshSqliteDb(db){
      this.appService.getPeople().subscribe(
        employees  => {
          // this is the local array that stores all the emp objects
          this.employees = employees;
          //console.log(this.employees);
          db.executeSql("DELETE FROM people", []).then((data) => {
            this.loader = this.loadingCtrl.create({content:"Syncing Database please wait..."});
            this.loader.present();
             // insert fetched data one at a time into sql
              for(var i = 0; i < employees.length; i++) {
                this.loadDataIntoSqlite(employees[i],db);
              } 
              setTimeout(()=>{
                  this.loader.dismiss();
              },10000);
            
             
          }, (error) => {
              //Delete error 
              this.getDepartmentMembers("Fav");
              console.log("Called Fav ERROR: " + JSON.stringify(error));
          });},
          //Service error
        error =>  {this.errorMessage = <any>error; console.log("Error Service");});
  }

//insert fetched data into sql
  loadDataIntoSqlite(person, db){
      db.executeSql(`INSERT INTO 
                    people (tkid,fullName,email,department,jobTitle,extension,altPhone,departmentCode,hasPhoto) 
                        VALUES (?,?,?,?,?,?,?,?,?)
                    `, [person.tkid,person.fullName,person.email,person.department,person.jobTitle,person.extension,person.altPhone,person.departmentCode,person.hasPhoto.toString()]).then((data) => {
                        console.log("INSERTED: " + JSON.stringify(data));
                    }, (error) => {
                        console.log("ERROR: " + JSON.stringify(error));
                });

  }
  //helper function to build emps array
  buildEmps(data){
    let emps=[];
                for(var i = 0; i < data.rows.length; i++) {
                    emps.push({
                      tkid: data.rows.item(i).tkid,
                      fullName: data.rows.item(i).fullName,
                      department: data.rows.item(i).department,
                      jobTitle: data.rows.item(i).jobTitle,
                      departmentCode:data.rows.item(i).departmentCode,
                      extension: data.rows.item(i).extension,
                      altPhone: data.rows.item(i).altPhone,
                      email: data.rows.item(i).email,
                      hasPhoto: data.rows.item(i).hasPhoto,
                      isFavorite:(data.rows.item(i).fav == null)?0:1
                    });
                }
      return emps;
  }

  getDepartmentMembers(deptCode : string){
    this.loader = this.loadingCtrl.create({content:"Loading"});
    this.loader.present();
    if(deptCode=="Fav"){
      let db = new SQLite();
       // get my contacts
       db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql(`SELECT people.tkid,people.fullName, people.extension, people.email,people.altPhone,
              people.jobTitle,people.department,people.departmentCode,people.hasPhoto,favorites.tkid as fav 
          FROM favorites 
          JOIN people ON favorites.tkid = people.tkid`, []).then((data) => {
            if(data.rows.length > 0) {
              // to build the emp array for displaying
                let emps = this.buildEmps(data);
                setTimeout(()=>this.loader.dismiss(),2000);
                this.nav.setRoot(PeoplePage,emps);
            }
            else{
              // if the user haven't set any favorites
              setTimeout(()=>this.loader.dismiss(),2000);
              let emps = [];
              this.nav.setRoot(PeoplePage,emps);              
            }
        }, (error) => {
          setTimeout(()=>this.loader.dismiss(),2000);
            this.nav.setRoot(PeoplePage,this.employees);
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {
         this.nav.setRoot(PeoplePage, this.employees);
         console.log(error);
        });

      //this.nav.setRoot(PeoplePage,emps);
    }
    else if (deptCode == 'All'){
      // get department contacts
      if (this.appService.allEmployees.length > 0){
          setTimeout(()=>this.loader.dismiss(),5000);
          this.nav.setRoot(PeoplePage, this.appService.allEmployees);
      }
      // If all employees not yet loaded in service
      else{
          let db = new SQLite();
    
          db.openDatabase({name: "data.db", location: "default"}).then(() => {
              db.executeSql(`SELECT people.*,favorites.tkid as fav 
                FROM people 
                LEFT JOIN favorites on people.tkid=favorites.tkid`, []).then((data) => {
                //console.log(data);
                if(data.rows.length > 0) {
                  let emps = this.buildEmps(data);
                    setTimeout(()=>this.loader.dismiss(),2000);
                    this.nav.setRoot(PeoplePage,emps);
                    
                }
                else{
                  setTimeout(()=>this.loader.dismiss(),2000);
                }
            }, (error) => {
              setTimeout(()=>this.loader.dismiss(),2000);
                this.nav.setRoot(PeoplePage,this.employees);
                console.log("ERROR: " + JSON.stringify(error));
            });
            },
          (error) => {console.log(error)});
      }
    }
    else if (deptCode == 'SEC'){
      // get department contacts
      let db = new SQLite();
      
       
      db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql(`SELECT people.*,favorites.tkid as fav 
            FROM people 
            LEFT JOIN favorites on people.tkid=favorites.tkid 
            WHERE people.departmentCode like (?)`, ["SEC%"]).then((data) => {
            console.log(data);
            if(data.rows.length > 0) {
              //let emps=[];
              let emps = this.buildEmps(data);
                setTimeout(()=>this.loader.dismiss(),2000);
                this.nav.setRoot(PeoplePage,emps);
                
            }
            else{
              setTimeout(()=>this.loader.dismiss(),2000);
            }
        }, (error) => {
          setTimeout(()=>this.loader.dismiss(),2000);
            this.nav.setRoot(PeoplePage,this.employees);
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});
    }
    else {
      // get department contacts
      let db = new SQLite();
       
      db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql(`SELECT people.*,favorites.tkid as fav  
            FROM people 
            LEFT JOIN favorites on people.tkid=favorites.tkid 
            WHERE people.departmentCode = (?)`, [deptCode]).then((data) => {
            console.log(data);
            if(data.rows.length > 0) {
              let emps = this.buildEmps(data);
                setTimeout(()=>this.loader.dismiss(),2000);
                this.nav.setRoot(PeoplePage,emps);
            }
            else{
              setTimeout(()=>this.loader.dismiss(),2000);
            }
        }, (error) => {
          setTimeout(()=>this.loader.dismiss(),2000);
            this.nav.setRoot(PeoplePage,this.employees);
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});
    }
    
  }


  ionViewDidLoad() {
    console.log('Contact Root: Set home page.');
    this.platform.ready().then(() => {
      // load the default page
      this.getDepartmentMembers('Fav');
    });
  }

  ionViewDidEnter(){
    // to ensure the slide menu work
    this.menuCtrl.swipeEnable(false,"contactsMenu");
    this.menuCtrl.enable(true, "contactsMenu");
    this.menuCtrl.enable(false, "dailyMenu");
    console.log(this.rootPage.employees);
  }

}
