import { Component } from '@angular/core';
import { AppService } from '../../app/app.service';
import {CallNumber, SQLite} from 'ionic-native';
import { NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
  providers:[AppService]
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
        hasFavorites: boolean = true;

  constructor(private menuCtrl: MenuController  ,public navCtrl: NavController, public appService: AppService, private navParams: NavParams ) {
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

        this.appService.addPersonToFavorit(item);
        this.employees = [];
        let db = new SQLite();
       
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
                      email: data.rows.item(i).email
                    });
                }
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
         },
       (error) => {console.log(error)});
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
      /*if (!this.navParams.data.length)
        this.appService.getPeople().subscribe(
                       employee  => { this.employees=employee;},
                       error =>  this.errorMessage = <any>error);*/
    }

  itemSelected(item){
      //console.log(item);
  }
}
