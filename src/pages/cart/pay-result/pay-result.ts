import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';

@IonicPage({
    name: "payResult",
    segment: "payResult",
    defaultHistory: []
})
@Component({
  selector: 'page-pay-result',
  templateUrl: 'pay-result.html',
})
export class PayResultPage {

    isOk: boolean = true;
    feedback = "付款成功";
    tip = '付款成功';
    pv;
    money;

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public commonService: CommonService,
        public viewCtrl: ViewController,
    ) {
        let code = this.navParams.data;
        console.log(code)
        if(code.code){
            this.isOk = true;
            this.pv = code.pv;
            this.money = code.money;
            this.tip = '付款成功';
        }else{
            this.isOk = false;
            this.tip = '付款失败';
        }
    }

    // home
    goHome(){
        this.navCtrl.push('tabs',{index: 0});
    }

    goOrder(){
        // this.navCtrl.push()
    }

}
