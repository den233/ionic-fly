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
  name: "bonusDetail",
  segment: "bonusDetail",
  defaultHistory: []
})
@Component({
  selector: "page-bonus-detail",
  templateUrl: "bonus-detail.html"
})
export class BonusDetailPage {
  @ViewChild(Content) content: Content;
  @ViewChild('container') container: ElementRef;
  public modalShow: boolean = false;
  currentYear = new Date().getFullYear();
  items = [];
  showNull: boolean;
  startdate = "";
  enddate = "";
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
  bonusTypes = {
    layertouch_pv: "层碰奖",
    sametouch_pv: "对碰奖",
    leader_pv: "见点奖",
    harmony_pv: "管理奖",
    fee: "福利费",
    tax: "管理费",
    mallpoint: "重消",
    consumer_money: "报单费",
    bonus_pv: "总奖金",
    send_money: "应发奖金"
  };
  inputTotal = 0;
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
    // let temp = Number(this.selected["value"]);
    let temp = Number(this.selected["value"]);
    let date = Filter.getTimeBefor(temp);

    this.startdate =Filter.getTimeBefor('14').startdate;
    this.enddate = Filter.getTimeBefor('5').startdate;


    // let loading = this.createLoading();
    let inputs = {
      strAction: "getAppTimeBonusCalcs",
      startdate: this.startdate,
      enddate: this.enddate
    };
    this.commonService.home(inputs).subscribe(
      data => {
        // loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body || [];
          let total = 0;
          for (var i = 0; i < result.length; i++) {
            result[i]["SEND_MONEY"] = result[i]['SEND_MONEY'] ? Number(result[i]['SEND_MONEY']).toFixed(2) : '0';
            result[i]["BONUS_PV"] = result[i]['BONUS_PV'] ? Number(result[i]['BONUS_PV']).toFixed(2) : '0';
            result[i]["day"] = this.formatDate(result[i]["W_DAY"], "day");
            result[i]["year_month"] = this.formatDate(
              result[i]["W_DAY"],
              "month"
            );
            if(result[i]['SEND_MONEY'] > 0){
              total += Number(result[i]['SEND_MONEY']);
            }
          }
          this.inputTotal = total ? Number(total.toFixed(2)) : 0;
          this.items = result;
          console.log(this.items);
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
        // loading && loading.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  select(date) {
    this.selected = date;
    this.modalShow = !this.modalShow;
    this.loadData();
  }

  formatDate(str: string, type) {
    if (type == "day") {
      return str.toString().substring(6);
    } else {
      return str.toString().substring(0, 6);
    }
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
            let result = data.body || [];
            let arr = [];
            if(result && result.length){
              let list = result[0];
              for(let key in list){
                arr.push({
                  name: this.bonusTypes[key.toLowerCase()],
                  value: list[key] ? Number(list[key] || '0').toFixed(2) : '0'
                });
                console.log(this.bonusTypes[key.toLowerCase()],key.toLowerCase());

              }
            }
            item["list"] = arr;

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

  
}
