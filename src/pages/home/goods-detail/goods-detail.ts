import { Component, ViewChild, ChangeDetectorRef, NgZone } from "@angular/core";
import {
  App,
  Content,
  IonicPage,
  Slides,
  NavController,
  ToastController,
  LoadingController,
  AlertController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";
import { DEV } from "../../../providers/config";

@IonicPage({
  name: "goodsDetail2",
  segment: "goodsDetail2",
  defaultHistory: []
})
@Component({
  selector: "page-goods-detail",
  templateUrl: "goods-detail.html"
})
export class GoodsDetailPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  imgUrl = DEV.url;
  isHidCart: boolean;
  parentTab = "goods";
  orderType: string = "";
  currentIndex = 0;
  images = [];
  category = "";
  productno = "";
  item = {
    UNI_NO: "",
    PRODUCT_NO: "",
    PRODUCT_NAME: "",
    QTY: "",
    FP_PRICE: "",
    FP_PV: "",
    MP_PRICE: "",
    MP_PV: "",
    IMAGE_LINK: "",
    PRODUCT_CATEGORY: "",
    REMARK: ""
  };
  price: any;
  pv: any;
  isFirst:false;
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.productno = navParams.get("productno") || "";
    this.category = navParams.get("category") || "";
    this.orderType = navParams.get("orderType") || "";
    this.isHidCart = navParams.get("isHidCart") || false;
    this.isFirst = navParams.get("first") || false;
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

  segmentChanged(type) {
    this.parentTab = type;
    console.log(this.parentTab );
    this.content.scrollTo(0, this.scrollTo(this.parentTab), 500);
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex() || 0;
  }

  scrollTo(element: string) {
    let elem = document.getElementById(element);
    console.log(elem)
    let box = elem.getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let top = box.top + scrollTop - clientTop;
    let cDim = this.content.getContentDimensions();

    let scrollOffset = Math.round(top) + cDim.scrollTop - cDim.contentTop;
    return scrollOffset;
  }

  onScroll(ev) {
    let scroll = this.content.getContentDimensions().scrollTop;
    let golal = this.scrollTo("detail");

    if (scroll < golal) {
      setTimeout(() => {
        this.parentTab = "goods";
      }, 500);
    } else {
      setTimeout(() => {
        this.parentTab = "detail";
      }, 500);
    }
  }

  goHome() {
    this.appCtrl.getRootNav().push("tabs", { index: 0 });
  }
  goCart() {
    this.appCtrl.getRootNav().push("tabs", { index: 2 });
  }

  loadData() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "getAppProductDeatil",
      category: this.category,
      productno: this.productno
    };
    this.commonService.order(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let body = data.body;
          let result = body["data"][0] || {};
          if (result["IMAGE_LINK"] && !Array.isArray(result["IMAGE_LINK"])) {
            this.images.push(result["IMAGE_LINK"]);
          }
          if (result["IMAGE_LINK"] && Array.isArray(result["IMAGE_LINK"])) {
            this.images = result["IMAGE_LINK"];
          }
          this.item = result;
          this.item["QTY"] = "1";


          this.price = this.item["FP_PRICE"];
          this.pv = this.item["FP_PV"];



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
  //add cart
  addCart() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "postAppProductCar",
      productid: this.item.UNI_NO,
      ordertype: this.orderType,
      qty: this.item["QTY"]
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
    let num = Number(item["QTY"]) || 0;
    if (num > 999) {
      num = 999;
      this.showToast("商品最多购买999件");
    }
    if (num < 1) {
      num = 1;
      this.showToast("商品最少购买1件");
    }
    item["QTY"] = num;
  }

  // add 1
  add(item) {
    let num = Number(item["QTY"]) || 0;
    num++;
    if (num > 999) {
      num = 999;
      this.showToast("商品最多购买999件");
    }

    item["QTY"] = num;
  }

  // remove 1
  reduce(item, i) {
    let num = Number(item["QTY"]) || 0;
    num--;
    if (num < 1) {
      num = 1;
      this.showToast("商品最少购买1件");
      return;
    }
    item["QTY"] = num;
  }
}
