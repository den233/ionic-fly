import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { CommonService } from "../../../../providers/common.service";

@IonicPage({
  name: "setOldPassword",
  segment: "setOldPassword",
  defaultHistory: []
})
@Component({
  selector: "page-set-old-password",
  templateUrl: "set-old-password.html"
})
export class SetOldPasswordPage {
  password = "";
  isSubmit: boolean;
  title: string; // from title
  placeholder: string; //from placeholder
  source: string; //from source

  private form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public commonService: CommonService
  ) {
    this.title = navParams.get("title") || "修改登录密码";
    this.placeholder = navParams.get("placeholder") || "输入原登录密码";
    this.source = navParams.get("source") || "login";
    this.form = this.formBuilder.group({
      password: ["", Validators.required]
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
    let inputs = {
      strAction: this.source == "login" ? "validateMemberPwd" : 'validateMemberPwd2'
    };
    if(this.source =='login'){
      inputs['password'] = this.password;
    }else{
      inputs['password2'] = this.password;
    }
    let load = this.createLoading();
    this.commonService.loginPwd(inputs).subscribe(
      data => {
        load && load.dismiss();
        console.log(data);
        if (data["statusCode"] == 0) {
          let data = {
            title: this.source == 'login' ? '修改登录密码' : '修改二级密码',
            placeholder: this.source == 'login' ? '新的登录密码' : '新的二级密码',
            source: this.source
          }
          this.navCtrl.push("forgetPassword", data);
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
}
