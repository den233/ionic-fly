import { Component, ViewChild , ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,Content } from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';

@IonicPage({
    name: "repeatSales",
    segment: "repeatSales",
    defaultHistory: []
})

@Component({
  selector: 'page-repeat-sales',
  templateUrl: 'repeat-sales.html',
})
export class RepeatSalesPage {
  @ViewChild(Content) content: Content;
  @ViewChild('container') container: ElementRef;
  showNull:boolean = false;
  public repeatList;
  public MAX;
  public isFinished = '已达标';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public commonService: CommonService,
              ) {
  }

  // 初始化loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }

    toggleHide(){
        let ele = this.container.nativeElement;
        this.content.ionScroll.subscribe(($event: any) => {
            let top = $event.scrollTop;
            if(top > 45){
                this.removeClass(ele,'hide');
            }
            if(top <= 45){
                this.addClass(ele,'hide');
            }

        })

    }

    addClass(ele, cls) {
        if (!this.hasClass(ele, cls)) {
            ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
        }
    }

    removeClass(ele, cls) {
        if (this.hasClass(ele, cls)) {
            var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            ele.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }

    hasClass(ele, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false;
        return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
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
    this.loadData();
    this.toggleHide();
  }

  // 加载数据
  loadData(){
    let self = this;
    let load = self.createLoading();

    this.commonService.wallet({
      strAction:'getAppSpReconsumptions',
      }).subscribe(
        data => {
          load && load.dismiss(); //关闭加载框
          if(data.statusCode == 0){
              if(data.body.length > 0){
                this.repeatList = data.body || [];
                this.getTime();
              }else{
                this.showNull = true;
              }
              
          }else{
            this.showToast(data.message)
          }
        },
        err => {
          load && load.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
    );
  }

  getTime(){
      this.commonService.wallet({
          strAction:'getMaxSpReconsumptions',
      }).subscribe(
          data => {
              if(data.statusCode == 0){
                  this.MAX = data.body[0]['MAX(W_MONTH)'];
                  let month = new Date().getMonth()+1;
                  for(let i in this.repeatList){
                        this.repeatList[i]['isShow'] = false;
                      if(this.repeatList[i]['MONTH'] == month){

                        if(this.repeatList[i]['AMOUNT']>=100){
                            this.isFinished = '已达标';
                        }else{
                            this.isFinished = '未达标';
                        }

                      }
                  }
              }else{
                  this.showToast(data.message)
              }
          },
          err => {
              console.error("ERROR", err);
          }
      );
  }

  goBack(){
    this.navCtrl.pop();
  }

  toggle(item){
    item.isShow = !item.isShow;
  }

}
