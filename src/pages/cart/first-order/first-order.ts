import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController} from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';
import { DEV } from '../../../providers/config';

@IonicPage({
    name: "firstOrder1",
    segment: "firstOrder1",
    defaultHistory: []
})

@Component({
  selector: 'page-first-order',
  templateUrl: 'first-order.html',
})
export class FirstOrderPage {

  public imgUrl = DEV.url
  public isCheck:boolean = true;
  public goodsList = [];
  public packageList = [];
  public oldPackageList = [];
    /**
     * 套餐单品只能选一个
     * @type isSingle
     */
  public checkType:string = '';
  public settleTotal = {
      number:0,
      pv:0,
      money:0
  };
  public settleItem = [];
  public old:boolean = false;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public commonService: CommonService,
      public alertCtrl: AlertController) {

      this.old = this.navParams.get('old');
  }

  ionViewDidLoad() {
    this.getCartList();
  }

    /**
     * 获取首单列表数据
     */
  getCartList(){
      let data = {
          'strAction':'getAppProducts',
          "ordertype":"10",
          'size':10000
      };
      let load = this.createLoading();
      this.commonService.order(data).subscribe(
          data => {

              load && load.dismiss(); //关闭加载框

              if(data.statusCode == 0){

                  let odata = data.body.data;

                  for(let i = 0; i<odata.length; i++){

                      odata[i]['isCheck'] = false;
                      odata[i]['QTY'] = 1;

                      /**
                       * 老会员激活
                       */
                      if(this.old){
                          if(odata[i]['OLDACTIVATION'] == '1' && odata[i]['PRODUCT_CATEGORY'] == '18'){
                              this.packageList.push(odata[i]);
                          }

                          if(odata[i]['OLDACTIVATION'] == '1' && odata[i]['PRODUCT_CATEGORY'] != '18'){
                              this.goodsList.push(odata[i]);
                          }
                      }else{
                          /**
                           * 首单过滤套餐类型
                           */
                          if(odata[i]['PRODUCT_CATEGORY'] == '18'){
                              this.packageList.push(odata[i]);
                          }

                          if(odata[i]['PRODUCT_CATEGORY'] != '18'){
                              this.goodsList.push(odata[i]);
                          }
                      }

                  }


              }else {
                this.showToast(data.message);
              }

          },
          err => {
              load && load.dismiss(); //关闭加载框
              console.error("ERROR", err);
          }
      );
  }


  updateCheck(item,type:string){

      if(!this.checkType){
          this.checkType = type;
      }

      if(this.checkType != type){
          let alert = this.alertCtrl.create({
              subTitle: '商品和套餐只能2选1购买',
              buttons: ['我知道了']
          });
          alert.present();
          return false;
      }

      /**
       * 套餐选择
       * @type {number}
       */
      //套餐选一个
      if(type == 'package'){
          let packageNum = 0;
          for(let i in this.packageList){
              if(this.packageList[i]['isCheck']){
                  packageNum++;
              }
          }
          //去除本身选中
          if(item['isCheck']){
              packageNum--;
          }
          if(packageNum>=1){
              let alert = this.alertCtrl.create({
                  subTitle: '套餐只能选择一个',
                  buttons: ['我知道了']
              });
              alert.present();
          }else{
              if(item['isCheck']){
                  item['isCheck'] = false;
              }else{
                  item['isCheck'] = true;
              }
              /**
               * 选择后检测套餐是否还有选择项
               */
              this.settleTotal = {
                  number:0,
                  pv:0,
                  money:0
              };
              this.settleItem = [];
              let packageChecked = 0;
              for(let i in this.packageList){
                  if(this.packageList[i]['isCheck']){
                      packageChecked++;
                      this.settleTotal.number++;
                      this.settleTotal.pv += Number(this.packageList[i]['FP_PV']) * this.packageList[i]['QTY'];
                      this.settleTotal.money += Number(this.packageList[i]['FP_PRICE']) * this.packageList[i]['QTY'];
                      this.settleItem.push(this.packageList[i]);
                  }
              }
              /**
               * 若套餐无选择时，checkType为单品，此时可以点击单品
               */
              if(packageChecked == 0){
                  this.checkType = '';
              }
          }
      }
      /**
       *单品选择-可以多选
       */
      else {
          /**
           * 判断此时checkType是不是为单品
           */
          if(this.checkType == 'single'){
              if(item['isCheck']){
                  item['isCheck'] = false;
              }else{
                  item['isCheck'] = true;
              }
              /**
               * 选择后检测套餐是否还有选择项
               */
              this.settleTotal = {
                  number:0,
                  pv:0,
                  money:0
              };
              this.settleItem = [];
              let packageChecked = 0;
              for(let k in this.goodsList){
                  if(this.goodsList[k]['isCheck']){
                      packageChecked++;
                      this.settleTotal.number += Number(this.goodsList[k]['QTY']);
                      this.settleTotal.pv += Number(this.goodsList[k]['FP_PV']) * this.goodsList[k]['QTY'];
                      this.settleTotal.money += Number(this.goodsList[k]['FP_PRICE']) * this.goodsList[k]['QTY'];
                      this.settleItem.push(this.goodsList[k]);
                  }
              }
              /**
               * 若套餐无选择时，checkType为单品，此时可以点击单品
               */
              if(packageChecked == 0){
                  this.checkType = '';
              }
          }else {
              let alert = this.alertCtrl.create({
                  subTitle: '商品和套餐只能2选1购买',
                  buttons: ['我知道了']
              });
              alert.present();
          }

      }

  }
    /**
     * 监听input输入
     */
  inputCheck(item){

    setTimeout(()=>{
        item['QTY'] = Math.min(item['QTY'],999);
        item['QTY'] = Math.max(item['QTY'],1);
    });

    this.caculateTotal();
  }

  showToast(msg: string) {
      let toast = this.toastCtrl.create({
          message: msg,
          duration: 1500,
          position: "bottom",
          cssClass: "text-center"
      });
      toast.present(toast);
  }

  createLoading() {
      let loading = this.loadingCtrl.create({
          spinner: "ios"
      });
      loading.present();
      return loading;
  }

  // settle accounts
  settle(){

    if(!this.settleTotal.number){
        let alert = this.alertCtrl.create({
            subTitle: '请选择要结算的商品',
            buttons: ['我知道了']
        });
        alert.present();
    }

    // else if(this.settleTotal.money<800){
    //     let alert = this.alertCtrl.create({
    //         subTitle: '首单结算需满800元',
    //         buttons: ['我知道了']
    //     });
    //     alert.present();
    // }

    else if(this.settleTotal.pv<800) {
        let alert = this.alertCtrl.create({
            subTitle: '首单结算pv需满800',
            buttons: ['我知道了']
        });
        alert.present();
    }

    else {
        console.log(this.settleItem);
        this.navCtrl.push('confirmOrder',{
            goods:this.settleItem,
            total:this.settleTotal,
            orderType:{
                name:'首购单',
                value:10
            }
        });
    }
  }

  add(item){
      item['QTY'] = Math.min(++item['QTY'],999);
      this.caculateTotal();
  }

  reduce(item){
      item['QTY'] = Math.max(--item['QTY'],1);
      this.caculateTotal();
  }

  caculateTotal(){
      this.settleTotal = {
          number:0,
          pv:0,
          money:0
      };
      for(let k in this.goodsList){
          if(this.goodsList[k]['isCheck']){
              console.log(this.goodsList[k]);
              this.settleTotal.number += Number(this.goodsList[k]['QTY']);
              this.settleTotal.pv += Number(this.goodsList[k]['FP_PV']) * this.goodsList[k]['QTY'];
              this.settleTotal.money += Number(this.goodsList[k]['FP_PRICE']) * this.goodsList[k]['QTY'];
          }
      }
      for(let i in this.packageList){
          if(this.packageList[i]['isCheck']){
              console.log(this.packageList[i]);
              this.settleTotal.number++;
              this.settleTotal.pv += Number(this.packageList[i]['FP_PV']) * this.packageList[i]['QTY'];
              this.settleTotal.money += Number(this.packageList[i]['FP_PRICE']) * this.packageList[i]['QTY'];
          }
      }
  }

    goBack(){
        this.navCtrl.pop();
    }


    goGoodsDetail(item) {

        if (item.PRODUCT_CATEGORY == 18) {
            this.navCtrl.push("goodsPackageDetail", {
                category: item.PRODUCT_CATEGORY,
                product: item,
                first:true
            });
        } else {
            this.navCtrl.push("goodsDetail", {
                category: item.PRODUCT_CATEGORY,
                productno: item.PRODUCT_NO,
                first:true
            });
        }
    }


}
