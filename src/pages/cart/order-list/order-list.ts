import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App ,LoadingController, ToastController,AlertController} from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';
import { DEV } from '../../../providers/config';

@IonicPage({
    name: "orderList",
    segment: "orderList",
    defaultHistory: []
})
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {

    public imgUrl = DEV.imgUrl;
    public now_status:number = 0;
    public allList = [];
    public switchList = [];

    constructor(
      private app: App,
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public commonService: CommonService,
      public alertCtrl: AlertController) {

        this.now_status = navParams.get('status') ? navParams.get('status') : 0;

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
        if(this.now_status){
            this.getOrderList(this.now_status);
        }else{
            this.getOrderList();
        }
    }

    getOrderList(status=null){
        let data = {
            'strAction':'getAppMemberOrders',
            'size':10000
        };

        let load = this.createLoading();

        this.commonService.order(data).subscribe(
            res => {
                load && load.dismiss(); //关闭加载框

                if(res.statusCode == 0){
                    this.allList = this.switchList = res.body.data;
                    if(status){
                       this.changeStatus(status);
                    }
                }else{
                    this.showToast(res.message);
                }


            },
            err => {
                load && load.dismiss(); //关闭加载框
                console.error("ERROR", err);
            }
        );
    }

    /**
     * 更改订单状态
     * @param {number} i
     */
    changeStatus(i:number){
        this.now_status = i;
        this.switchList = [];

        if(i != 0){
            if(i==1){
                for(let k in this.allList){
                    if(this.allList[k]['STATUS'] == i && this.allList[k]['IS_EXPORTED_NC'] != 3){
                        this.switchList.push(this.allList[k]);
                    }
                }
            }
            else if(i==2){
                for(let k in this.allList){
                    if(this.allList[k]['STATUS'] == 1 && this.allList[k]['IS_EXPORTED_NC'] == 3){
                        this.switchList.push(this.allList[k]);
                    }
                }
            }

            else{
                for(let k in this.allList){
                    if(this.allList[k]['STATUS'] == i){
                        this.switchList.push(this.allList[k]);
                    }
                }
            }

        }else{
            this.switchList = this.allList;
        }
    }

    /**
     * 订单详情
     */
    orderDetail(item){
        this.navCtrl.push('orderDetail',{
            data:item
        });
    }

    search(){
        this.navCtrl.push('orderSearch');
    }

    /**
     * 确认收货
     */
    sure(id){

        let confirm = this.alertCtrl.create({
            title: '确认收货？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {

                    }
                },
                {
                    text: '确认',
                    handler: () => {
                        let data = {
                            'strAction':'confirmDelivery',
                            'moid':id
                        };
                        let load = this.createLoading();
                        this.commonService.order(data).subscribe(
                            res => {
                                load && load.dismiss(); //关闭加载框

                                if(res.statusCode == 0){
                                    this.showToast('确认收货成功');
                                    this.getOrderList(this.now_status);
                                }else{
                                    this.showToast(res.message);
                                }


                            },
                            err => {
                                load && load.dismiss(); //关闭加载框
                                console.error("ERROR", err);
                            }
                        );
                    }
                }
            ]
        });
        confirm.present();

    }

}
