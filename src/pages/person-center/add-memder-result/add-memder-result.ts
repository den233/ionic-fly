import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddMemderResultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "addMemderResult",
  segment: "addMemderResult",
  defaultHistory: []
})
@Component({
  selector: 'page-add-memder-result',
  templateUrl: 'add-memder-result.html',
})
export class AddMemderResultPage {
  registerResult:string = '会员注册';
  isOk:boolean = true;
  tip:string = '会员注册成功'//注册新会员失败 激活成功 激活失败
  member = {
    usercode:'',
    password:''
  };
  source:string = 'new';//注册会员new 激活old

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.member.usercode = this.navParams.get('member').usercode;
    this.member.password = this.navParams.get('member').password;

    this.isOk = this.navParams.get('status');
    this.source = this.navParams.get('source');
    if(this.source == 'new'){//成功且注册
        
        this.tip = this.isOk ? '会员注册成功':'注册新会员失败';

    }else if(this.source == 'old'){

      this.registerResult = '老会员激活'
      this.tip = this.isOk ? '激活成功':'激活失败';
      this.member = this.navParams.get('msg');
      console.log(this.member)
    }
  }

  // back home
  goHome(){
    localStorage.removeItem('memberInfo');
    this.navCtrl.push('tabs',{index:0})
  }


}
