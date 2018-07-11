import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEV } from '../../../providers/config';

@IonicPage({
    name: "orderDetail",
    segment: "orderDetail",
    defaultHistory: []
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  public imgUrl = DEV.imgUrl;
  public allList = {
      'shoppings':[]
  };

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams) {

      this.allList = navParams.get('data');

      console.log(this.allList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');

  }

  goBack(){
      this.navCtrl.pop();
  }

}
