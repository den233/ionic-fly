import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , App} from 'ionic-angular';
import { CommonService } from "../../../providers/common.service";

/**
 * Generated class for the BackfillAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "backfillAccount",
  segment: "backfillAccount",
  defaultHistory: []
})
@Component({
  selector: 'page-backfill-account',
  templateUrl: 'backfill-account.html',
})
export class BackfillAccountPage {

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
                          if (arr[i].VALUE_TITLE == "电子钱包账户") {
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
