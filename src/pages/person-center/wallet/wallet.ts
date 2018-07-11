import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams , App} from 'ionic-angular';
import { CommonService } from "../../../providers/common.service";

@IonicPage({
    name: "wallet",
    segment: "wallet",
    defaultHistory: []
})
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  public wallet = 0;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private appCtrl:App,
      public commonService: CommonService) {
  }

  ionViewDidLoad() {
        this.loadWallet();
  }

  loadWallet() {
    this.commonService
        .wallet({
            strAction: "getAppBankbookBalances"
        })
        .subscribe(
            data => {
                if (data.statusCode == 0) {
                    let arr = data.body['data'] || [];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].VALUE_TITLE == "现金账户") {
                            this.wallet = arr[i].BALANCE;
                        }
                    }
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
  }

  chargeBalance(){
      this.navCtrl.push('chargeBalance',{
          money:this.wallet
      });
  }

  goBack(){
      this.navCtrl.popToRoot();
  }


  tradeDetail(){
    this.navCtrl.push('walletDetail');
  }



}
