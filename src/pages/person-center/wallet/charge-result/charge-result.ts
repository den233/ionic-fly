import { Component } from '@angular/core';
import { IonicPage,App,NavController, NavParams, ToastController,AlertController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { CommonService } from '../../../../providers/common.service';


@IonicPage({
    name: "chargeResult",
    segment: "chargeResult",
    defaultHistory: []
})

@Component({
  selector: 'page-charge-result',
  templateUrl: 'charge-result.html',
})
export class ChargeResultPage {

    registerResult:string = '充值成功';
    isOk:boolean = true;
    isFail:boolean = false;
    tip:string = '充值成功';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public appCtrl:App) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddMemderResultPage');
    }

    // back home
    goHome(){
        this.appCtrl.getRootNav().push('tabs');
    }

    gowallet(){
        this.navCtrl.push('wallet');
    }

}
