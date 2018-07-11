import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
    name: "orderSearch",
    segment: "orderSearch",
    defaultHistory: []
})
@Component({
  selector: 'page-order-search',
  templateUrl: 'order-search.html',
})
export class OrderSearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSearchPage');
  }

}
