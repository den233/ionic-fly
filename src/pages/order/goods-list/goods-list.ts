import { Component ,ViewChild} from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";
import { DEV } from "../../../providers/config";
import { modals } from '../../../service/service';
@IonicPage({
  name: "goodsList",
  segment: "goodsList",
  defaultHistory: []
})
@Component({
  selector: "page-goods-list",
  templateUrl: "goods-list.html"
})
export class GoodsListPage {
  @ViewChild('childA') child1;
  modals= modals;
  imgUrl = DEV.imgUrl;
  items = [];
  showNull: boolean;
  currentType = "";
  pagination = {
    page: 0,
    size: 10,
    totalCount: 0
  }; // 分页
  typeList = [];
  parentTab: string = "20";
  orderTypes = [];
  ifOrderType = true;
  FP_PRICE='';
  PRODUCT_NAME='';
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

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {
    let orderType = localStorage.getItem('orderType');
    this.parentTab = (orderType != null && orderType != '' && orderType != 'undefined') ? orderType : "20";
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

    this.modals.model = 0;
    if(this.modals.model==1){
      [].forEach.call(document.querySelectorAll(".tabbar"), function(i){　
        　i['style'].display='none'　　　　　
        });
    }else{
      [].forEach.call(document.querySelectorAll(".tabbar"), function(i){　
        　i['style'].display='flex'　　　　　
        });
    }

    this.getOrderType();
  }

  ionViewDidLeave() {
    localStorage.setItem('orderType', '');
  }

  goBack() {
    this.navCtrl.pop();
  }
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
  getOrderType(){
    this.commonService
    .order({
      strAction: "getAppOrdertype"
    })
    .subscribe(
      res => {
        if (res.statusCode == 0) {
          this.orderTypes = res.body.data || [];
          for (let i=0;i<this.orderTypes.length;i++){
              if(this.orderTypes[i]['VALUE_CODE'] == '10' || this.orderTypes[i]['VALUE_CODE'] == '14' || this.orderTypes[i]['VALUE_CODE'] == '13'){
                  this.orderTypes.splice(Number(i),1);
                  i = i - 1;
              }
          }

          if(!this.orderTypes.length){
              this.ifOrderType = false;
              return false;
          }

          this.parentTab = this.orderTypes[0]['VALUE_CODE'];
          this.getType();
        } else {
          this.showToast(res.message);
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  getType() {
    this.commonService
      .order({
        strAction: "getAppProductCategory"
      })
      .subscribe(
        res => {
          if (res.statusCode == 0) {
            this.typeList = res.body.data || [];
            this.currentType = this.typeList[0]["VALUE_CODE"];
            this.loadData(null, null);
          } else {
            this.showToast(res.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  segmentChanged(value) {
    this.parentTab = value;
    console.log(this.parentTab)
    this.loadData(null, null);
  }

  // search goods item
  goSearch() {
    this.navCtrl.push("goodsSearch");
  }

  goCart() {
    //this.appCtrl.getRootNav().push("tabs", { index: 2 });
    this.navCtrl.parent.select(2);
  }
  closeModal(val){
    console.log(val)


  }
  goGoodsDetail(item) {
    // 套餐
    if (item.PRODUCT_CATEGORY == 18) {
      this.navCtrl.push("goodsPackageDetail", {
        category: item.PRODUCT_CATEGORY, // 商品分类
        product: item, // 商品对象
        orderType: this.parentTab, // 订单类型（没有不传）
        remark:  item.REMARK
      });
    } else {
      this.navCtrl.push("goodsDetail", {
        category: item.PRODUCT_CATEGORY, // 商品分类
        productno: item.PRODUCT_NO, // 商品ID
        orderType: this.parentTab,// 商品分类（没有不传）
        SHOES_GROUP:item.SHOES_GROUP
      });
    }
  }

  loadData(refresher, infiniteScroll) {
    let loading = null;
    if (!refresher && !infiniteScroll) {
      loading = this.createLoading();
    }

    let inputs = {
      strAction: "getAppProducts",
     // strAction:'getAppProductSales',
      category: this.currentType,
      ordertype: this.parentTab,
      size: this.pagination.size,
      start: this.pagination.page
    };
    this.commonService.order(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let body = data.body;
          this.pagination.totalCount = body["total"] || 0;
          let result = body["data"] || [];
          if (refresher) {
            refresher.complete();
            this.items = result;
          }
          if (infiniteScroll) {
            infiniteScroll.complete();
            if (this.items.length < this.pagination.totalCount) {
              this.items.push(...result);
            }
          }
          if (!refresher && !infiniteScroll) {
            this.items = result;
          }
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

  // 下拉刷新
  doRefresh(refresher) {
    this.pagination.page = 1;
    this.loadData(refresher, null);
  }

  // 上拉加载
  doInfinite(infiniteScroll) {
    // 下拉加载极限判断
    if ((this.items.length || 0) >= this.pagination.totalCount) {
      infiniteScroll.complete();
      return;
    }
    this.pagination.page++;
    this.loadData(null, infiniteScroll);
  }

  // tap left menu
  changeType(id) {
    this.currentType = id;
    this.loadData(null, null);
  }

  //add cart
  addCart(item,img) {
     console.log(item)

    let inputs = {
      strAction: "postAppProductCar",
      productid: item.UNI_NO,
      ordertype: this.parentTab,
      // qty: 1
    };
    this.modals.ordertype=this.parentTab;
    this.modals.value=item;
    this.modals.UNI_NO=item.UNI_NO;
    this.modals.PRODUCT_NO=item.PRODUCT_NO;
    this.child1.getColor();
    if(this.modals.model==1){
      [].forEach.call(document.querySelectorAll(".tabbar"), function(i,v){　

          　i['style'].display='none';　　　

        });
    }else{
      [].forEach.call(document.querySelectorAll(".tabbar"), function(i,v){

          　i['style'].display='flex'　　

        　　　
        });
    }
  }

  }
