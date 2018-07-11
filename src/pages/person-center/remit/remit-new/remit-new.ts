import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from '../../../../providers/common.service';

@IonicPage({
    name: "remitNew",
    segment: "remitNew",
    defaultHistory: []
})

@Component({
  selector: 'page-remit-new',
  templateUrl: 'remit-new.html',
})
export class RemitNewPage {

    public bank;
    public cash;
    public time;
    public allData = {
        receiveAccountNo:'',
        remitRegType:'',
        remitMoney:'',
        remitName:'',
        phone:'',
        remitAddress:'',
        remitTime:''
    }
    public accountList = [];
    public usercode;

    private remitForm: FormGroup;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public commonService: CommonService) {

        this.remitForm = this.formBuilder.group({
            bank: ["", Validators.required],
            type: ["", Validators.required],
            username: ["", Validators.required],
            tel: ["", Validators.compose([
                Validators.required,
                Validators.pattern('1[34578]\\d{9}')
            ])],
            date: ["", Validators.required],
            addr: ["", Validators.required],
            money: ["", Validators.required]
        });
    }

    ionViewDidLoad() {
      this.getAccountList();
      this.usercode = localStorage.getItem('principal');
    }

    getAccountList(){
        let data = {
            'strAction':'getAppRemittanceAccount'
        };
        this.commonService.order(data).subscribe(
            data => {
                if (data.statusCode == 0) {
                    let odata = data.body.data;
                    this.accountList = odata;
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

    getTypeList(){
        let data = {
            'strAction':'getAppRemittanceMode'
        };
        this.commonService.order(data).subscribe(
            data => {
                if (data.statusCode == 0) {

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

    add(){

        this.allData['remitTime'] = this.allData['remitTime'].toString().replace(/T/g, " ");
        this.allData['remitTime'] = this.allData['remitTime'].toString().replace(/Z/g, "");

        this.allData['strAction'] = 'postAppRemittance';
        this.commonService.wallet(this.allData).subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.showToast(data.message);
                    this.navCtrl.push('remit');
                } else {
                    this.showToast(data.message);
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
    }

}
