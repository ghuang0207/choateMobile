import { Component } from '@angular/core';
import { AppService } from '../../app/app.service';
import {CallNumber, SQLite} from 'ionic-native';
import {Observable} from 'rxjs/Rx';
import { NavController, NavParams, MenuController,LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html'//,
  //providers:[AppService]
})
export class PeoplePage {
    items = [
        {
            Name:"Aditya",
            JobTitle: "Software Developer Co-op",
            Extension: "4007"
        }, 
        {
            Name:"George",
            JobTitle: "Software Architect",
            Extension: ""
        }
        ];
        searchTerm: string = "";
        allEmployees:any = [];
        employees: any = [];
        errorMessage: any;
        loadingComplete = 0;
        loader:any;
        hasFavorites: boolean = true;
        allEmployeeLength:number = 0;
        person: any;
        timer : any;

  constructor(private menuCtrl: MenuController  ,public navCtrl: NavController, public appService: AppService, private navParams: NavParams, public loadingCtrl:LoadingController ) {
      if (navParams.data.length){
        if(navParams.data.length > 0){
            this.employees = navParams.data;
            this.allEmployees = navParams.data;
            this.hasFavorites = true;    
            this.allEmployeeLength = appService.allEmployees.length;
        }
            
        else{
            this.loadingComplete = 1;
            this.hasFavorites = false;
        }
      }
      else{
          this.employees= [];
          this.hasFavorites = false;
      }
        this.timer = setInterval(()=> this.assignPerson(),2000);
        //appService.getPeopleLogin().subscribe(res=>{console.log(res);this.person=res;})
        
    }
    
    public assignPerson(){
        
        this.person = this.appService.profile;
        console.log(this.person);
        if(this.appService.profileLoaded == true){
            console.log("Profile");
            console.log(this.appService.profile);
            this.stopInterval();
        }

    }
    public stopInterval(){
        clearInterval(this.timer);
    }

     public doRefresh(refresher) {
            console.log('Begin async operation', refresher);
            let db = new SQLite();            
             db.openDatabase({name: "data.db", location: "default"}).then(() => {
                this.refreshSqliteDb(db);
             }, (error) => {
                 console.log(error);
             }); 
            setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
            }, 2000);
    }

  refreshSqliteDb(db){
      this.appService.getPeople().subscribe(
        employees  => {
          this.employees = employees;
          //console.log(this.employees);
          db.executeSql("DELETE FROM people", []).then((data) => {
            this.loader = this.loadingCtrl.create({content:"Syncing Database please wait..."});
            this.loader.present();
            
            for(var i = 0; i < employees.length; i++) {
                this.loadDataIntoSqlite(employees[i],db);
            } 
            setTimeout(()=> {this.loader.dismiss()},5000);
            
             // this.loader.dismiss();
          }, (error) => {
              //Delete error 
              //this.getDepartmentMembers("Fav");
              console.log("Called Fav ERROR: " + JSON.stringify(error));
          });},
          //Service error
        error =>  {this.errorMessage = <any>error; console.log("Error Service");});
  }
  loadDataIntoSqlite(person, db){
      db.executeSql(`INSERT INTO 
                    people (tkid,fullName,email,department,jobTitle,extension,altPhone,departmentCode,hasPhoto) 
                        VALUES (?,?,?,?,?,?,?,?,?)
                    `, [person.tkid,person.fullName,person.email,person.department,person.jobTitle,person.extension,person.altPhone,person.departmentCode,person.hasPhoto]).then((data) => {
                        console.log("INSERTED: " + JSON.stringify(data));
                    }, (error) => {
                        console.log("ERROR: " + JSON.stringify(error));
                });

  }


    public search(val){
        if(val.length > 0){
            this.employees = this.allEmployees.filter(item => item.fullName.indexOf(val)>=0);
            console.log(this.employees);
        }
        else {
            this.employees = this.allEmployees;
        }
    }
    favorite(item){
        
        this.appService.toggleFavorite(item);
        
        item.isFavorite = !item.isFavorite;
        
        
        

        //this.employees = [];
        /*let db = new SQLite();
       
      db.openDatabase({name: "data.db", location: "default"}).then(() => {
          db.executeSql("SELECT * FROM people WHERE tkid in (SELECT tkid from favorites)", []).then((data) => {
            console.log("Refresh data", data);
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.employees.push({
                      tkid: data.rows.item(i).tkid,
                      fullName: data.rows.item(i).fullName,
                      department: data.rows.item(i).department,
                      jobTitle: data.rows.item(i).jobTitle,
                      departmentCode:data.rows.item(i).departmentCode,
                      extension: data.rows.item(i).extension,
                      altPhone: data.rows.item(i).altPhone,
                      email: data.rows.item(i).email,
                      hasPhoto: data.rows.item(i).hasPhoto
                    });
                }
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});*/
        //this.employees.splice(item,1);
    }



    call(number){
        let tempNumber: string = number;
        if (tempNumber.length > 0){
            if (tempNumber.length == 4)
                tempNumber = '(617) 248-'+tempNumber;
            console.log(tempNumber);

            CallNumber.callNumber(tempNumber, true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
        }
    }
    
  ionViewDidLoad() {
      console.log("subscribe");
       /*this.appService.profileObservable.subscribe(result=>{
           this.person=result;
           console.log(result);
        });*/
        //this.obs = this.appService.getProfile(); 
        console.log("Init for people");
        
        //setTimeout(()=>{this.obs.subscribe(res=>{console.log(res);})},10000);
        /*this.appService.getProfile().subscribe(
            res => {
                console.log("mess");
                console.log(res);
                //console.log(res);
            }
        );*/
        /*.subscribe(response => {
            this.person=response;
            console.log("load bview");
            console.log(response);
        });        
        //console.log(this.person);
        console.log("from service");

        //console.log(this.appService.profile);
      /*if (!this.navParams.data.length)
        this.appService.getPeople().subscribe(
                       employee  => { this.employees=employee;},
                       error =>  this.errorMessage = <any>error);*/
    }

  itemSelected(item){
      //console.log(item);
  }
}
