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
import { CommonService } from "../../../../providers/common.service";

@IonicPage({
  name: "sendCheckCode",
  segment: "sendCheckCode",
  defaultHistory: []
})
@Component({
  selector: "page-send-check-code",
  templateUrl: "send-check-code.html"
})
export class SendCheckCodePage {
  checkCode = "";
  mobile = "";
  phone = "";
  btnColor = "secondary";
  title: string; // from title
  source: string; //from source
  // 验证码倒计时
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  };
  principal: string;
  isUpdatePhone: boolean; // go set new phone
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
    this.title = navParams.get("title") || "修改手机号码";
    this.source = navParams.get("source") || "login";
    this.principal = navParams.get("principal") || "";
    this.isUpdatePhone = navParams.get("isUpdatePhone") || false;
    this.form = this.formBuilder.group({
      checkCode: ["", Validators.required]
    });
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
    this.getPhoneByPrincipal();
  }

  // get user phone by principal
  getPhoneByPrincipal() {
    if (!this.principal) {
      this.principal = localStorage.getItem("principal");
    }
    let loading = this.createLoading();
    this.commonService
      .loginPwd({
        strAction: "getMobileTele",
        userCode: this.principal
      })
      .subscribe(
        data => {
          loading && loading.dismiss();
          if (data.statusCode == 0) {
            this.phone = data.body;
            if (this.phone && this.phone != 'null') {
              this.mobile =
                this.phone.substring(0, 3) +
                "****" +
                this.phone.substring(7, 11);
            }
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

  // submit
  submit() {
    let loading = this.createLoading();
    this.commonService
      .loginPwd({
        strAction: "validateVal",
        validate: this.checkCode
      })
      .subscribe(
        data => {
          loading && loading.dismiss();
          if (data.statusCode == 0) {
           // 修改手机，跳转到设置新手机页
            if (this.isUpdatePhone) {
              this.navCtrl.push("setNewMobile");
            } else { // 修改密码，跳转到甚至新密码页
              let data = {
                title: this.source == "login" ? "修改登录密码" : "修改二级密码",
                placeholder:
                  this.source == "login" ? "新的登录密码" : "新的二级密码",
                source: this.source
              };
              this.navCtrl.push("forgetPassword", data);
            }
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
}
