import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  LoadingController,
  ToastController,
  ModalController,
  NavParams,
  AlertController
} from "ionic-angular";
import { CommonService } from "../../../../providers/common.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

@IonicPage({
  name: "bonusCash",
  segment: "bonusCash",
  defaultHistory: []
})
@Component({
  selector: "page-bonus-cash",
  templateUrl: "bonus-cash.html"
})
export class BonusCashPage {
    public wallet: any;
    public user = {
        pass: "",
        repass: ""
    };

  public bonusCount;
  private bonusForm: FormGroup;

  public bankList = {
      BANK: '',
      BANKADDRESS: '',
      BANKCARD: '',
      BANK_CITY: '',
      BANK_DISTRICT: '',
      BANK_PROVINCE: '',
      ID: ''
  };

  public model: boolean = false;
  public username;

  constructor(
    public navCtrl: NavController,
    public commonService: CommonService,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appCtrl: App,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
      this.bonusForm = this.formBuilder.group({
          money: ["", Validators.required],
          banks: ["", Validators.required]
      });
  }

  ionViewDidLoad() {
    this.loadWallet();
    this.getDefaultBank();
    this.getUser();
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

  getUser(){
      this.commonService
          .wallet({
              strAction: "getAppBankbookBalances"
          })
          .subscribe(
              data => {
                  if (data.statusCode == 0) {
                      let arr = data.body['data'] || [];
                      for (let i = 0; i < arr.length; i++) {
                          if (arr[i].VALUE_TITLE == "奖金账户") {
                              this.username = arr[i].MI_USER_NAME;
                          }
                      }
                  }
              },
              err => {
                  console.error("ERROR", err);
              }
          );
  }

  goBack() {
    this.navCtrl.pop();
  }

  loadWallet() {
    this.commonService
      .wallet({
        strAction: "getAppBankbookBalances"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            let arr = data.body["data"] || [];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]['BANKBOOK_TYPE'] == 1) {
                this.wallet = arr[i].BALANCE;
                console.log(this.wallet);
              }
            }
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  chargeAll(){
    this.bonusCount = this.wallet;
  }

    /**
     * 获取默认银行卡
     */
  getDefaultBank(){
      this.commonService
          .loginPwd({
              strAction: "defaultnibank"
          })
          .subscribe(
              data => {
                  if (data.statusCode == 0) {
                      this.bankList = Object.assign(this.bankList, data.body[0]);
                      console.log(this.bankList)
                  }
              },
              err => {
                  console.error("ERROR", err);
              }
          );
  }


  cash(){
      this.validSecondPassword();
  }


    /**
     * 验证二级密码是否存在
     * */
  validSecondPassword() {
    this.commonService
        .loginPwd({
            strAction: "pwd2IsNull"
        })
        .subscribe(
            data => {
                if (data.statusCode == 0) {
                    this.pay();
                } else if (data.statusCode == 1) {
                    this.model = !this.model;
                } else {
                    this.showToast(data.message);
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
  }

    pay(){

        if(!this.bankList.BANKCARD){
            this.showToast('请选择银行卡');
            return false;
        }

        if(this.bonusCount <=100){
            let alert = this.alertCtrl.create({
                subTitle: '金额需要大于100才可以申请',
                buttons: ['我知道了']
            });
            alert.present();
            return false;
        }

        if(this.bonusCount > 100000){
            let alert = this.alertCtrl.create({
                subTitle: '奖金提现不得大于10万',
                buttons: ['我知道了']
            });
            alert.present();
            return false;
        }

        this.commonService
            .wallet({
                strAction: "postAppBonusExist",
                amount:this.bonusCount,
                bankId:this.bankList['ID'],
                username:this.username
            })
            .subscribe(
                data => {
                    if (data.statusCode == 0) {
                        this.navCtrl.push('bonus');
                        this.showToast(data.message);
                    }else{
                        this.showToast(data.message);
                    }
                },
                err => {
                    this.showToast('提现暂不可用');
                    console.error("ERROR", err);
                }
            );


    }

    // 无二级密码：二级密码格式校验
    pwdCheck() {
        if (this.user.pass.length < 6 || this.user.pass.length > 20) {
            this.showToast("请输入6-20位字符的密码！");
            return;
        }
        if (this.user.pass != this.user.repass) {
            this.showToast("两次密码输入不一致！");
            return;
        }
        let inputs = {
            strAction: "updateMemberPwd2",
            password2: this.user.repass
        };
        let load = this.createLoading();
        this.commonService.loginPwd(inputs).subscribe(
            data => {
                load && load.dismiss();
                console.log(data);
                if (data["statusCode"] == 0) {
                    this.showToast("设置成功");
                    this.model = !this.model;
                } else {
                    this.showToast(data["message"]);
                }
            },
            err => {
                load && load.dismiss();
                console.error("ERROR", err);
            }
        );
    }

    // 关闭model
    closeModel() {
        this.model = !this.model;
    }


  chooseBank(){
      let profileModal = this.modalCtrl.create('bankList', {
          source:'bonus'
      });
      profileModal.onDidDismiss(data => {
          if(data){
              this.bankList = data;
          }
      });
      profileModal.present();
  }
}
