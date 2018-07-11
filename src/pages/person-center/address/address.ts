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
  name: "addressList",
  segment: "addressList",
  defaultHistory: []
})
@Component({
  selector: "page-address-list",
  templateUrl: "address.html"
})
export class AddressListPage {
  items = [];
  showNull: boolean;
  pagination = {
    page: 0,
    size: 10,
    totalCount: 0
  }; // 分页
  source: string;
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public commonService: CommonService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
  ) {
    this.source = navParams.get("source") || "";
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

  ionViewDidEnter() {
    this.loadData();
  }

  loadData() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "getAppProductAddress",
      size: 10000,
      start: 0
    };
    this.commonService.order(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let body = data.body;
          this.pagination.totalCount = body["total"] || 0;
          let result = body["data"] || [];
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

  
  goBack() {
    if (this.source == 'confirmOrder') {
      this.viewCtrl.dismiss();
    } else {
      this.navCtrl.push("setting");
    }
  }

  goAddAddress(id?: any) {
    console.log('地址列表页source:',this.source);
    if (this.source) {
      let addressModal = this.modalCtrl.create("addressEdit", {
        source: this.source,
        id: id
      });
      addressModal.onDidDismiss(data => {
        if (data) {
          this.source = data;
        }
        this.loadData();
      });
      addressModal.present();
    } else {
      this.navCtrl.push("addressEdit", { id: id });
    }
  }

  selectAddress(item) {
    console.log(item);
    if (!this.source) {
      return;
    }
    this.viewCtrl.dismiss(item);
  }
}
