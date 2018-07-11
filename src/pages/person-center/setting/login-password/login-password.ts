/**
 * create by pangmiaoran
 */
import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";

@IonicPage({
  name: "loginPassword",
  segment: "loginPassword",
  defaultHistory: []
})
@Component({
  selector: "page-login-password",
  templateUrl: "login-password.html"
})
export class LoginPasswordPage {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}

  // update password
  goUpdatePwd() {
    this.navCtrl.push("setOldPassword", {
      title: "修改登录密码",
      placeholder: "输入原登录密码",
      source: "login"
    });
  }
  // forget password
  goForgetPwd() {
    let data = {
      title: "忘记登录密码",
      source: "login"
    };
    this.navCtrl.push("sendCheckCode", data);
  }
}
