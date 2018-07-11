import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    LoadingController,
    ToastController
} from "ionic-angular";
import { CommonService } from "../../../../providers/common.service";

@IonicPage({
    name: "bonusCancel",
    segment: "bonusCancel",
    defaultHistory: []
})

@Component({
  selector: 'page-bonus-cancel',
  templateUrl: 'bonus-cancel.html',
})
export class BonusCancelPage {

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
                public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        this.getRemitList();
    }

    /**
     * 获取列表
     * @returns
     */
    getRemitList(){
        let data = {
            'strAction':'getRemoveScale',
            "bankbookType":"1"
        };
        this.commonService.home(data).subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.allList = data.body.data;
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

    goBack(){
        this.navCtrl.pop()
    }

}
