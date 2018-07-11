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
  name: "forgetStep3",
  segment: "forgetStep3",
  defaultHistory: []
})
@Component({
  selector: "page-step3",
  templateUrl: "step3.html"
})
export class Step3Page {
  public user = {
      pass: "",
      repass: "",
      userCode:''
  };
  params = {};
  public isSubmit: boolean;
  title: string; // from title
  placeholder: string = '请设置登录密码'; //from placeholder
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
    this.user.userCode = navParams.get('userCode');
    console.log(navParams.get('userCode'))
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
      duration: 1500,
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
      strAction: 'updateMemberPwdNoToken'
    };

    inputs['password'] = this.user.repass;
    inputs['userCode'] = this.user.userCode;

    console.log(inputs)

    let load = this.createLoading();
    this.commonService.login(inputs).subscribe(
      data => {
        load && load.dismiss();
        console.log(data);
        if (data["statusCode"] == 0) {
          this.showToast('修改成功,即将跳转到登录页');
          setTimeout(()=>{
              this.navCtrl.push("login");
          },1500);
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

  feedback(){
    
  }

    goBack(){
        this.navCtrl.pop();
    }
}
