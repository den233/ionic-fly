/**
 * create by pangmiaoran
 */
import { Component, ViewChild , ElementRef} from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  LoadingController,
  ToastController,
  ModalController,
  NavParams,
  Content,
  AlertController
} from "ionic-angular";
import { CommonService } from "../../providers/common.service";

@IonicPage({
  name: "personCenter",
  segment: "personCenter",
  defaultHistory: []
})
@Component({
  selector: "page-person-center",
  templateUrl: "person-center.html"
})
export class PersonCenterPage {
  @ViewChild(Content) content: Content;
    @ViewChild('container') container: ElementRef;
  isMsg: boolean = true;
  hidWallet: boolean;
  wallet: any;
  user = {
    ADDRESS: "",
    CARD_TYPE: "",
    CITY: "",
    DISTRICT: "",
    FIRST_NAME: "",
    JOIN_DATE: "",
    MEMBER_LEVEL: "",
    MOBILETELE: "",
    PAPERNUMBER: "",
    PAPERTYPE: "",
    PROVINCE: "",
    SEX: "",
    USER_CODE: ""
  };
  cardTypes = [];
  memberLevels = [];

  orderStatus = {
      noSend:0,
      waitReceive:0,
      finished:0
  };

  topHidden = true;

  constructor(
    public navCtrl: NavController,
    public commonService: CommonService,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appCtrl: App,
    public alertCtrl: AlertController
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
      duration: 1500,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  ionViewDidEnter() {
    this.loadWallet();
  }

    toggleHide(){
        let ele = this.container.nativeElement;
        this.content.ionScroll.subscribe(($event: any) => {
            let top = $event.scrollTop;
            if(top > 50){
                this.removeClass(ele,'hide');
            }

            if(top <= 50){
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

  //**********wallet *************/
  loadWallet() {
    this.commonService
      .wallet({
        strAction: "getAppBankbookBalances"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {

            this.getUserLevel();
            this.getOrderList();
            this.toggleHide();

            let arr = data.body['data'] || [];
            for (let i = 0; i < arr.length; i++) {
              if(arr[i].BANKBOOK_TYPE == '3'){
                this.wallet = arr[i].BALANCE ? Number(arr[i].BALANCE || '0').toFixed(2) : '0';
              }
            }
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  toggleWallet() {
    this.hidWallet = !this.hidWallet;
  }

  goSetting() {
    this.navCtrl.push("setting");
  }

  getUserInfo() {
    let loading = this.createLoading();
    this.commonService.modification({ strAction: "getMemberInfo" }).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body || {};
          if (result && Reflect.ownKeys(result).length) {
            this.user = {
              ADDRESS: result["ADDRESS"],
              CARD_TYPE: this.findItemVal(result["CARD_TYPE"], this.cardTypes),
              CITY: result["CITY"],
              DISTRICT: result["DISTRICT"],
              FIRST_NAME: result["FIRST_NAME"],
              JOIN_DATE: result["JOIN_DATE"],
              MEMBER_LEVEL: this.findItemVal(
                result["MEMBER_LEVEL"],
                this.memberLevels
              ),
              MOBILETELE: result["MOBILETELE"],
              PAPERNUMBER: result["PAPERNUMBER"],
              PAPERTYPE: result["PAPERTYPE"],
              PROVINCE: result["PROVINCE"],
              SEX: result["SEX"],
              USER_CODE: result["USER_CODE"]
            };
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
          this.getUserInfo();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  //message
  goMsg() {
    this.navCtrl.push("homeMsg");
  }

  // old member act
  oldMemberAct() {
    this.navCtrl.push("oldMemberActivation", { tabIndex: 3 });
  }

  // add member
  addMember() {
    this.navCtrl.push("addMember", { tabIndex: 3 });
  }

  myOrder(status:number = null) {
    this.navCtrl.push("orderList",{
        status:status
    });
  }

  // 服务会员
  serve() {
    this.navCtrl.push("serveMember");
  }

  gowallet() {
    this.navCtrl.push("wallet");
  }

  transfer() {
    this.navCtrl.push("transferAccount");
  }

  goBonus(){
        /**
         * 验证二级密码是否为空
         */
        this.commonService.loginPwd({
            strAction:'pwd2IsNull',
        }).subscribe(
            data => {
                if(data.statusCode == 0){

                    let prompt = this.alertCtrl.create({
                        title: "请输入高级密码",
                        inputs: [
                            {
                                name: "password",
                                placeholder: "",
                                type: "password"
                            }
                        ],
                        buttons: [
                            {
                                text: "取消",
                                handler: data => {}
                            },
                            {
                                text: "确认",
                                handler: data => {
                                    if (!data.password) {
                                        this.showToast("请输入高级密码");
                                        return;
                                    }else{
                                        this.goBounusCash(data.password);
                                    }
                                }
                            }
                        ]
                    });
                    prompt.present();

                }else{
                    this.showToast(data.message)
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
  }

    /**
     * 验证二级密码通过进入奖金
     */
    goBounusCash(pass){
        this.commonService.loginPwd({
            strAction:'validateMemberPwd2',
            password2:pass
        }).subscribe(
            data => {
                if(data.statusCode == 0){
                    this.navCtrl.push('bonus');
                }else{
                    this.showToast(data.message)
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
    }

  // repeatSales
  repeatSales() {
    this.navCtrl.push("repeatSales");
  }
  // 销售业绩
  sell() {
    this.navCtrl.push("sellMember");
  }

  remit() {
    this.navCtrl.push("remit");
  }

    /**
     * 查询订单
     */

    getOrderList(){
        this.orderStatus = {
            noSend:0,
            waitReceive:0,
            finished:0
        };

        let data = {
            'strAction':'getAppMemberOrders',
            'size':10000
        }

        this.commonService.order(data).subscribe(
            res => {

                if(res.statusCode == 0){
                    let data =  res.body.data;
                    for(let i in data){
                        if(data[i]['STATUS'] == '1' && data[i]['IS_EXPORTED_NC'] != 3){
                            this.orderStatus.noSend++;
                        }
                        if(data[i]['STATUS'] == '1' && data[i]['IS_EXPORTED_NC'] == 3){
                            this.orderStatus.waitReceive++;
                        }
                        if(data[i]['STATUS'] == '99'){
                            this.orderStatus.finished++;
                        }

                    }
                }else{
                    this.showToast(res.message);
                }


            },
            err => {
                console.error("ERROR", err);
            }
        );
    }

    // 回填账户
    backfill(){
      this.navCtrl.push('backfillAccount')
    }

    // 消费积分
    bonusPoints(){
      this.navCtrl.push('bonusPoints');
    }

    // 冻结账户
    frozenAccount(){
      this.navCtrl.push('frozenAccount');
    }

}
