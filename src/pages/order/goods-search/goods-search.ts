import { Component ,ViewChild} from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../providers/common.service";
import { DEV } from '../../../providers/config';
import { modals } from '../../../service/service';
@IonicPage({
  name: "goodsSearch",
  segment: "goodsSearch",
  defaultHistory: []
})
@Component({
  selector: "page-goods-search",
  templateUrl: "goods-search.html"
})
export class GoodsSearchPage {
  @ViewChild('childA') child1;
  modals= modals;
  imgUrl = DEV.imgUrl;
  items = [];
  showNull: boolean;
  orderType = '';
  keyWord = "";
  orderTypes = [];
  item = {
    UNI_NO: "",
    PRODUCT_NO: "",
    PRODUCT_NAME: "",
    QTY: "1",
    FP_PRICE: "",
    FP_PV: "",
    MP_PRICE: "",
    MP_PV: "",
    IMAGE_LINK: "",
    PRODUCT_CATEGORY: "",
    REMARK: ""
  };
 
  private form: FormGroup;
  constructor(
    public appCtrl: App,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {
    this.form = this.formBuilder.group({
      orderType: [""],
      keyWord: [""]
    });
  }

  ionViewDidLoad() {
    this.getOrderType();
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

  // search goods item
  search() {
    let keyWord = this.keyWord.replace(/\s+/g, "");
    if (!keyWord) {
      this.showToast("请输入关键字");
      return;
    }
    this.loadData();
  }

  // select event
  change(){
    let keyWord = this.keyWord.replace(/\s+/g, "");
    if (keyWord){
      this.loadData();
    }
  }

  loadData() {
    let loading = this.createLoading();
    let inputs = {
      strAction: "getAppProducts",
      ordertype: this.orderType,
      keyword: this.keyWord.replace(/\s+/g, "")
    };
    this.commonService.order(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let body = data.body;
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

  getOrderType(){
    this.commonService
    .order({
      strAction: "getAppOrdertype"
    })
    .subscribe(
      res => {
        if (res.statusCode == 0) {
          let result = res.body['data'] || [];
          
          for(let item of result){
            if(item['VALUE_CODE'] != '10'){
              this.orderTypes.push(item);
            }
          }
          this.orderType = this.orderTypes[0]['VALUE_CODE'];
        } else {
          this.showToast(res.message);
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  goCart() {
    this.appCtrl.getRootNav().push("tabs", { index: 1 });
  }

  goGoodsDetail(item) {
    // package
    if (item.PRODUCT_CATEGORY == 18) {
      this.navCtrl.push("goodsPackageDetail", {
        category: item.PRODUCT_CATEGORY,
        product: item,
        orderType: this.orderType
      });
    } else {
      this.navCtrl.push("goodsDetail", {
        category: item.PRODUCT_CATEGORY,
        productno: item.PRODUCT_NO,
        orderType: this.orderType
      });
    }
  }
  
closeModal(){
 
}
  //add cart
  addCart(item,img) {
    this.modals.ordertype=this.orderType;
    this.modals.model=1;
    this.modals.value=item;
    this.modals.UNI_NO=item.UNI_NO;
    this.modals.PRODUCT_NO=item.PRODUCT_NO
    this.child1.getColor();
 }
  

}
