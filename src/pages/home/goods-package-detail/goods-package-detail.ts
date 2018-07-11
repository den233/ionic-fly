import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  App,
  Content,
  IonicPage,
  Slides,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";
import { DEV } from '../../../providers/config';

@IonicPage({
  name: "goodsPackageDetail",
  segment: "goodsPackageDetail",
  defaultHistory: []
})
@Component({
  selector: "page-goods-package-detail",
  templateUrl: "goods-package-detail.html"
})
export class GoodsPackageDetailPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  imgUrl = DEV.url;
  orderType: string = "";
  category = "";
  items = [];
  product = {
    UNI_NO: "",
    PRODUCT_NO: "",
    PRODUCT_NAME: "",
    QTY: "",
    FP_PRICE: "",
    FP_PV: "",
    MP_PRICE: "",
    MP_PV: ""
  };
  price: any;
  pv: any;
  isFirst:false;
  remark;
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {
   this.product = navParams.get("product") || "";
   console.log(this.product)
    if (this.product) {
      this.product["QTY"] = "1";
      if (this.orderType == "30") {
        this.price = this.product["MP_PRICE"];
        this.pv = this.product["MP_PV"];
      } else if (this.orderType == "20") {
        this.price = this.product["FP_PRICE"];
        this.pv = this.product["FP_PV"];
      } else if (!this.orderType) {
        if (Number(this.product["MP_PRICE"]) >= Number(this.product["FP_PRICE"])) {
          this.price = this.product["MP_PRICE"];
          this.pv = this.product["MP_PV"];
        } else {
          this.price = this.product["FP_PRICE"];
          this.pv = this.product["FP_PV"];
        }
      }
    }
    this.category = navParams.get("category") || "";
    this.orderType = navParams.get("orderType") || "";
    this.remark = navParams.get("remark") || "";
    this.isFirst = navParams.get("first") || false;
    if(navParams.get("source") == 'home'){
			this.product.UNI_NO = navParams.get("packageId") || '';
		}
  }

  ionViewDidLoad() {
    this.loadData();
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
    this.navCtrl.pop();
  }

  loadData() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "getAppProductDeatil",
      category: this.category,
      productno: this.product.PRODUCT_NO,
      start: 0,
      size: 10000
    };
    this.commonService.order(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let body = data.body;
          let result = body["data"] || [];
          this.items = result;
          console.log("package", body);
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

  goHome() {
    this.appCtrl.getRootNav().push("tabs", { index: 0 });
  }

  goCart() {
    this.appCtrl.getRootNav().push("tabs", { index: 2 });
  }

  //add cart
  addCart() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "postAppProductCar",
      productid: this.product.UNI_NO,
      ordertype: this.orderType,
      qty: this.product["QTY"]
    };
    this.commonService.order(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        this.showToast(data.message);
      },
      err => {
        loading && loading.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  // input
  inputCheck(item) {
    let num = Number(this.product["QTY"]) || 0;
    num--;
    if (num > 999) {
      num = 999;
      this.showToast("商品最多购买999件");
    }
    this.product["QTY"] = num.toString();
  }

  // add 1
  add(item) {
    let num = Number(this.product["QTY"]) || 0;
    num++;
    if (num > 999) {
      num = 999;
      this.showToast("商品最多购买999件");
    }
    if (num < 1) {
      num = 1;
      this.showToast("商品最少购买1件");
    }
    this.product["QTY"] = num.toString();
    console.log(this.product["QTY"]);
  }

  // remove 1
  reduce(item, i) {
    let num = Number(this.product["QTY"]) || 0;
    num--;
    if (num < 1) {
      num = 1;
      this.showToast("商品最少购买1件");
      return;
    }
    this.product["QTY"] = num.toString();
  }

  goGoodsDetail(item) {
    this.navCtrl.push("goodsDetail", {
      category: item.PRODUCT_CATEGORY,
      productno: item.PRODUCT_NO,
      orderType: this.orderType,
      isHidCart: true
    });
  }
}
