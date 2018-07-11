/**
 * create by pangmiaoran
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { CommonService } from '../../../../providers/common.service';

@IonicPage({
  name: "feedBack",
  segment: "feedBack",
  defaultHistory: []
})
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html'
})
export class FeedBackPage {
  isOk: boolean;
  isFail: boolean;
  title: string;
  tip = '';
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController,
  ) {
    let result = navParams.get('isOk');
    this.title = navParams.get('title');
    this.tip =  navParams.get('tip');
    if(result){
      this.isOk = true;
    }else{
      this.isFail = true;
    }
  }
  
  // home
  goHome(){
    this.navCtrl.push('personInfo');
  }
  
}
