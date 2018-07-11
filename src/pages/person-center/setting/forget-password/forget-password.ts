import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../../providers/common.service";

@IonicPage({
  name: "forgetPassword",
  segment: "forgetPassword",
  defaultHistory: []
})
@Component({
  selector: "page-forget-password",
  templateUrl: "forget-password.html"
})
export class ForgetPasswordPage {
  public user = {
    pass: "",
    repass: ""
  };
  params = {};
  public isSubmit: boolean;
  title: string; // from title
  placeholder: string; //from placeholder
  source: string; //from source
  private loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {
    this.title = navParams.get("title") || "忘记密码";
    this.placeholder = navParams.get("placeholder") || "新的登录密码";
    this.source = navParams.get("source") || "login";
    this.loginForm = this.formBuilder.group({
      pass: ["", Validators.required],
      repass: ["", Validators.required]
    });
  }

  ionViewDidLoad() {}
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

  next() {
    if (this.user.pass.length < 6 || this.user.pass.length > 20) {
      this.showToast("请输入6-20位字符的密码！");
      return;
    }
    if (this.user.pass != this.user.repass) {
      this.showToast("两次密码输入不一致！");
      return;
    }
    let inputs = {
      strAction: this.source == "login" ? "updateMemberPwd" : "updateMemberPwd2"
    };
    if (this.source == "login") {
      inputs["password"] = this.user.repass;
    } else {
      inputs["password2"] = this.user.repass;
    }
    let load = this.createLoading();
    this.commonService.loginPwd(inputs).subscribe(
      data => {
        load && load.dismiss();
        console.log(data);
        if (data["statusCode"] == 0) {
          this.showToast("修改成功");
          this.feedback();
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

  feedback() {
    if (this.source == "login") {
      this.navCtrl.push("login");
    } else {
      this.navCtrl.push("setting");
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
