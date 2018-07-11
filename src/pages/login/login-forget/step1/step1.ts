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
  name: "forgetStep1",
  segment: "forgetStep1",
  defaultHistory: []
})
@Component({
  selector: 'page-step1',
  templateUrl: 'step1.html',
})
export class Step1Page {

  public user = {
    name: ""
  };
  public isSubmit: boolean;

  
  private loginForm: FormGroup;

  constructor(
  	private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController) {

  	this.loginForm = this.formBuilder.group({
      name: ["", Validators.required]
    });

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


  createLoading() {
        let loading = this.loadingCtrl.create({
            spinner: "ios"
        });
        loading.present();
        return loading;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Step1Page');
  }


  /**
   * 忘记密码下一步
   * @Shaoty
   * @DateTime  2017-12-13T10:50:21+0800
   */
  next(){

      let data = {
          'userCode':this.user.name,
          'strAction':'getMobileTele'
      };

      let load = this.createLoading();

      this.commonService.login(data).subscribe(
          res => {
              load && load.dismiss(); //关闭加载框

              if(res.statusCode == '2005'){
                  this.showToast('会员编码不存在，请重新输入');
              }else{
                  let data = {
                      title: "忘记密码",
                      source: "login",
                      principal: this.user.name
                  };
                  this.navCtrl.push("forgetStep2", data);
              }

          },
          err => {
              load && load.dismiss(); //关闭加载框
              console.error("ERROR", err);
          }
      );


  }

    goBack(){
      this.navCtrl.pop();
    }

}
