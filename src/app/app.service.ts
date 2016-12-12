import { Injectable } from '@angular/core';
//import { RequestOptions, Request, Response, RequestMethod, Headers, Http, URLSearchParams } from '@angular/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {SQLite} from "ionic-native"; // for SQLite
import { Storage } from '@ionic/storage';


//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';

// test
@Injectable()
export class AppService {
    employees : any = [];
    public allEmployees : any = [];
    public device: any;
    public db:SQLite;
    //Initialize the logged in user
    constructor(private http: Http, public storage: Storage) {
    }
    
    // by george - for reference
    private url:string = 'http://azlabchoate20160421.azurewebsites.net/api/person';
    private data: any;
    private observable: Observable<any>;

    // logged-in person profile
    private profileUrl = 'http://azlabchoate20160421.azurewebsites.net/api/profile/';
    public profile: any;
    public profileLoaded: boolean = false;
    public peopleLoaded: boolean = false;
    // todo: an api to receive device object and return user profile
    

    // SQLite section for favorit contacts
    public database: SQLite = null;
    public favoritPeople: any = [];

    public getLoginProfile(uuid){
        console.log("geting profile");
        //this.profileObservable = 
        this.profile = this.http.get(this.profileUrl+uuid).subscribe(response =>  {
            this.profile = response.json();
            this.profileLoaded = true;
            /*this.storage.set('fullName',this.profile.fullName);
            this.storage.set('department',this.profile.department);
            this.storage.set('jobTitle',this.profile.jobTitle);
            this.storage.set('extension',this.profile.extension);
            this.storage.set('tkid',this.profile.tkid);
            this.storage.set('hasPhoto',this.profile.hasPhoto);
            console.log("From Storage");
            this.storage.get('fullName').then((val) => {
                    console.log('Your name is', val);
                });*/
            //this.profile = response.json();
          },
          (err)=>{console.log("error thrown");this.profile=null;this.profileLoaded = true;console.log(err);});
    }

    public setAllEmployees(){
    let db = new SQLite();
    db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql("SELECT people.*,favorites.tkid as fav FROM people LEFT JOIN favorites on people.tkid=favorites.tkid", []).then((data) => {
            console.log(data);
            if(data.rows.length > 0) {
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
                      isFavorite: (data.rows.item(i).fav == null)?0:1
                    });
                }
                this.allEmployees = emps;
                this.peopleLoaded = true;
            }
           
        }, (error) => {
            this.peopleLoaded = true;
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});

    }

    public getDB(){
        return this.db;
    }

    public setDB(db){
        this.db = db;
    }

    public getAllEmployees(){
        return this.allEmployees;
    }

    public getDeviceInfo(){
        return this.device;
    }
    public setDeviceInfo(d){
        this.device = d;
        if (!this.device.serial){
            this.device.serial = "N/A";
        }
        console.log("device info set");
        console.log(this.device);
        let auditInfo = {};
        auditInfo["UUID"] = this.device.uuid;
        auditInfo["Platform"] = this.device.platform;
        auditInfo["Model"] = this.device.model;
        auditInfo["Serial"] = this.device.serial;
        auditInfo["OSVersion"] = this.device.version;
        auditInfo["AppVersion"] = this.device.appversion;
        //Call the post
        this.http.post(this.profileUrl,auditInfo).subscribe((res) =>{
                console.log("Audit Success");
        },(err)=>{console.log("Audit Error");console.log(err)});
    }
    

    public toggleFavorite(person){
      console.log(person);
       let db = new SQLite();
       db.openDatabase({name: "data.db", location: "default"}).then(() => {
                db.executeSql("SELECT tkid FROM favorites WHERE tkid=(?)", [person.tkid]).then((data) => {
                    if(data.rows.length > 0) {
                        db.executeSql(`DELETE FROM 
                                favorites WHERE tkid=(?)
                                `, [person.tkid]).then((data) => {
                                    console.log("Deleted: " + JSON.stringify(data));
                                }, (error) => {
                                    console.log("ERROR: " + JSON.stringify(error));
                        });
                    }
                    else{
                        db.executeSql(`INSERT INTO 
                            favorites (tkid) 
                                VALUES (?)
                            `, [person.tkid]).then((data) => {
                                console.log("INSERTED: " + JSON.stringify(data));
                            }, (error) => {
                                console.log("ERROR: " + JSON.stringify(error));
                        });

        }
        },
            (error) => {console.log(error);}
            )
        }, (error) => {
            console.error("Unable to open database", error);
        });
    }

    public removePersonFromFavorit(tkid){
        /*if(this.database==null){
          this.InitSQLite();
        }
        this.database.executeSql("DELETE FROM people WHERE tkid = (tkid)", []).then((data) => {
            console.log("removed: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
        });*/
    }

    // end SQLite section for favorit contacts

    public getPeople() {
      if(this.data) {
        // if `data` is available just return it as `Observable`
        console.log("data from cached data");
        return Observable.of(this.data); 
      } else if(this.observable) {
        // if `this.observable` is set then the request is in progress
        // return the `Observable` for the ongoing request
        console.log("from observable");
        return this.observable;
      } else {
        
        // create the request, store the `Observable` for subsequent subscribers
        this.observable = this.http.get(this.url)
        .map(response =>  {
          // when the cached data is available we don't need the `Observable` reference anymore
          this.observable = null;

          if(response.status == 400) {
            return "FAILURE";
          } else if(response.status == 200) {
            this.data = response.json();
            
            return this.data;
          }
          // make it shared so more than one subscriber can get the result
        })
        .share();
        console.log("data from server");
        return this.observable;
      }
    }

    // Function dependent on getPeople.
    public getDepartmentMembers(deptCode:string){
      
      let tempEmployees = [];
      if (this.data.length)
        tempEmployees = this.data.filter(function(obj){
          if(obj.departmentCode == deptCode) return true;
          return false;
        });
      return tempEmployees;
    }
}