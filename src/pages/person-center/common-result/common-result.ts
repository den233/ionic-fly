import { Component } from '@angular/core';
import { App,IonicPage, NavController,
  NavParams,
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
  ViewController } from 'ionic-angular';
  import { CommonService } from "../../../providers/common.service";

@IonicPage({
  name: "commonResult",
  segment: "commonResult",
  defaultHistory: []
})
@Component({
  selector: 'page-common-result',
  templateUrl: 'common-result.html',
})
export class CommonResultPage {
  registerResult:string = '转账完成';
  isOk:boolean = true;
  tip:string = '转账成功！';
  transferType = '';
  transferMoney = '';
  payObj = {
    bonus: "",
    wallet: ""
  };
  source:string = 'new';//注册会员new 激活old

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController) {
      this.transferType = navParams.get('transferType') || '';
      this.transferMoney = navParams.get('transferMoney') || '0';
  }

  // loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }

  // toast
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  ionViewDidLoad() {
    this.loadWallet();
  }

  // 加载钱包、奖金金额
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
            let arr = data.body.data || [];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]["BANKBOOK_TYPE"] == 3) {
                // 电子钱包账户
                this.payObj.wallet = arr[i].BALANCE;
              }
              if (arr[i]["BANKBOOK_TYPE"] == 1) {
                // 奖金账户
                this.payObj.bonus = arr[i].BALANCE;
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

  // back home
  goHome(){
    this.appCtrl.getRootNav().push("tabs", { index: 3 });
  }


}
