import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";
@IonicPage({
  name: "homeMsgDetial",
  segment: "homeMsgDetial",
  defaultHistory: []
})
@Component({
  selector: "page-home-msg-detial",
  templateUrl: "home-msg-detial.html"
})
export class HomeMsgDetialPage {
  item = {
    AA_NO: "",
    ANNO_CLASS_NO: "",
    CHECKER_NAME: "",
    CHECK_TIME: "",
    CHECK_USER_NO: "",
    COMPANY_CODE: "",
    CONTENT: "",
    CREATE_TIME: "",
    END_TIME: "",
    ISSUER_NAME: "",
    ISSUE_USER_NO: "",
    START_TIME: "",
    STATUS: "",
    SUBJECT: ""
  };
  infoType = "";
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {
    this.item.AA_NO = navParams.get("id") || "";
    this.infoType = navParams.get("infoType") || "";
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
      duration: 1500,
      position: "middle",
      cssClass: "text-center"
    });
    toast.present(toast);
  }
  ionViewDidLoad() {
    this.loadData();
  }

  // load
  loadData() {
    let self = this;
    let loading = this.createLoading();
    this.commonService
      .home({
        strAction: "getAppAnnounceDeatil2",
        aano: this.item.AA_NO
      })
      .subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          if (data.statusCode == 0) {
            self.item = data.body[0] || {};
            document.getElementById(
              "msg-content"
            ).innerHTML = self.item["CONTENT"];
            console.log(self.item);
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
