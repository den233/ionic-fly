import { Component, ViewChild , ElementRef  } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  NavParams,
  Content
} from "ionic-angular";
import { CommonService } from "../../../../providers/common.service";
import { Filter } from "../../../../providers/filter";

@IonicPage({
  name: "bonusTradeDetail",
  segment: "bonusTradeDetail",
  defaultHistory: []
})
@Component({
  selector: "page-bonus-trade-detail",
  templateUrl: "bonus-trade-detail.html"
})
export class BonusTradeDetailPage {
  @ViewChild(Content) content: Content;
  @ViewChild('container') container: ElementRef;
  public modalShow: boolean = false;
  startdate = "";
  enddate = "";
  currentYear = new Date().getFullYear();
  items = [];
  showNull: boolean;
  selected = {
    title: "昨日",
    value: "1"
  };
  filter = [
    {
      title: "昨日",
      value: "1"
    },
    {
      title: "近一周",
      value: "7"
    },
    {
      title: "近一月",
      value: "30"
    },
    {
      title: "近三月",
      value: "90"
    }
  ];
  total = 0;
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {}

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
      duration: 1000,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  ionViewDidEnter() {
    this.loadData();
    this.toggleHide();
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

  goBack() {
    this.navCtrl.pop();
  }

  chooseTime() {
    this.modalShow = !this.modalShow;
  }

  loadData() {
    let temp = 10;
    let date = Filter.getTimeBefor(temp);

    this.startdate = date.startdate;
    this.enddate = date.enddate;
    console.log(date);
    let loading = this.createLoading();
    let inputs = {
      strAction: "getAppBankbookJournals",
      bankbookType: 1,
      startdate: date.startdate,
      enddate: date.enddate
    };
    this.commonService.wallet(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body["data"] || [];
          let total = 0;
          for(let item of result){
            item['MONEY'] = item['MONEY'] ? Number(item['MONEY']).toFixed(2) : 0;
            if(item['DEAL_TYPE'] == 'D' && item['MONEY'] > 0){
              total += item['MONEY'] ? Number(item['MONEY']) : 0;
            }
          }
          this.total = total ? Number(total.toFixed(2)) : 0;
          this.items = result;
          // 非空判断
          if (this.items.length > 0) {
            this.showNull = false;
          } else {
            this.showNull = true;
          }
        } else {
          this.showToast(data.message);
        }
      },
      err => {
        loading && loading.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  select(date) {
    this.selected = date;
    this.modalShow = !this.modalShow;
    this.loadData();
  }

  detail(item) {
    let flag = item["isOpen"] || false;
    if (flag) {
      item["isOpen"] = !flag;
      return;
    }
    let loading = this.createLoading();
    this.commonService
      .home({
        strAction: "getAppBonusCalcsDeatil",
        id: item["ID"]
      })
      .subscribe(
        data => {
          loading && loading.dismiss(); //关闭加载框
          if (data.statusCode == 0) {
            item["list"] = data.body || [];

            item["isOpen"] = !flag;
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          loading && loading.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
      );
  }

  toggle(item) {
    let flag = item["isOpen"] || false;
    if (flag) {
      item["isOpen"] = !flag;
      return;
    }
    item["isOpen"] = !flag;
  }
}
