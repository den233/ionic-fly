
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController} from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';
import { DEV } from '../../../providers/config';

@IonicPage({
    name: "cart",
    segment: "cart",
    defaultHistory: []
})
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  public modalShow:boolean = false;
  public isCheck:boolean = true;
  public isEdit:boolean = false;
  public goodsList = [];
  public tipShow:boolean = true;
  public checkIds = [];
  public isAllCheck:boolean = false;
  public showNull = false;
  public imgUrl = DEV.imgUrl;
  public orderTypes=[];
  public ifOrderType = true;
  public goodsShow:boolean = false;
  public orderLength='0';
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public commonService: CommonService,
      public alertCtrl: AlertController) {
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

  ionViewDidEnter() {
      this.getCartList();
  }

  ionViewWillLeave(){
      this.modalShow = false;
      this.isEdit = false;
      this.isAllCheck = false;

  }

    /**
     * 下拉刷新
     * @param refresher
     */
  doRefresh(refresher) {
        this.getCartList(refresher);
  }
    /**
     * 获取购物车列表
     */
  getCartList(refresher=null){

    let data = {
        'strAction':'getAppProductCar',
        //'strAction':'gettAppProductCarAll',
        'size':10000
    };

    let load = this.createLoading();

    this.commonService.order(data).subscribe(
        res => {

            refresher && refresher.complete();//下拉加载关闭

            load && load.dismiss(); //关闭加载框

            if(res.statusCode == 0){

                this.getOrderType();

                this.goodsList = res.body.data;
                for(let i in this.goodsList){
                    this.goodsList[i]['isCheck'] = false;
                }

                if(this.goodsList.length){
                    this.isEdit = false;
                    this.showNull = false;
                }else{
                    this.showNull = true;
                }

            }else {
                this.showToast(res.message);
                this.goodsList = [];
            }

            if(!this.goodsList.length){
                this.showNull = true;
            }


        },
        err => {
            load && load.dismiss(); //关闭加载框
            console.error("ERROR", err);
        }
    );
  }

  tipHide(){
      this.tipShow = false;
  }

  modalTrigger(){
    this.modalShow = !(this.modalShow);
  }

    /**
     * 更新checkbox
     * @param item
     */
  updateCheck(item){
      if(item['isCheck']){
          item['isCheck'] = true;
          this.checkIds.push(item.PRODUCT_ID);
      }else{
          item['isCheck'] = false;
          for (let i = 0; i < this.checkIds.length; i++) {
              if (this.checkIds[i] == item.PRODUCT_ID) this.checkIds.splice(i,1);
          }
      }
      if(!this.checkIds.length){
          this.isAllCheck = false;
      }
  }


  add(item){
      item['QTY'] = Math.min(++item['QTY'],999);
      this.addOneGood(item);
  }

  addOneGood(item){
      let data = {
          'strAction':'postAppProductCarAll',
          'productid':item.PRODUCT_ID,
          'qty':item['QTY']
      };

      this.commonService.order(data).subscribe(
          data => {
              if(data.statusCode == 0){

              }else{
                  this.showToast(data.message);
              }
          },
          err => {
              console.error("ERROR", err);
          }
      );
  }

    /**
     * 购物车减1
     * @param item
     */
  reduce(item,i){

        if(item['QTY'] == 1){
            let confirm = this.alertCtrl.create({
                title: '确认删除此商品？',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                            item['QTY'] = 1;
                        }
                    },
                    {
                        text: '确认',
                        handler: () => {
                            this.delOneGood(item,i);
                        }
                    }
                ]
            });
            confirm.present();
        }
        else {
            item['QTY']--;
            this.reduceOneGood(item);
        }

  }


  reduceOneGood(item){
      let data = {
          'strAction':'deleteAppProductCar',
          'productid':item.PRODUCT_ID
      };

      this.commonService.order(data).subscribe(
          data => {
            if(data.statusCode == 0){

            }else{
                this.showToast(data.message);
            }
          },
          err => {
              console.error("ERROR", err);
          }
      );
  }

    /**
     * 删除一个
     * @param item
     * @param i
     */
  delOneGood(item,i){
      let data = {
          'strAction':'deleteAppProductCar',
          'productid':item.PRODUCT_ID
      };
      let load = this.createLoading();
      this.commonService.order(data).subscribe(
          data => {
              load && load.dismiss(); //关闭加载框

              if(data.statusCode == 0){
                  this.showToast('删除成功');
                  this.goodsList.splice(i,1);
                  this.ifEmpty();
              }else{
                  this.showToast(data.message);
              }

          },
          err => {
              load && load.dismiss(); //关闭加载框
              console.error("ERROR", err);
          }
      );
  }

    /**
     * 多选
     */
  checkAll(){
      this.checkIds = [];
      if(this.isAllCheck){
          this.isAllCheck = false;
          for(let i in this.goodsList){
              this.goodsList[i]['isCheck'] = false;
          }
      }else {
          this.isAllCheck = true;
          for(let i in this.goodsList){
              this.goodsList[i]['isCheck'] = true;
              this.checkIds.push(this.goodsList[i].PRODUCT_ID);
          }
      }

  }

    /**
     * 删除多选
      */
  delAllCheck(){

      if(!this.checkIds.length){
          let alert = this.alertCtrl.create({
              subTitle: '请选择要删除的商品',
              buttons: ['确定']
          });
          alert.present();
      }else{
          let confirm = this.alertCtrl.create({
              title: '确认删除选中商品？',
              buttons: [
                  {
                      text: '取消',
                      handler: () => {

                      }
                  },
                  {
                      text: '确认',
                      handler: () => {
                          this.delConfirm();
                      }
                  }
              ]
          });
          confirm.present();
      }
  }

  delConfirm(){
      let idString = this.checkIds.join(',');
      let data = {
          'strAction':'deleteAppProductCarAll',
          'productidlist':idString
      };

      let load = this.createLoading();
      this.commonService.order(data).subscribe(
          data => {
              load && load.dismiss(); //关闭加载框
              if(data.statusCode == 0){
                  this.showToast('删除成功');
                  for(let i = 0; i<this.goodsList.length; i++){
                      if(idString.indexOf(this.goodsList[i]['PRODUCT_ID']) > -1){
                          this.goodsList.splice(i,1);
                          i = i - 1;
                      }
                  }
                  this.checkIds = [];
                  this.ifEmpty();
              }else{
                  this.showToast(data.message);
              }
          },
          err => {
              load && load.dismiss(); //关闭加载框
              console.error("ERROR", err);
          }
      );
  }

    /**
     * 监听input输入
     */
  inputCheck(item){
    setTimeout(()=>{
        item['QTY'] = Math.min(item['QTY'],999);
        item['QTY'] = Math.max(item['QTY'],1);
    });
    this.addOneGood(item);
  }

  edit(){
    this.isEdit = !(this.isEdit);
    console.log(this.isEdit)
  }

  goType(item){
    this.navCtrl.push('normalOrder',{
        'ordertype':item.VALUE_CODE,
        'title':item.VALUE_TITLE
    });
  }

  goGoodsDetail(item) {

        if (item.PRODUCT_CATEGORY == 18) {
            this.navCtrl.push("goodsPackageDetail", {
                category: item.PRODUCT_CATEGORY,
                product: item,
            });
        } else {
            this.navCtrl.push("goodsDetail", {
                category: item.PRODUCT_CATEGORY,
                productno: item.PRODUCT_NO,
            });
        }
  }

    ifEmpty(){
      console.log(this.goodsList)
        if(!this.goodsList.length){
            this.showNull = true;
        }
    }

    getOrderType(){
        this.commonService
            .order({
                strAction: "getAppOrdertype"
            })
            .subscribe(
                res => {
                    if (res.statusCode == 0) {
                        let data = res.body.data || [];

                        for(let i=0;i<data.length;i++){
                            if(data[i]['VALUE_CODE'] == 10|| data[i]['VALUE_CODE'] == 14|| data[i]['VALUE_CODE'] == 13 ){
                                data.splice(i,1);
                                i = i - 1;
                            }
                        }

                        this.orderTypes = data;

                        if(!this.orderTypes.length){
                            this.showNull = true;
                            return false;
                        }

                        console.log('订单类型',this.orderTypes)
                    } else {
                        this.showToast(res.message);
                    }
                },
                err => {
                    console.error("ERROR", err);
                }
            );
    }



    modalGoods(){
        this.goodsShow = !(this.goodsShow);
    }


}
