import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController} from 'ionic-angular';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";
import { convertEnumToColumn } from "ion-multi-picker";
import citise from '../../../assets/chinese-cities.json';
import { CommonService } from '../../../providers/common.service';
import * as $ from "jquery";

/**
 * Generated class for the OldMemberActivationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "oldMemberActivation",
  segment: "oldMemberActivation",
  defaultHistory: []
})
@Component({
  selector: 'page-old-member-activation',
  templateUrl: 'old-member-activation.html',
})
export class OldMemberActivationPage {
  // area
  init = {
    poArea:''
  };
  cityColumns: any[];
  tabIndex;

  nameShow:boolean = false;

  // memberInfo
  member = {
    userCode:'',
    poFirstName:'',
    poMobiletele:'',
    poProvince:'',
    poCity:'',
    poDistrict:'',
    poAddress:'',
    areaStr:''
  }
  oldMember = {
    membername:'',
    show:false
  }

  private addMemberForm: FormGroup;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public commonService: CommonService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,) {
      this.addMemberForm = this.formBuilder.group({
        userCode: ["", Validators.required],        
        membername: [""],        
        poFirstName: ["", Validators.required],
        poMobiletele: ["", Validators.compose([
          Validators.required,
          Validators.pattern('1[34578]\\d{9}')
        ])],
        poArea: ["", Validators.required],
        poAddress: ["", Validators.required],
      });
      // city columns
      let area = JSON.parse(localStorage.getItem("area"));
      this.cityColumns = area;
      this.tabIndex = this.navParams.get('tabIndex') || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OldMemberActivationPage');
  }

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

  // 老会员校验
  registerMember(str){
    this.oldMember.membername = '';
    let self = this;
    let member = {
      userCode:this.member.userCode,
      strAction:'getActiveMiMember',
    }

    if(self.member.userCode == ''){
      this.showToast('请填写编号')
      return;
    }
      let load = self.createLoading();

      this.commonService.verifyMember(member).subscribe(
        data => {
          load && load.dismiss(); //关闭加载框
          if(data.statusCode == 0){
            if(str == 1){
              localStorage.setItem('memberInfo',JSON.stringify(self.member));
              this.navCtrl.push('firstOrder',{old:true});
              console.log('member',self.member)
  
            }else{
              this.memberInfo();
            }
              self.showToast(data.message);
          }else{
            self.showToast(data.message)
            return;
          }
        },
        err => {
          load && load.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
      );
    
  }

  // 查询会员信息
  memberInfo(){
   
    let data = {
      strAction:'getMemberInfo',
      usercode:this.member.userCode
    }
    this.commonService.modification(data).subscribe(
      data => {
        if (data.statusCode == 0) {
          this.oldMember.show = true;
          let memberInfo = data.body;
          this.oldMember.membername = memberInfo.MI_USER_NAME;
          // this.member = {
          //   userCode:'',
          //   poFirstName:'',
          //   poMobiletele:'18358334361',
          //   poProvince:'131424',
          //   poCity:'1356',
          //   poDistrict:'131425',
          //   poAddress:'左边',
          //   areaStr:''
          // }
          console.log( this.oldMember.membername)
        } else {
          this.oldMember.membername = '';
          this.showToast(data.message)
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  goBack(){
    if(this.tabIndex){
      // this.navCtrl.push('tabs',{index:this.tabIndex});
        this.navCtrl.popToRoot();
    }else{
      this.navCtrl.pop();
    }
  }

  next(){
    let self = this;
    let areaStr = '';
    // 处理地区数据
    self.member.poProvince = this.init.poArea.split(" ")[0];
    self.member.poCity = this.init.poArea.split(" ")[1];
    self.member.poDistrict = this.init.poArea.split(" ")[2];
    areaStr = $('.multi-picker-text').text();
    self.member.areaStr =  areaStr + self.member.poAddress;
    self.registerMember(1);
    // localStorage.setItem('memberInfo',JSON.stringify(self.member));
    // this.navCtrl.push('firstOrder',self.member);
  }
}
