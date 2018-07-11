/**
 * create by pangmiaoran
 */
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from '../../providers/common.service';
import * as crypto from 'crypto';

@IonicPage({
  name: "login",
  segment: "login",
  defaultHistory: []
})

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  togglePassword: string = "password";
  user = {
    name: "",
    password: "",
    checkcode: ""
  };
  isSubmit: boolean;
  isSaveName: boolean = false;
  public md5;

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  private loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public commonService: CommonService
  ) {
    this.loginForm = this.formBuilder.group({
      name: ["", Validators.required],
      password: ["", Validators.required],
      islogin: [""]
    });
  }

  ngOnInit() {
    localStorage.removeItem("tokenid");
  }

  ionViewDidLoad() {
      let principal = localStorage.getItem('principal');
      let password = localStorage.getItem('password');

      if(principal!=null && password!=null){
        this.user.name = principal;
        this.user.password = this.uncompileStr(password);
        this.isSaveName = true;
      }
  }

  /**
   * 加密解密
   * @param code
   * @returns {any}
   */
  compileStr(str){
      str = str.toString();
      let a = crypto.createCipher('aes-256-cbc','InmbuvP6Z8');
      let A = a.update(str.toString(),'utf8','hex');
      let B = A + a.final('hex');
      return B;
  }

  uncompileStr(str){
      str = str.toString();
      let decipher = crypto.createDecipher('aes-256-cbc','InmbuvP6Z8');
      let dec = decipher.update(str.toString(),'hex','utf8');
      dec += decipher.final('utf8');
      return dec;
  }

    // 初始化loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }

  login() {
    localStorage.removeItem('area');
    localStorage.removeItem('tokenid');
    
    let self = this;
    if (!self.loginForm.valid) {
      return;
    }

    let name = self.user.name.replace(/\s+/g,"")

    let inputs = {
      principal: name,
      password: self.user.password
    };

    let load = self.createLoading();

    this.commonService.login(inputs).subscribe(
      data => {

     

        if (data.statusCode == 0) {

          let token = data["tokenid"];

          localStorage.setItem("tokenid", token);
          this.getArea();

          /**
           * 若记住密码&&登陆成功，则保存密码
           */
         
           
            if(self.isSaveName){

              localStorage.setItem("principal", inputs.principal);
  
              localStorage.setItem("password", self.compileStr(inputs.password));
            }
            load && load.dismiss(); //关闭加载框
            self.showToast('登录成功');
  
            this.navCtrl.push('tabs');
          
          

        } else {
          self.showToast('登录失败');
        }
      },
      err => {
        load && load.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  //获取地区
  getArea(){
    let data = {
      strAction:'getRegionInfo'
    };
    this.commonService.area(data).subscribe(
      data => {
        if (data.statusCode == 0) {
          localStorage.setItem("area", JSON.stringify(data.body));
          
        } 
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  togglePwd() {
    if (this.togglePassword == "text") {
      this.togglePassword = "password";
    } else {
      this.togglePassword = "text";
    }
  }
  // 忘记密码
  forgetPwd() {
    this.navCtrl.push('forgetStep1');
  }

    /**
     * 记住密码
     */
  save(){
      this.isSaveName = !this.isSaveName;
  }
}
