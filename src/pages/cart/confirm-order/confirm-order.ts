import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController,
  ModalController
} from "ionic-angular";
import { CommonService } from "../../../providers/common.service";
import { DEV } from "../../../providers/config";

@IonicPage({
  name: "confirmOrder1",
  segment: "confirmOrder1",
  defaultHistory: []
})
@Component({
  selector: "page-confirm-order",
  templateUrl: "confirm-order.html"
})
export class ConfirmOrderPage {
  public imgUrl = DEV.url;
  // 订单类型
  orderType = {};
  public user = {
    pass: "",
    repass: ""
  };
  tabIndex;
  goods = [];
  total = { money: "", pv: "" };
  // 老会员激活 新会员注册 会员信息
  member = {};
  // 收货人信息
  takeGoods = {
    name: "",
    mobiletele: "",
    areaStr: ""
  };

  // 收货地址是否存在
  isAddress: boolean = false;

  num = 1;
  payObj = {
    bonus: "",
    wallet: "",
    reality_bonus: "",
    reality_wallet: ""
  };
  // 发货方式
  way = 2; //快递2 自提1
  model: boolean = false;
  pwdCheckShow: boolean = false;
  // 订单来源（用于显示结果）
  source: "";

  /**
   * 重消类型
   */
  repeatType = "M";
  poProvince;
  poCity;
  poDistrict;
  poAddress;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public commonService: CommonService,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    // 获取会员信息 订单信息
    this.goods = this.navParams.get("goods") || [];
    this.total = this.navParams.get("total") || {};
    this.orderType = this.navParams.get("orderType") || {};
    console.log('ordertype',this.orderType)
    let memberInfo = JSON.parse(localStorage.getItem("memberInfo"));

    //首单
    if (memberInfo) {
      this.member = JSON.parse(localStorage.getItem("memberInfo"));
      this.takeGoods = {
        name: memberInfo["poFirstName"],
        mobiletele: memberInfo["poMobiletele"],
        areaStr: memberInfo["areaStr"]
      };

      this.isAddress = true;
    } else {
      // 重消单 升级单
      this.getAddress();
    }
    this.payObj.reality_bonus = "0";
    this.payObj.reality_wallet = this.total.money;

