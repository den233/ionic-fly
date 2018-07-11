import { Component } from '@angular/core';
import { IonicPage, ViewController,NavParams } from 'ionic-angular';

@IonicPage({
    name: "tradePopover",
    segment: "tradePopover",
    defaultHistory: []
})
@Component({
  selector: 'page-wallet-trade-popover',
  templateUrl: 'wallet-trade-popover.html',
})
export class WalletTradePopoverPage {

    callback: any;
    timeType: string;

    constructor(
        public viewCtrl: ViewController,
        private navParams : NavParams
    ){
        this.callback = this.navParams.get('cb');
        this.timeType = this.navParams.get('timeType');
        console.log(this.timeType);
    }

    radioChange(){
        if(this.timeType){
            let data = {
                name:'',
                value: this.timeType
            }
            switch(this.timeType){
                case '7':
                    data.name = '最近一周';
                    break;
                case '30':
                    data.name = '最近一月';
                    break;
                default:
                    data.name = '最近三月';
                    break;
            }
            this.callback(data);
            this.viewCtrl.dismiss();
        }

    }

}
