import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';

/**
 * Generated class for the SellMemberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "sellMember",
  segment: "sellMember",
  defaultHistory: []
})
@Component({
  selector: 'page-sell-member',
  templateUrl: 'sell-member.html',
})
export class SellMemberPage {
  detailShow;
  principal:string = '';
  lowerMemberList = [];

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
  isDetail: boolean;

  cardTypes = [];
  memberLevels = [];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public commonService: CommonService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,) {
  }

  ionViewDidLoad() {
    this.principal = localStorage.getItem('principal');
    this.loadData();
  }

  loadData(){
    this.getUserLevel()
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

  // 获取销售会员
  sellMember(){
    let self = this;
    let load = self.createLoading();

    this.commonService.wallet({
      strAction:'getAppRecommendScore'
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
                LINK_NUM: arr[i]['RE_NUM'],
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
              self.lowerMemberList.push({
                SEX:arr[i]['SEX'],
                USER_CODE: arr[i]['USER_CODE'],
                MI_USER_NAME: arr[i]['MI_USER_NAME'],
                LINK_NUM: arr[i]['RE_NUM'],
                LAYER_ID:arr[i]['LAYER_ID'],
                TREE_INDEX:arr[i]['TREE_INDEX'],
                JOIN_DATE: arr[i]['JOIN_DATE'],
                W_WEEK: arr[i]['W_WEEK'],
                UPGRADE_SINGLE: arr[i]['UPGRADE_SINGLE'],
                UPGRADE_SINGLE_TOTAL: arr[i]['UPGRADE_SINGLE_TOTAL'],
                GROUP_PV: arr[i]['GROUP_PV'],
                CURRENT_TOTAL_PV: arr[i]['CURRENT_TOTAL_PV'],
                MOBILETELE:arr[i]['MOBILETELE'],
                isShow:false,
                tip:'详情',
                CARD_TYPE: this.findItemVal(arr[i]["CARD_TYPE"], this.cardTypes),
                MEMBER_LEVEL: this.findItemVal(arr[i]["MEMBER_LEVEL"], this.memberLevels),
              })
              
            }
          }
          
          console.log('下级会员',self.lowerMemberList)
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
          this.sellMember();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }


  // 详情
  detailShowClick(item){
    item.isShow = !item.isShow;
    item.tip = '收起';
  }

  performance(obj){
    this.navCtrl.push('sellPerformance',{userCode:obj.USER_CODE});
  }

  // back
  goBack(){
    // this.navCtrl.push('tabs',{index:3});
      this.navCtrl.popToRoot();
  }

}
