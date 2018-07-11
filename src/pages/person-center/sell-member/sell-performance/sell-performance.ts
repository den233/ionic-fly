import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { CommonService } from '../../../../providers/common.service';
import * as $ from "jquery";
import { Filter } from "../../../../providers/filter";

/**
 * Generated class for the SellPerformancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "sellPerformance",
  segment: "sellPerformance",
  defaultHistory: []
})
@Component({
  selector: 'page-sell-performance',
  templateUrl: 'sell-performance.html',
})
export class SellPerformancePage {
  userCode:string = '';
  
    memberInfo = {
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
      MOBILETELE:''
    }
  
    // 业绩详情
    performanceDetail = {
      group:'',
      single:''
    };
  
    level;//层数
  
    public modalShow:boolean = false;
    // 默认获取当日
    time = 1;
  
    // 时间区间
    startdate = '';
    enddate = '';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public commonService: CommonService,) {
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

  ionViewDidLoad() {
    this.userCode = this.navParams.get('userCode') || '';
    this.loadData()
  }

  loadData(){
    let date = Filter.getTimeBefor(1);
    this.singleMember();
    this.totalMember(date)
  }

  // 选择时间model
  chooseTime(){
    this.modalShow = !(this.modalShow);
  }

  // 选择时间获取业绩详情
  selectDate(num){
    this.time = num;
    let date = Filter.getTimeBefor(num);
    console.log(date)
    this.modalShow = !(this.modalShow);
    if(num == 1){//当天
      this.totalMember(date)
    }else if(num == 7){//近一周
      this.totalMember(date)
    }else if(num == 30){//近一月
      this.totalMember(date)
    }else if(num == 90){//近三月
      this.totalMember(date)
    }

  }

   // 获取个人服务会员信息
   singleMember(){
    let self = this;
    let params = {
      strAction:'getAppScoreByUsercode',
      usercode:self.userCode,
    }

    let load = self.createLoading();

    this.commonService.wallet(params).subscribe(
      data => {
        load && load.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let arr = data.body.data[0] || {};
          if(arr){
              if(arr.UPGRADE_SINGLE == '0'){
                arr.UPGRADE_SINGLE = '0.00';
              }else if(arr.CURRENT_TOTAL_PV == '0'){
                arr.CURRENT_TOTAL_PV = '0.00';
              }else if(arr.GROUP_PV == '0'){
                arr.GROUP_PV = '0.00';
              }
              this.memberInfo = arr;
          }

          console.log('performanceDetail',this.performanceDetail)
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

  // 获取业绩详情
  totalMember(date){
    let self = this;
    let params = {
      strAction:'getAppScoreByUsercode',
      usercode:self.userCode,
      startdate:date.startdate,
      enddate:date.enddate
    }
    
    let load = self.createLoading();

    this.commonService.wallet(params).subscribe(
      data => {
        load && load.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let arr = data.body.data[0];
          if(arr){
            this.performanceDetail = {
              single:arr.UPGRADE_SINGLE,
              group: arr.CURRENT_TOTAL_PV
            };
            
          }
            
          
          console.log('详情',data)
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


  // back
  goBack(){
    this.navCtrl.push('sellMember')
  }

}
