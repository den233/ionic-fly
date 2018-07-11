import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";

@IonicPage({
  name: "bonus",
  segment: "bonus",
  defaultHistory: []
})
@Component({
  selector: "page-bonus",
  templateUrl: "bonus.html"
})
export class BonusPage {
  wallet:any;
  showNull: boolean;
  bonus = {
    all: "",
    week: ""
  };
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {}

  // 初始化loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  ionViewDidEnter() {
    this.loadWallet();
    this.loadBonusAll();
    this.loadBonusWeek();
  }

  goBack() {
    this.navCtrl.popToRoot();
  }

  // goCart() {
  //   this.appCtrl.getRootNav().push("tabs", { index: 2 });
  // }

  loadWallet() {
    let loading = this.createLoading();
    this.commonService
      .wallet({
        strAction: "getAppBankbookBalances"
      })
      .subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          if (data.statusCode == 0) {
            let arr = data.body['data'] || [];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]["BANKBOOK_TYPE"] == "1") {
                this.wallet = arr[i].BALANCE ? Number(arr[i].BALANCE || '0').toFixed(2) : '0';
              }
            }
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          loading && loading.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
      );
  }

  loadBonusAll() {
    this.commonService
      .home({
        strAction: "getAppAllBonusCalcs"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            let result = data.body || [];
            if(result && result.length){
              this.bonus.all = result[0]['BONUS_PV'] ? Number(result[0]['BONUS_PV'] || '0').toFixed(2) : '0';
            }
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  loadBonusWeek() {
    this.commonService
      .home({
        strAction: "getAppAllweekBonusCalcs"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            let result = data.body || [];
            if(result && result.length){
              this.bonus.week = result[0]['BONUS_PV'] ? Number(result[0]['BONUS_PV'] || '0').toFixed(2) : '0';
            }
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  /**
   * 奖金明细
   */
  bonusDetail() {
    this.navCtrl.push("bonusDetail");
  }
  /**
   * 奖金交易明细
   */
  tradeDetail() {
    this.navCtrl.push("bonusTradeDetail");
  }

  /**
   * 提现
   */
  cash() {
    this.navCtrl.push("bonusCash");
  }

    /**
     * 提现取现
      */
  cancelBonus(){
    this.navCtrl.push("bonusCancel");
  }
}
