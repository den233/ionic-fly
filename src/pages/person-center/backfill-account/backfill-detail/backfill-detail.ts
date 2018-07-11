import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  ToastController,
  PopoverController
} from 'ionic-angular';
import { CommonService } from '../../../../providers/common.service';
import { Filter } from "../../../../providers/filter";

/**
 * Generated class for the BackfillDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "backfillDetail",
  segment: "backfillDetail",
  defaultHistory: []
})
@Component({
  selector: 'page-backfill-detail',
  templateUrl: 'backfill-detail.html',
})
export class BackfillDetailPage {

  public timeType = {
    name: '最近一周',
    value: '1'
};
public sortType = 'sortAll';
public items = [];
public showNull: boolean;

constructor(public navCtrl: NavController,
            public commonService: CommonService,
            public loadingCtrl: LoadingController,
            public toastCtrl: ToastController,
            private popoverCtrl: PopoverController) {
}

ionViewDidLoad() {
    this.getList(null);
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


createLoading() {
  let loading = this.loadingCtrl.create({
      spinner: "ios"
  });
  loading.present();
  return loading;
}

  /**
   * 全部交易选项卡
   * @param ev
   */
timeTrade(ev) {
  let self = this;
  this.popoverCtrl.create('tradePopover', {
      cb: function (_data) {
          self.timeType = _data;
          self.getList(self.timeType.value);
      },
      timeType: self.timeType.value
  }, {
      cssClass: 'business-tab-new'
  }).present({
      ev: ev
  });
};

/**
  * 根据状态获取
  */

getList(obj=null){

    let temp = Number(this.timeType["value"]);
    let inputs = {};
    if(obj) {
        let date = Filter.getTimeBefor(temp);
        inputs = {
            strAction: "getAppBankbookJournals",
            bankbookType: '3',
            startdate: date.startdate,
            enddate: date.enddate,
            size: 10000
        };
    }else{
        inputs = {
            strAction: "getAppBankbookJournals",
            bankbookType: '3',
            size: 10000
        };
    }


    let loading = this.createLoading();

    this.commonService.wallet(inputs).subscribe(
        data => {
            loading && loading.dismiss(); //关闭加载框
            if (data.statusCode == 0) {
                this.items = data.body["data"] || [];
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


toggle(item) {
      let flag = item["isOpen"] || false;
      if (flag) {
          item["isOpen"] = !flag;
          return;
      }
      item["isOpen"] = !flag;
}

/**
  * 切换选项卡
  */

changeType(){
      if(this.sortType == 'sortAll'){
          this.getList(null);
          this.timeType.value = '1';
      }
}


goBack(){
    this.navCtrl.pop();
}

}