    console.log(this.orderType);
    this.loadData();
  }

  // 完全离开此页面
  ionViewWillLeave() {
    localStorage.removeItem("memberInfo");
  }

  loadData() {
    this.getWallet();
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

  // 获取地址
  getAddress() {
    this.commonService
      .order({
        strAction: "getAppProductDefaultAddress"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            let dataObj = data.body.data[0];
            console.log(dataObj);
            if (dataObj) {
              this.isAddress = true;
              console.log(dataObj);
              this.takeGoods = {
                name: dataObj["USER_NAME"],
                mobiletele: dataObj["PHONE"],
                areaStr:
                  dataObj["STATE_PROVINCE_NAME"] +
                  dataObj["CITY_NAME"] +
                  dataObj["DISTRICT_NAME"] +
                  dataObj["ADDRESS"]
              };

              this.poProvince = dataObj["PROVINCE"];
              this.poCity = dataObj["CITY"];
              this.poDistrict = dataObj["DISTRICT"];
              this.poAddress = dataObj["ADDRESS"];
            }
          } else {
            this.isAddress = true;
            this.showToast(data.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  // 新增地址
  addAddress() {
    let profileModal = this.modalCtrl.create("addressEdit", { source: "new" });
    profileModal.onDidDismiss(data => {
      console.log('新增地址返回的参数：',data);
      if (data && Reflect.ownKeys(data).length) {
        this.takeGoods = {
          name: data["USER_NAME"],
          mobiletele: data["PHONE"],
          areaStr:
            data["STATE_PROVINCE_NAME"] +
            data["CITY_NAME"] +
            data["DISTRICT_NAME"] +
            data["ADDRESS"]
        };

        this.poProvince = data["PROVINCE"];
        this.poCity = data["CITY"];
        this.poDistrict = data["DISTRICT"];
        this.poAddress = data["ADDRESS"];
        if(this.takeGoods.name || this.takeGoods.mobiletele || this.takeGoods.areaStr){
          this.isAddress = true;
        }else{
          this.isAddress = false;
        }
      }
    });
    profileModal.present();
  }

  // 修改地址
  editAddress() {
    let profileModal = this.modalCtrl.create("addressList", {
      source: "confirmOrder"
    });
    profileModal.onDidDismiss(data => {
      console.log('编辑地址返回的参数：',data);
      if (data && Reflect.ownKeys(data).length) {
        this.takeGoods = {
          name: data["USER_NAME"],
          mobiletele: data["PHONE"],
          areaStr:
            data["STATE_PROVINCE_NAME"] +
            data["CITY_NAME"] +
            data["DISTRICT_NAME"] +
            data["ADDRESS"]
        };

        this.poProvince = data["PROVINCE"];
        this.poCity = data["CITY"];
        this.poDistrict = data["DISTRICT"];
        this.poAddress = data["ADDRESS"];
        if(this.takeGoods.name || this.takeGoods.mobiletele || this.takeGoods.areaStr){
          this.isAddress = true;
        }else{
          this.isAddress = false;
        }
      }

    });
    profileModal.present();
  }

  // 支付
  pay() {
    //奖金钱包合法验证
    if (this.payObj.reality_wallet > this.payObj.wallet) {
      this.showToast("余额不足");
      return false;
    }

    if (this.payObj.reality_bonus > this.payObj.bonus) {
      this.showToast("余额不足");
      return false;
    }

    let prompt = this.alertCtrl.create({
      title: "高级密码",
      message: "支付￥" + this.total.money,
      inputs: [
        {
          name: "password",
          placeholder: "",
          type: "password"
        }
      ],
      buttons: [
        {
          text: "暂不支付",
          handler: data => {}
        },
        {
          text: "确认支付",
          handler: data => {
            let self = this;

            if (data.password == "") {
              self.showToast("请输入密码");
              return;
            }

            let load = self.createLoading();
            this.commonService
              .loginPwd({
                strAction: "validateMemberPwd2",
                password2: data.password
              })
              .subscribe(
                data => {
                  load && load.dismiss(); //关闭加载框
                  if (data.statusCode == 0) {
                    if (!this.orderType["cart"]) {
                      this.addMember();
                      console.log("222");
                    } else {
                      this.settleOrder1();
                    }
                  } else {
                    self.showToast(data.message);
                  }
                },
                err => {
                  load && load.dismiss(); //关闭加载框
                  console.error("ERROR", err);
                }
              );
          }
        }
      ]
    });
    prompt.present();
  }

  // 二级密码是否存在
  sPwd() {
    // 校验余额
    if (this.total.money > this.payObj.wallet) {
      //判断钱包余额
      if (this.total.money > this.payObj.bonus) {
        //判断奖金余额
        this.showConfirm("余额不足");
        return;
      }
    } else if (this.total.money > this.payObj.bonus) {
      if (this.total.money > this.payObj.wallet) {
        //判断奖金余额
        this.showConfirm("余额不足");
        return;
      }
    }

    this.commonService
      .loginPwd({
        strAction: "pwd2IsNull"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            this.pay();
          } else if (data.statusCode == 1) {
            this.model = !this.model;
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  // 二级密码格式校验
  pwdCheck() {
    if (this.user.pass.length < 6 || this.user.pass.length > 20) {
      this.showToast("请输入6-20位字符的密码！");
      return;
    }
    if (this.user.pass != this.user.repass) {
      this.showToast("两次密码输入不一致！");
      return;
    }
    let inputs = {
      strAction: "updateMemberPwd2",
      password2: this.user.repass
    };
    let load = this.createLoading();
    this.commonService.loginPwd(inputs).subscribe(
      data => {
        load && load.dismiss();
        console.log(data);
        if (data["statusCode"] == 0) {
          this.showToast("设置成功");
          this.model = !this.model;
        } else {
          this.showToast(data["message"]);
        }
      },
      err => {
        load && load.dismiss();
        console.error("ERROR", err);
      }
    );
  }

  // 关闭model
  closeModel() {
    this.model = !this.model;
  }

  // 选择期数
  selectNum(num) {
    this.num = num;

    if (this.num == 1) {
      this.repeatType = "M";
    }
    if (this.num == 2) {
      this.repeatType = "T";
    }
    if (this.num == 3) {
      this.repeatType = "H";
    }
    if (this.num == 4) {
      this.repeatType = "Y";
    }
  }

  // 选择发货方式
  deliveryWay(num) {
    this.way = num;
  }

  //注册会员
  addMember() {
    // 注册会提交信息
    let self = this,
      paramsMember = {
        strAction: "postMiMember",
        qty: [],
        g_no: [],
        delivery: this.way,
        balance3: this.payObj.reality_wallet,
        balance1: this.payObj.reality_bonus,
        poFirstName: this.takeGoods.name,
        poMobiletele: this.takeGoods.mobiletele,
        poProvince: this.poProvince,
        poCity: this.poCity,
        poDistrict: this.poDistrict,
        poAddress: this.poAddress
      },
      qty = [],
      g_no = [];

    let load = self.createLoading();

    // 数据处理
    for (let i = 0; i < this.goods.length; i++) {
      qty.push(self.goods[i].QTY);
      g_no.push(self.goods[i].UNI_NO);
    }

    for (let i in self.member) {
      if (this.member[i] && i != "areaStr") {
        paramsMember[i] = this.member[i];
      }
    }
    paramsMember.qty = qty;
    paramsMember.g_no = g_no;

    console.log("注册会员", paramsMember);
    self.commonService.register(paramsMember).subscribe(
      data => {
        load && load.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          self.showToast(data.message);
          localStorage.removeItem("memberInfo");
          var newMember = data.body;
          if (self.member["miUserName"]) {
            console.log(newMember);
            this.navCtrl.push("addMemderResult", {
              status: true,
              member: newMember,
              source: "new"
            });
          } else {
            this.navCtrl.push("addMemderResult", {
              status: true,
              member: newMember,
              source: "old",
              msg: data.body
            });
          }
        } else {
          this.showToast(data.message);
          // if(self.member['miUserName']){
          //   this.navCtrl.push('addMemderResult',{status:false,source:'new'});
          // }else{
          //   this.navCtrl.push('addMemderResult',{status:false,source:'old'});
          // }
        }
      },
      err => {
        load && load.dismiss(); //关闭加载框
        self.showToast(err);
        console.error("ERROR", err);
      }
    );
  }

  // 电子钱包
  getWallet() {
    let self = this;
    let load = self.createLoading();
    this.commonService
      .wallet({
        strAction: "getAppBankbookBalances"
      })
      .subscribe(
        data => {
          load && load.dismiss(); //关闭加载框
          if (data.statusCode == 0) {
            let arr = data.body.data || [];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].VALUE_TITLE == "电子钱包账户") {
                this.payObj.wallet = arr[i].BALANCE;
                // this.payObj.reality_wallet = arr[i].BALANCE;
              } else if (arr[i].VALUE_TITLE == "奖金账户") {
                this.payObj.bonus = arr[i].BALANCE;
                // this.payObj.reality_bonus = arr[i].BALANCE;
              }
            }
            console.log(data.body);
          }
        },
        err => {
          load && load.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
      );
  }

  // 修改支付金额
  selectPayWay(num) {
    let title = "";

    let prompt = this.alertCtrl.create({
      title: num == 1 ? "钱包支付" : "奖金支付",
      message: "订单金额￥" + this.total.money,
      inputs: [
        {
          name: "money",
          placeholder: ""
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
            let reg = /(^[1-9]([0-9]+)?(\\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\\.[0-9]([0-9])?$)/;
            if (!reg.test(data.money)) {
              this.showConfirm("请输入正确金额");
              return;
            }

            // 钱包
            if (num == 1) {
              if (data.money > this.total.money) {
                this.showConfirm("输入的金额最大为：￥" + this.total.money);
                return;
              }

              if (data.money > this.payObj.wallet) {
                this.showConfirm("钱包余额不足");
              } else {
                if (
                  (parseInt(this.total.money) - data.money).toString() >
                  this.payObj.bonus
                ) {
                  this.showConfirm("奖金余额不足");
                } else {
                  this.payObj.reality_wallet = data.money;
                  this.payObj.reality_bonus = Math.max(
                    parseInt(this.total.money) - data.money,
                    0
                  ).toString();

                  if (this.payObj.reality_bonus >= this.payObj.bonus) {
                    this.payObj.reality_bonus = this.payObj.bonus;
                    this.showConfirm("奖金余额不足");
                  }
                }
              }
            } else {
              if (data.money > this.total.money) {
                this.showConfirm("输入的金额最大为：￥" + this.total.money);
                return;
              }

              if (data.money > this.payObj.bonus) {
                this.showConfirm("奖金余额不足");
              } else {
                if (
                  (parseInt(this.total.money) - data.money).toString() >
                  this.payObj.wallet
                ) {
                  this.showConfirm("钱包余额不足");
                } else {
                  this.payObj.reality_bonus = data.money;
                  this.payObj.reality_wallet = Math.max(
                    parseInt(this.total.money) - data.money,
                    0
                  ).toString();

                  if (this.payObj.reality_wallet >= this.payObj.wallet) {
                    this.payObj.reality_wallet = this.payObj.wallet;
                    this.showConfirm("钱包余额不足");
                  }
                }
              }
            }
          }
        }
      ]
    });
    prompt.present();
  }

  // 提示信息
  showConfirm(str: string) {
    let alert = this.alertCtrl.create({
      title: "",
      subTitle: str,
      buttons: ["确定"]
    });
    alert.present();
  }

  // back
  goBack() {
    if (this.tabIndex) {
      this.navCtrl.push("tabs", { index: this.tabIndex });
    } else {
      this.navCtrl.pop();
    }
  }

  /**
   * XXX单结算
   */
  settleOrder1() {
    let self = this,
      paramsMember = {
        strAction: "postAppProductRepeatOrder",
        qty: [],
        g_no: [],
        delivery: this.way,
        balance3: this.payObj.reality_wallet,
        balance1: this.payObj.reality_bonus,
        repeatType: this.repeatType,
        poFirstName: this.takeGoods.name,
        poMobiletele: this.takeGoods.mobiletele,
        poProvince: this.poProvince,
        poCity: this.poCity,
        poDistrict: this.poDistrict,
        poAddress: this.poAddress,
        usercode: localStorage.getItem("principal")
      },
      qty = [],
      g_no = [];

    let load = self.createLoading();

    // 数据处理
    for (let i = 0; i < this.goods.length; i++) {
      qty.push(self.goods[i].QTY);
      if (self.goods[i].PRODUCT_ID) {
        g_no.push(self.goods[i].PRODUCT_ID);
      } else {
        g_no.push(self.goods[i].UNI_NO);
      }
    }

    paramsMember.qty = qty;
    paramsMember.g_no = g_no;

    console.log(paramsMember);

    this.commonService.order(paramsMember).subscribe(
      res => {
        load && load.dismiss(); //关闭加载框

        if (res.statusCode == 0) {
          this.navCtrl.push("payResult", {
            code: true,
            pv: this.total.pv,
            money: this.total.money
          });
        } else {
          this.showToast(res.message);
          // this.navCtrl.push('payResult',{
          //     code:false
          // });
        }
      },
      err => {
        load && load.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  /**
   * 升级单结算
   */
  settleOrder2() {
    let self = this,
      paramsMember = {
        strAction: "postMiMember",
        qty: [],
        g_no: [],
        delivery: this.way,
        balance3: this.payObj.reality_wallet,
        balance1: this.payObj.reality_bonus,
        repeatType: this.repeatType,
        poFirstName: this.takeGoods.name,
        poMobiletele: this.takeGoods.mobiletele,
        poProvince: this.poProvince,
        poCity: this.poCity,
        poDistrict: this.poDistrict,
        poAddress: this.poAddress,
        usercode: localStorage.getItem("principal"),
        isupgrade: true
      },
      qty = [],
      g_no = [];

    let load = self.createLoading();

    // 数据处理
    for (let i = 0; i < this.goods.length; i++) {
      qty.push(self.goods[i].QTY);
      if (self.goods[i].PRODUCT_ID) {
        g_no.push(self.goods[i].PRODUCT_ID);
      } else {
        g_no.push(self.goods[i].UNI_NO);
      }
    }

    paramsMember.qty = qty;
    paramsMember.g_no = g_no;

    console.log(paramsMember);

    this.commonService.register(paramsMember).subscribe(
      res => {
        load && load.dismiss(); //关闭加载框

        if (res.statusCode == 0) {
          this.navCtrl.push("payResult", {
            code: true,
            pv: this.total.pv,
            money: this.total.money
          });
        } else {
          this.showToast(res.message);
          // this.navCtrl.push('payResult',{
          //     code:false
          // });
        }
      },
      err => {
        load && load.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }
}
