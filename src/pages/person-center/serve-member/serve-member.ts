import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,App } from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';


/**
 * Generated class for the ServeMemberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "serveMember",
  segment: "serveMember",
  defaultHistory: []
})
@Component({
  selector: 'page-serve-member',
  templateUrl: 'serve-member.html',
})
export class ServeMemberPage {
  principal:string = '';

  lowerMemberList = [];

  // 当前会员
  thisMember = {
    SEX:'',
    USER_CODE: '',
    MI_USER_NAME: '',
    LINK_NUM: '',
    LAYER_ID:'',
    TREE_INDEX:'',
    JOIN_DATE: '',
    W_WEEK: '',
    UPGRADE_SINGLE: '',
    UPGRADE_SINGLE_TOTAL: '',
    GROUP_PV: '',
    CURRENT_TOTAL_PV: '',
    MOBILETELE:'',
    CARD_TYPE:'',
    MEMBER_LEVEL:''
  }

  // 第一个下级会员
  lowerMember = {
    SEX:'',
    USER_CODE: '',
    MI_USER_NAME: '',
    LINK_NUM: '',
    LAYER_ID:'',
    TREE_INDEX:'',
    JOIN_DATE: '',
    W_WEEK: '',
    UPGRADE_SINGLE: '',
    UPGRADE_SINGLE_TOTAL: '',
    GROUP_PV: '',
    CURRENT_TOTAL_PV: '',
    MOBILETELE:'',
    CARD_TYPE:'',
    MEMBER_LEVEL:''
  }

 // 第二个下级会员
  lowerMember2 = {
    SEX:'',
    USER_CODE: '',
    MI_USER_NAME: '',
    LINK_NUM: '',
    LAYER_ID:'',
    TREE_INDEX:'',
    JOIN_DATE: '',
    W_WEEK: '',
    UPGRADE_SINGLE: '',
    UPGRADE_SINGLE_TOTAL: '',
    GROUP_PV: '',
    CURRENT_TOTAL_PV: '',
    MOBILETELE:'',
    CARD_TYPE:'',
    MEMBER_LEVEL:''
  }

  cardTypes = [];
  memberLevels = [];


  constructor(public navCtrl: NavController,
              public appCtrl: App, 
              public navParams: NavParams,
              public commonService: CommonService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,) {
  }

  ionViewDidLoad() {
    this.principal = localStorage.getItem('principal');
    this.getUserLevel();
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
      position: "middle",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  // 获取服务会员
  serveMember(){
    let self = this;
    let load = self.createLoading();

    this.commonService.wallet({
      strAction:'getAppLinkScore'
    }).subscribe(
      data => {
        load && load.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let arr = data.body.data;
          for(let i = 0;i<arr.length;i++){
            if(self.principal == arr[i].USER_CODE){
              self.thisMember = {
                SEX:arr[i]['SEX'],
                USER_CODE: arr[i]['USER_CODE'],
                MI_USER_NAME: arr[i]['MI_USER_NAME'],
                LINK_NUM: arr[i]['LINK_NUM'],
                LAYER_ID:arr[i]['LAYER_ID'],
                TREE_INDEX:arr[i]['TREE_INDEX'],
                JOIN_DATE: arr[i]['JOIN_DATE'],
                W_WEEK: arr[i]['W_WEEK'],
                UPGRADE_SINGLE: arr[i]['UPGRADE_SINGLE'],
                UPGRADE_SINGLE_TOTAL: arr[i]['UPGRADE_SINGLE_TOTAL'],
                GROUP_PV: arr[i]['GROUP_PV'],
                CURRENT_TOTAL_PV: arr[i]['CURRENT_TOTAL_PV'],
                MOBILETELE:arr[i]['MOBILETELE'],
                CARD_TYPE: this.findItemVal(arr[i]["CARD_TYPE"], this.cardTypes),
                MEMBER_LEVEL: this.findItemVal(arr[i]["MEMBER_LEVEL"], this.memberLevels),
              }
            }else {
              self.lowerMemberList.push(arr[i])
              
            }
          }
          console.log('self.lowerMemberList',self.lowerMemberList)

          if(self.lowerMemberList.length > 0){//是否由下级会员
              if(self.lowerMemberList.length >= 2){  //服务网下级会员只能有两个
                // 下级会员
                self.lowerMember = {
                    SEX:self.lowerMemberList[0]['SEX'],
                    USER_CODE: self.lowerMemberList[0]['USER_CODE'],
                    MI_USER_NAME: self.lowerMemberList[0]['MI_USER_NAME'],
                    LINK_NUM: self.lowerMemberList[0]['LINK_NUM'],
                    LAYER_ID: self.lowerMemberList[0]['LAYER_ID'],
                    TREE_INDEX:self.lowerMemberList[0]['TREE_INDEX'],
                    JOIN_DATE: self.lowerMemberList[0]['JOIN_DATE'],
                    W_WEEK: self.lowerMemberList[0]['W_WEEK'],
                    UPGRADE_SINGLE:self.lowerMemberList[0]['UPGRADE_SINGLE'],
                    UPGRADE_SINGLE_TOTAL: self.lowerMemberList[0]['UPGRADE_SINGLE_TOTAL'],
                    GROUP_PV: self.lowerMemberList[0]['GROUP_PV'],
                    CURRENT_TOTAL_PV: self.lowerMemberList[0]['CURRENT_TOTAL_PV'],
                    MOBILETELE: self.lowerMemberList[0]['MOBILETELE'],
                    CARD_TYPE: this.findItemVal(self.lowerMemberList[0]["CARD_TYPE"], this.cardTypes),
                    MEMBER_LEVEL: this.findItemVal(self.lowerMemberList[0]["MEMBER_LEVEL"], this.memberLevels),
                };

                // 下级会员
                self.lowerMember2 = {
                  SEX:self.lowerMemberList[1]['SEX'],
                  USER_CODE: self.lowerMemberList[1]['USER_CODE'],
                  MI_USER_NAME: self.lowerMemberList[1]['MI_USER_NAME'],
                  LINK_NUM: self.lowerMemberList[1]['LINK_NUM'],
                  LAYER_ID: self.lowerMemberList[1]['LAYER_ID'],
                  TREE_INDEX:self.lowerMemberList[1]['TREE_INDEX'],
                  JOIN_DATE: self.lowerMemberList[1]['JOIN_DATE'],
                  W_WEEK: self.lowerMemberList[1]['W_WEEK'],
                  UPGRADE_SINGLE:self.lowerMemberList[1]['UPGRADE_SINGLE'],
                  UPGRADE_SINGLE_TOTAL: self.lowerMemberList[1]['UPGRADE_SINGLE_TOTAL'],
                  GROUP_PV: self.lowerMemberList[1]['GROUP_PV'],
                  CURRENT_TOTAL_PV: self.lowerMemberList[1]['CURRENT_TOTAL_PV'],
                  MOBILETELE: self.lowerMemberList[1]['MOBILETELE'],
                  CARD_TYPE: this.findItemVal(self.lowerMemberList[1]["CARD_TYPE"], this.cardTypes),
                  MEMBER_LEVEL: this.findItemVal(self.lowerMemberList[1]["MEMBER_LEVEL"], this.memberLevels),
              };
            }else{
              // 下级会员
                self.lowerMember = {
                  SEX:self.lowerMemberList[0]['SEX'],
                  USER_CODE: self.lowerMemberList[0]['USER_CODE'],
                  MI_USER_NAME: self.lowerMemberList[0]['MI_USER_NAME'],
                  LINK_NUM: self.lowerMemberList[0]['LINK_NUM'],
                  LAYER_ID: self.lowerMemberList[0]['LAYER_ID'],
                  TREE_INDEX:self.lowerMemberList[0]['TREE_INDEX'],
                  JOIN_DATE: self.lowerMemberList[0]['JOIN_DATE'],
                  W_WEEK: self.lowerMemberList[0]['W_WEEK'],
                  UPGRADE_SINGLE:self.lowerMemberList[0]['UPGRADE_SINGLE'],
                  UPGRADE_SINGLE_TOTAL: self.lowerMemberList[0]['UPGRADE_SINGLE_TOTAL'],
                  GROUP_PV: self.lowerMemberList[0]['GROUP_PV'],
                  CURRENT_TOTAL_PV: self.lowerMemberList[0]['CURRENT_TOTAL_PV'],
                  MOBILETELE: self.lowerMemberList[0]['MOBILETELE'],
                  CARD_TYPE: this.findItemVal(self.lowerMemberList[0]["CARD_TYPE"], this.cardTypes),
                  MEMBER_LEVEL: this.findItemVal(self.lowerMemberList[0]["MEMBER_LEVEL"], this.cardTypes),
              }

            }
          }


          
          console.log(self.lowerMemberList)
        } else {
          this.showToast(data.message)
        }
      },
      err => {
        load && load.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  findItemVal(val, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i]["VALUE_CODE"] == val) {
        return list[i]["VALUE_TITLE"];
      }
    }
    return "";
  }

  getUserLevel() {
    this.commonService
      .order({
        strAction: "getAppMemberlevel"
      })
      .subscribe(
        res => {
          if(res.statusCode == 0){
              this.memberLevels = res.body["data"] || [];
              this.getCardTypes();
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  getCardTypes() {
    this.commonService
      .order({
        strAction: "getAppCardtype"
      })
      .subscribe(
        res => {
          this.cardTypes = res.body["data"] || [];
          this.serveMember();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }


  performance(obj){
    this.navCtrl.push('servePerformance',{userCode:obj.USER_CODE});
  }

  // back
  goBack(){
    this.appCtrl.getRootNav().push("tabs", { index: 3 });
  }

}
