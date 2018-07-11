/**
 * create by pangmiaoran
 */
import { Component } from "@angular/core";
import { App, IonicPage,
  NavController,
  ToastController,
  LoadingController,
  ViewController,
  NavParams } from "ionic-angular";
  import { CommonService } from "../../../providers/common.service";

@IonicPage({
  name: "setting",
  segment: "setting",
  defaultHistory: []
})
@Component({
  selector: "page-setting",
  templateUrl: "setting.html"
})
export class SettingPage {
  bankNum = 0;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
    , public appCtrl: App) {}
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

  ngOnInit() {
    this.loadBank();
  }
  goBack() {
    this.appCtrl.getRootNav().push("tabs", { index: 3 });
  }
  // person detail
  goPersonInfo() {
    this.navCtrl.push("personInfo");
  }

  // login password
  goLoginPassword() {
    this.navCtrl.push("loginPassword");
  }

  // second password
  goSecondPassword() {
    this.navCtrl.push("secondPassword");
  }

  // address list
  goAddressList() {
    this.navCtrl.push("addressList");
  }

  goBankList() {
    this.navCtrl.push("bankList");
  }

  logout() {
    this.appCtrl.getRootNav().push('login');
    localStorage.removeItem('tokenid');
  }

  loadBank() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "getlistBank"
    };
    this.commonService.loginPwd(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          this.bankNum = (data.body || []).length;
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
}
