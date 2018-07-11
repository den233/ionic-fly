/**
 * create by pangmiaoran
 */
import { Component } from '@angular/core';
import { IonicPage,NavController } from 'ionic-angular';

@IonicPage({
  name: "secondPassword",
  segment: "secondPassword",
  defaultHistory: []
})
@Component({
  selector: 'page-second-password',
  templateUrl: 'second-password.html'
})
export class SecondPasswordPage {

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
  }


  // update password
  goUpdatePwd(){
    this.navCtrl.push('setOldPassword',{
      title: '修改二级密码',
      placeholder: '输入原二级密码',
      source: 'second'
    });
  }
   // forget password
   goForgetPwd(){
    let data = {
      title: "忘记二级密码",
      source: "second"
    };
    this.navCtrl.push("sendCheckCode", data);
  }
}
