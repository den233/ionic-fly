import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController} from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';

@IonicPage({
    name: "cartOnly",
    segment: "cartOnly",
    defaultHistory: []
})
@Component({
  selector: 'page-cart-only',
  templateUrl: 'cart-only.html',
})
export class CartOnlyPage {

    public ordertype:string = '';
    public isCheck:boolean = true;
    public isEdit:boolean = false;
    public goodsList = [];
    public checkIds = [];
    public isAllCheck:boolean = false;
    public showNull = false;
    public title:string = '';

    public totalPrice:number = 0;
    public totalPv:number = 0;
    public settleItem = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public commonService: CommonService,
        public alertCtrl: AlertController) {

        this.ordertype = '30';
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

    ionViewDidLoad() {
        this.getCartList();
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
            'size':10000,
            'ordertype':this.ordertype
        };

        let load = this.createLoading();

        this.commonService.order(data).subscribe(
            res => {

                refresher && refresher.complete();//下拉加载关闭

                load && load.dismiss(); //关闭加载框

                if(res.statusCode == 0){

                    this.goodsList = res.body.data;
                    for(let i in this.goodsList){
                        this.goodsList[i]['isCheck'] = false;
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

        this.caculate();
    }


    add(item){
        item['QTY'] = Math.min(++item['QTY'],999);
        this.addOneGood(item);
    }

    addOneGood(item){
        let data = {
            'strAction':'postAppProductCarAll',
            'productid':item.PRODUCT_ID,
            'qty':item['QTY'],
            'ordertype':this.ordertype
        };

        this.commonService.order(data).subscribe(
            data => {
                if(data.statusCode == 0){
                    this.caculate();
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
            'productid':item.PRODUCT_ID,
            'ordertype':this.ordertype
        };

        this.commonService.order(data).subscribe(
            data => {
                if(data.statusCode == 0){
                    this.caculate();
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
            'productid':item.PRODUCT_ID,
            'ordertype':this.ordertype
        };
        let load = this.createLoading();
        this.commonService.order(data).subscribe(
            data => {
                load && load.dismiss(); //关闭加载框

                if(data.statusCode == 0){
                    this.showToast('删除成功');
                    this.goodsList.splice(i,1);
                    this.caculate();
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
            'productidlist':idString,
            'ordertype':this.ordertype
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
                    this.caculate();
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
     * 计算总价格，总pv
     */
    caculate(){

        this.totalPrice=0;
        this.totalPv=0;

        this.settleItem = [];
        for(let i in this.goodsList){
            if(this.goodsList[i]['isCheck']){
                this.totalPrice += this.goodsList[i]['MP_PRICE']*this.goodsList[i]['QTY'];
                this.totalPv += this.goodsList[i]['MP_PV']*this.goodsList[i]['QTY'];
                this.settleItem.push(this.goodsList[i]);
            }
        }

        this.totalPrice = Number(this.totalPrice.toFixed(2));
        this.totalPv = Number(this.totalPv.toFixed(2));

        console.log(this.checkIds);
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
    }

    /**
     * 结算
     */
    settle(){

        if(!this.checkIds.length){
            let alert = this.alertCtrl.create({
                subTitle: '请选择要结算的商品',
                buttons: ['我知道了']
            });
            alert.present();
        }else{
            this.navCtrl.push('confirmOrder',{
                goods:this.settleItem,
                total:{
                    number:this.checkIds.length,
                    pv:this.totalPv,
                    money:this.totalPrice
                },
                orderType:{
                    name:this.title,
                    value:this.ordertype
                }
            });
        }

    }

    goGoodsDetail(item) {

        if (item.PRODUCT_CATEGORY == 18) {
            this.navCtrl.push("goodsPackageDetail", {
                category: item.PRODUCT_CATEGORY,
                product: item,
                orderType: this.ordertype
            });
        } else {
            this.navCtrl.push("goodsDetail", {
                category: item.PRODUCT_CATEGORY,
                productno: item.PRODUCT_NO,
                orderType: this.ordertype
            });
        }
    }

}
