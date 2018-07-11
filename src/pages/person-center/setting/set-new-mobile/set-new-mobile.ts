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
  name: "setNewMobile",
  segment: "setNewMobile",
  defaultHistory: []
})
@Component({
  selector: "page-set-new-mobile",
  templateUrl: "set-new-mobile.html"
})
export class SetNewMobilePage {
  mobile = "";
  newMobile = "";
  title: string; // from title
  source: string; //from source
  // 验证码倒计时
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  };
  principal: string;
  checkCode: string;
  btnColor = "secondary";

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
    this.form = this.formBuilder.group({
      checkCode: ["", Validators.required],
      newMobile: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("1[34578]\\d{9}")
        ])
      ]
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
  ngOnInit() {}
  // get check code
  sendCode() {
    if (!this.newMobile) {
      this.showToast("请输入手机号");
      return;
    }
    if (!this.principal) {
      this.principal = localStorage.getItem("principal");
    }
    let loading = this.createLoading();
    this.commonService
      .loginPwd({
        strAction: "validateUserCode",
        mobileTele: this.newMobile,
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
  next() {
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
            // update mobile
            this.updateMobile();
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
  // update mobile
  updateMobile(){
    let loading = this.createLoading();
    this.commonService
      .modification({
        strAction: "modifyMemberInfo",
        mobileTele: this.newMobile
      })
      .subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          let params = {};
          if (data.statusCode == 0) {
            params = {
              isOk: true,
              title: "重设完成",
              tip: "重设手机成功！"
            };
          } else {
            params = {
              isOk: false,
              title: "修改失败",
              tip: "修改手机号码失败"
            };
          }
          this.navCtrl.push("feedBack", params);
        },
        err => {
          loading && loading.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
      );
  }
}
