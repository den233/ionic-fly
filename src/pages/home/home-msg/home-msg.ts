import { Component } from '@angular/core';
import {
  App,
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";
@IonicPage({
  name: "homeMsg",
  segment: "homeMsg",
  defaultHistory: []
})
@Component({
  selector: 'page-home-msg',
  templateUrl: 'home-msg.html',
})
export class HomeMsgPage {
  items = [];
  showNull: boolean;
  pagination = {
    page: 0,
    size: 10,
    totalCount: 0
  }; // 分页
  parentTab: number = 1;
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {

  }

  ionViewDidLoad() {
    this.loadData();
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

  // tab切换
  changeStatus(i:number){
    this.parentTab = i;
    this.loadData();
  }
  
  // load
  loadData(){
    let self = this;
    let loading = this.createLoading();
    this.commonService.home({
      strAction:'getAppAnnounces2',
      classno: this.parentTab
      }).subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          if(data.statusCode == 0){
            self.items = data.body || [];
          }else{
            this.showToast(data.message);
          }
        },
        err => {
          loading && loading.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
    );
  }

  // 首页
  goBack(){
    this.appCtrl.getRootNav().push("tabs", { index: 0 });
  }

  // go detail
  goDetail(id){
    this.navCtrl.push('homeMsgDetial',{
      id: id,
      infoType: this.parentTab
    })
  }
}
