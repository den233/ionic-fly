import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  ViewController,
  ModalController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";

@IonicPage({
  name: "bankList",
  segment: "bankList",
  defaultHistory: []
})
@Component({
  selector: "page-bank-list",
  templateUrl: "bank.html"
})
export class BankListPage {
  items = [];
  showNull: boolean;
  source = "";
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public commonService: CommonService,
    
    public toastCtrl: ToastController
  ) {
    this.source = navParams.get("source") || "";
    console.log(this.source);
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadData() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "getlistBank"
    };
    this.commonService.loginPwd(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body || [];
          for (let i = 0; i < result.length; i++) {
            console.log(result[i]["BANKCARD"]);
            result[i]["BANKName"] = result[i]["BANKCARD"]
              ? this.formatAccount(result[i]["BANKCARD"])
              : "";
          }
          console.log(result);
          this.items = result;
          // 非空判断
          if (this.items.length > 0) {
            this.showNull = false;
          } else {
            this.showNull = true;
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

  formatAccount(str) {
    return str
      .replace(/^(\d{4})\d+(\d{3})$/, "$1************$2")
      .replace(/(\S{4})(?=\S)/g, "$1 ");
  }

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
  goBack() {
    if (this.source) {
      this.viewCtrl.dismiss();
    } else {
      this.navCtrl.push("setting");
    }
  }

  goBankEdit(bank?: any) {
    let params = {};
    if (bank) {
      params = {
        BANK: bank["BANK"],
        BANKADDRESS: bank["BANKADDRESS"],
        BANKCARD: bank["BANKCARD"],
        BANK_CITY: bank["BANK_CITY"],
        BANK_DISTRICT: bank["BANK_DISTRICT"],
        BANK_PROVINCE: bank["BANK_PROVINCE"],
        ID: bank["ID"]
      };
    }
    console.log('params',params);
    
    if (this.source) {
      let profileModal = this.modalCtrl.create("bankEdit", {
        source: this.source,
        bank: params
      });
      profileModal.onDidDismiss(data => {
        if (data) {
          this.source = data;
        }
      });
      profileModal.present();
    } else {
      this.navCtrl.push("bankEdit", {
        bank: params
      });
    }
  }

  selectBank(bank) {
    console.log(bank);
    console.log(this.source);
    if (!this.source) {
      return;
    }
    this.viewCtrl.dismiss({
      BANK: bank["BANK"],
      BANKADDRESS: bank["BANKADDRESS"],
      BANKCARD: bank["BANKCARD"],
      BANK_CITY: bank["BANK_CITY"],
      BANK_DISTRICT: bank["BANK_DISTRICT"],
      BANK_PROVINCE: bank["BANK_PROVINCE"],
      ID: bank["ID"]
    });
  }
}
