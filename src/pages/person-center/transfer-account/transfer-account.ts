/**
 * create by pangmiaoran
 */
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
  ViewController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../providers/common.service";
import { convertEnumToColumn } from "ion-multi-picker";

@IonicPage({
  name: "transferAccount",
  segment: "transferAccount",
  defaultHistory: []
})
@Component({
  selector: "page-transfer-account",
  templateUrl: "transfer-account.html"
})
export class TransferAccountPage {
  isSubmit: boolean;
  title: string;
  cityColumns: any[];
  areaData = [];
  area = "";
  transfer = {
    account: "",
    name: "",
    money: "",
    remark: "",
    code: ""
  };
  user = {
    pass: "",
    repass: ""
  };
  // 验证码倒计时
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  };
  phone = "";
  tabType = 3;
  model: boolean = false;
  payObj = {
    bonus: "",
    wallet: ""
  };
  btnColor = "secondary";
  principal = "";
  private form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController
  ) {
    this.form = this.formBuilder.group({
      account: ["", Validators.required],
      name: [""],
      money: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "(^[1-9]([0-9]+)?(\\.[0-9]{0,2})?$)|(^(0){2}$)|(^[0-9]\\.[0-9]([0-9])?$)"
          )
        ])
      ],
      code: [""],
      remark: [""]
    });
    let area = JSON.parse(localStorage.getItem("area"));
    this.cityColumns = area;
  }

  // loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }

  // toast
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  // init
  ngOnInit() {
    this.principal = localStorage.getItem("principal");
    this.loadWallet();
    this.getUserInfo();
  }

  goBack() {
    this.navCtrl.pop();
  }

  // 获取当前账号的手机号码
  getUserInfo() {
    let loading = this.createLoading();
    this.commonService.modification({ strAction: "getMemberInfo" }).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body || {};
          this.phone = result["MOBILETELE"];
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

  // get check code
  sendCode() {
    let loading = this.createLoading();
    this.commonService
      .loginPwd({
        strAction: "validateUserCode",
        mobileTele: this.phone,
        userCode: this.principal
      })
      .subscribe(
        data => {
          loading && loading.dismiss();
          if (data.statusCode == 0) {
            //发送验证码成功后开始倒计时
            this.verifyCode.disable = false;
            this.countDown();
            this.btnColor = !this.verifyCode.disable ? "gray" : "secondary";
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          loading && loading.dismiss();
          console.error("ERROR", err);
        }
      );
  }

  // countDown
  countDown() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      this.btnColor = !this.verifyCode.disable ? "gray" : "secondary";
      return;
    } else {
      this.verifyCode.countdown--;
    }

    this.verifyCode.verifyCodeTips =
      "重新发送(" + this.verifyCode.countdown + "s)";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips =
        "重新发送(" + this.verifyCode.countdown + "s)";
      this.countDown();
    }, 1000);
  }

  // 加载钱包、奖金金额
  loadWallet() {
    let loading = this.createLoading();
    this.commonService
      .wallet({
        strAction: "getAppBankbookBalances"
      })
      .subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          if (data.statusCode == 0) {
            let arr = data.body.data || [];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]["BANKBOOK_TYPE"] == 3) {
                // 电子钱包账户
                this.payObj.wallet = arr[i].BALANCE;
              }
              if (arr[i]["BANKBOOK_TYPE"] == 1) {
                // 奖金账户
                this.payObj.bonus = arr[i].BALANCE;
              }
              console.log(this.payObj);
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

  // 全部转出
  transferAll() {
    this.transfer.money =
      this.tabType == 3 ? this.payObj.wallet : this.payObj.bonus;
  }

  // 根据会员编号查询会员名称
  searchUser() {
    if (!this.transfer.account) {
      this.showToast("请输入要查询的会员账号");
      return;
    }
    let loading = this.createLoading();
    this.commonService
      .modification({
        usercode: this.transfer.account,
        strAction: "getMemberInfo"
      })
      .subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          if (data.statusCode == 0) {
            let result = data.body || {};
            this.transfer.name = result["MI_USER_NAME"];
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

  changeTab(type) {
    this.tabType = type;
  }

  // 转账提交-1
  transferSure() {
    if (!this.transfer.code) {
      this.showToast("请先验证手机号码");
      return;
    }
    //奖金钱包合法验证
    if (this.tabType == 3 && this.transfer.money > this.payObj.wallet) {
      this.showToast("钱包余额不足");
      return;
    }

    if (this.tabType == 1 && this.transfer.money > this.payObj.bonus) {
      this.showToast("奖金余额不足");
      return;
    }
    this.validCheckCode();
  }

  // 验证短信验证码 -2
  validCheckCode() {
    let loading = this.createLoading();
    this.commonService
      .loginPwd({
        strAction: "validateVal",
        validate: this.transfer.code
      })
      .subscribe(
        data => {
          loading && loading.dismiss();
          if (data.statusCode == 0) {
            this.validSecondPassword();
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          loading && loading.dismiss();
          console.error("ERROR", err);
        }
      );
  }

  // 验证二级密码是否存在 -3
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

  // 转账输入支付密码 -4
  pay() {
    let self = this;
    let prompt = this.alertCtrl.create({
      title: "高级密码",
      message: "转账￥" + this.transfer.money,
      inputs: [
        {
          name: "password",
          placeholder: "",
          type: "password"
        }
      ],
      buttons: [
        {
          text: "暂不支付",
          handler: data => {}
        },
        {
          text: "确认支付",
          handler: data => {
            if (!data.password) {
              self.showToast("请输入支付密码");
              return;
            }
            let load = self.createLoading();
            this.commonService
              .getTransfer({
                strAction: "transferAccounts",
                password2: data.password,
                zhtype: self.tabType,
                outMoney: self.transfer.money,
                userInCode: self.transfer.account,
                remark: self.transfer.remark
              })
              .subscribe(
                data => {
                  load && load.dismiss(); //关闭加载框
                  if (data.statusCode == 0) {
                    this.navCtrl.push('commonResult',{
                      transferType: this.tabType,
                      transferMoney: this.transfer.money
                    });
                  } else {
                    this.showToast(data.message);
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
    prompt.present();
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
}
