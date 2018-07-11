import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    LoadingController,
    ToastController,
    PopoverController
} from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';

@IonicPage({
    name: "remit",
    segment: "remit",
    defaultHistory: []
})

@Component({
  selector: 'page-remit',
  templateUrl: 'remit.html',
})
export class RemitPage {

    public sortType = 'sortAll';
    public type1 = {
        VALUE_TITLE:'',
        VALUE_CODE:0
    }
    public type2 = {
        VALUE_TITLE:'',
        VALUE_CODE:0
    }
    public type3 = {
        name:'',
        value:0
    }

    public remitTypes = [];
    public remitAccounts = [];
    public remitStatus = [
        {name:'未审核',value:1},
        {name:'已审核',value:2}
    ];

    public allList = [];
    constructor(public navCtrl: NavController,
              public commonService: CommonService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private popoverCtrl: PopoverController) {
    }

    ionViewDidLoad() {
        this.getRemitList();
    }

    /**
     * 获取账户列表
     */
    getAccountList(){
        let data = {
            'strAction':'getAppRemittanceAccount'
        };
        this.commonService.order(data).subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.remitAccounts = data.body.data;
                    for(let i in this.remitAccounts){
                        for (let k in this.allList){
                            if(this.allList[k]['receiveAccountNo'] == this.remitAccounts[i]['VALUE_CODE']){
                                this.allList[k]['accountName'] = this.remitAccounts[i]['VALUE_TITLE'];
                            }
                        }
                    }
                } else {
                    this.showToast(data.message);
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
    }

    /**
     * 获取汇款方式list
     */
    getTypeList(){
        let data = {
            'strAction':'getAppRemittanceMode'
        };
        this.commonService.order(data).subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.remitTypes = data.body.data;
                    for(let i in this.remitTypes){
                        for (let k in this.allList){
                            if(this.allList[k]['remitRegType'] == this.remitTypes[i]['VALUE_CODE']){
                                this.allList[k]['typeName'] = this.remitTypes[i]['VALUE_TITLE'];
                            }
                        }
                    }
                } else {
                    this.showToast(data.message);
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
    }

    /**
     * 获取汇款列表
     * @returns
     */
    getRemitList(){
        let data = {
            'strAction':'getRemitList'
        };
        this.commonService.wallet(data).subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.allList = data.body;
                    this.getAccountList();
                    this.getTypeList();
                } else {
                    this.showToast(data.message);
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
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
            position: "bottom",
            cssClass: "text-center"
        });
        toast.present(toast);
    }

    /**
     * 汇款方式变更
     * @param ev
     */
    remitChangeType(ev) {
        console.log(this.type1.VALUE_CODE);
        let self = this;
        this.popoverCtrl.create('remitTypePopover', {
            cb: function (_data) {
                self.type1 = _data;
                self.getList();
            },
            type_type: self.type1.VALUE_CODE,
            data: this.remitTypes
        }).present({
            ev: ev
        });
    };

    /**
     * 汇款账户变更
     * @param ev
     */
    remitChangeAccount(ev) {
        let self = this;
        this.popoverCtrl.create('remitAccountPopover', {
            cb: function (_data) {
                self.type2 = _data;
                self.getList();
            },
            type: self.type2.VALUE_CODE,
            data: this.remitAccounts
        }).present({
            ev: ev
        });
    };

    /**
     * 汇款状态变更
     * @param ev
     */
    remitChangeStatus(ev) {
        let self = this;
        this.popoverCtrl.create('remitStatusPopover', {
            cb: function (_data) {
                self.type3 = _data;
                self.getList();
            },
            type: self.type3.value,
            data: this.remitStatus
        }).present({
            ev: ev
        });
    };


    getList(){
        console.log(this.type1);
        console.log(this.type2);
        console.log(this.type3);

        let data = {
            'strAction':'getRemitList',
            'remitRegType':this.type1.VALUE_CODE,
            'receiveAccountNo':this.type2.VALUE_CODE,
            'status':this.type3.value
        };
        this.commonService.wallet(data).subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.allList = data.body;
                    for(let i in this.remitTypes){
                        for (let k in this.allList){
                            if(this.allList[k]['remitRegType'] == this.remitTypes[i]['VALUE_CODE']){
                                this.allList[k]['typeName'] = this.remitTypes[i]['VALUE_TITLE'];
                            }
                        }
                    }
                    for(let i in this.remitAccounts){
                        for (let k in this.allList){
                            if(this.allList[k]['receiveAccountNo'] == this.remitAccounts[i]['VALUE_CODE']){
                                this.allList[k]['accountName'] = this.remitAccounts[i]['VALUE_TITLE'];
                            }
                        }
                    }
                } else {
                    this.showToast(data.message);
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
    }

    add(){
        this.navCtrl.push('remitNew');
    }


    goBack(){
        this.navCtrl.popToRoot()
    }

    remitDetail(item){
        console.log(item)
        this.navCtrl.push('remitDetail',{
            item:item
        });
    }

}
