import { Component } from '@angular/core';
import { AppService } from '../../app/app.service';
import {CallNumber} from 'ionic-native';
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

        employees: any = [];
        errorMessage: any;
        loadingComplete = 0;

  constructor(private menuCtrl: MenuController  ,public navCtrl: NavController, public appService: AppService, private navParams: NavParams ) {
      if (navParams.data.length){
        if(navParams.data.length > 0)
            this.employees = navParams.data;
        else
            this.loadingComplete = 1;
      }
      else{
          this.employees= [];
      }
        
        
    }
    favorite(item){
        this.appService.addPersonToFavorit(item);
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
