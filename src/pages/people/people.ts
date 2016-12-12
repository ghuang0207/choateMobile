import { Component } from '@angular/core';
import { AppService } from '../../app/app.service';
import {CallNumber, SQLite} from 'ionic-native';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, MenuController,LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html'//,
  //providers:[AppService]
})
export class PeoplePage {
        searchTerm: string = "";
        allEmployees:any = [];
        employees: any = [];
        errorMessage: any;
        loadingComplete = 0;
        loader:any;
        hasFavorites: boolean = true;
        allEmployeeLength:number = 0;
        person: any;
        personTimer : any;
        profileLoaded: boolean=false;
        peopleTimer : any;
        peopleLoaded: boolean=false;

  constructor(private menuCtrl: MenuController, public storage:Storage ,public navCtrl: NavController, public appService: AppService, private navParams: NavParams, public loadingCtrl:LoadingController ) {
      if (navParams.data.length){
        if(navParams.data.length > 0){
            this.employees = navParams.data;
            this.allEmployees = navParams.data;
            this.hasFavorites = true;    
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
        this.personTimer = setInterval(()=> this.assignPerson(),2000);
        this.peopleTimer = setInterval(()=> this.assignPeople(),2000);
        //appService.getPeopleLogin().subscribe(res=>{console.log(res);this.person=res;})
        
    }
    
    public assignPerson(){
        
        this.person = this.appService.profile;
        if(this.appService.profileLoaded == true){
            this.profileLoaded = true;
            // When error from service look at Local storage
            if (!this.person)
            {
                this.person= {};
                this.storage.get("fullName").then((val)=>this.person.fullName = val);
                this.storage.get("department").then((val)=>this.person.department = val);
                this.storage.get("tkid").then((val)=>this.person.tkid=val);
                this.storage.get("extension").then((val)=>this.person.extension=val);
                this.storage.get("jobTitle").then((val)=>this.person.jobTitle=val);
                this.storage.get("hasPhoto").then((val)=>this.person.hasPhoto = val);
                this.appService.profile = this.person;
            }
            //When no profile update local storage to null
            else if(this.person == "no profile"){
                this.storage.set('fullName',null);
                this.storage.set('department',null);
                this.storage.set('jobTitle',null);
                this.storage.set('extension',null);
                this.storage.set('tkid',null);
                this.storage.set('hasPhoto',null);
                this.person = null;
            }
            //When service returns value update local storage with new values
            else{
                this.storage.set('fullName',this.person.fullName);
                this.storage.set('department',this.person.department);
                this.storage.set('jobTitle',this.person.jobTitle);
                this.storage.set('extension',this.person.extension);
                this.storage.set('tkid',this.person.tkid);
                this.storage.set('hasPhoto',this.person.hasPhoto);
            }
            
            this.stopPersonInterval();
        }

    }
    public stopPersonInterval(){
        clearInterval(this.personTimer);
    }

    public assignPeople(){
        
        //this.person = this.appService.profile;
        this.allEmployeeLength = this.appService.allEmployees.length;
        if(this.appService.peopleLoaded == true){
            this.peopleLoaded = true;
            this.stopPeopleInterval();
        }

    }
    public stopPeopleInterval(){
        clearInterval(this.peopleTimer);
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

    }

  itemSelected(item){
      
  }
}
