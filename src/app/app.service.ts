import { Injectable } from '@angular/core';
//import { RequestOptions, Request, Response, RequestMethod, Headers, Http, URLSearchParams } from '@angular/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {SQLite} from "ionic-native"; // for SQLite


//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';

// test
@Injectable()
export class AppService {
    employees : any = [];
    //Initialize the logged in user
    constructor(private http: Http) {
    }

    
    
    // by george - for reference
    private url:string = 'http://azlabchoate20160421.azurewebsites.net/api/person';
    private data: any;
    private observable: Observable<any>;

    // SQLite section for favorit contacts
    public database: SQLite = null;
    public favoritPeople: any = [];


    public addPersonToFavorit(person){
      console.log(person);
       let db = new SQLite();
       db.openDatabase({name: "data.db", location: "default"}).then(() => {
         
           /* db.executeSql("SELECT tkid FROM people WHERE tkid=(?)", [person.tkid]).then((data) => {
            if(data.rows.length > 0) {
                db.executeSql(`DELETE FROM 
                        people WHERE tkid=(?)
                        `, [person.tkid]).then((data) => {
                            console.log("INSERTED: " + JSON.stringify(data));
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error));
                });
            }
            else{
                db.executeSql(`INSERT INTO 
                    people (tkid,fullName,email,department,jobTitle,extension,altPhone) 
                        VALUES (?,?,?,?,?,?,?)
                    `, [person.tkid,person.fullName,person.email,person.department,person.jobTitle,person.extension,person.altPhone]).then((data) => {
                        console.log("INSERTED: " + JSON.stringify(data));
                    }, (error) => {
                        console.log("ERROR: " + JSON.stringify(error));
                });*/
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
            //console.log("transaction 2: "+ person.tkid);

            
            
        }, (error) => {
            console.error("Unable to open database", error);
        });
        /*
       this.database.executeSql("INSERT INTO people (tkid) VALUES (tkid)", []).then((data) => {
            console.log("INSERTED: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });*/
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

    /*public getFavorites(){
      let tempEmployees = [];
      let favTKIDs = this.getFavoritPeopleList();
      if (favTKIDs.length > 0)
        tempEmployees = this.data.filter(function(obj){
          return this.isFavorite(obj, favTKIDs);
        });
      return tempEmployees;
    }
     public isFavorite(employee, favTKIDs){
        for (var index in favTKIDs){
            if (favTKIDs[index].tkid == employee.tkid)
                return true;
        }
        return false;
    }*/

    /*private extractData(res: Response) {

        let body = res.json();
        this.employees = body;
        return body || { };
    }
    private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }*/
}