/**
 * create by pangmiaoran
 */
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
  ViewController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../../providers/common.service";
import { convertEnumToColumn } from "ion-multi-picker";

@IonicPage({
  name: "bankEdit",
  segment: "bankEdit",
  defaultHistory: []
})
@Component({
  selector: "page-bank-edit",
  templateUrl: "edit.html"
})
export class BankEditPage {
  isSubmit: boolean;
  title: string;
  cityColumns: any[];
  areaData = [];
  area = "";
  bank = {
    ID: "",
    BANK: "",
    BANKADDRESS: "",
    BANKCARD: "",
    // SHOWNAME: '',
    BANK_PROVINCE: "",
    BANK_CITY: "",
    BANK_DISTRICT: ""
  };
  userCode = "";
  username = "";
  bankList = [];
  source = "";
  error: boolean;
  private form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController
  ) {
    this.source = navParams.get("source") || "";
    let bank = navParams.get("bank") || "";
    if (bank && Reflect.ownKeys(bank).length) {
      this.bank.BANK = bank["BANK"];
      this.bank.BANKADDRESS = bank["BANKADDRESS"];
      this.bank.BANKCARD = bank["BANKCARD"];
      // this.bank.id = bank['BANKID'];
      this.bank.BANK_CITY = bank["BANK_CITY"];
      this.bank.BANK_DISTRICT = bank["BANK_DISTRICT"];
      this.bank.BANK_PROVINCE = bank["BANK_PROVINCE"];
      this.bank.ID = bank["ID"];
      this.area =
        this.bank.BANK_PROVINCE +
        " " +
        this.bank.BANK_CITY +
        " " +
        this.bank.BANK_DISTRICT;
      console.log("编辑：", this.bank);
      this.checkAccout();
    }
    this.title = this.bank.ID ? "修改银行卡" : "新增银行卡";
    this.form = this.formBuilder.group({
      bank: ["", Validators.required],
      branch: [""],
      account: ["", Validators.compose([Validators.required])],
      area: ["", Validators.required]
    });
    let area = JSON.parse(localStorage.getItem("area"));
    this.cityColumns = area;
  }

  // loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }

  // toast
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  // init
  ngOnInit() {
    this.loadData();
    if (!this.username) {
      this.getUserInfo();
    }
  }
  goBack() {
    if (this.source && this.source == "new") {
      this.viewCtrl.dismiss();
      return;
    } else if (this.source && this.source != "new") {
      this.viewCtrl.dismiss(this.source);
      return;
    }
    this.navCtrl.push("bankList");
  }

  loadData() {
    this.commonService.loginPwd({ strAction: "listBank" }).subscribe(
      data => {
        if (data.statusCode == 0) {
          let result = data.body || [];
          this.bankList = result;
        } else {
          this.showToast(data.message);
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  getUserInfo() {
    let loading = this.createLoading();
    this.commonService.modification({ strAction: "getMemberInfo" }).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body || {};
          this.username = result["FIRST_NAME"] || result["USER_CODE"];
          this.userCode = result["USER_CODE"];
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

  checkAccout() {
    let val = this.bank.BANKCARD;
    let temp = val.replace(/\s+/g, "");
    let reg = /^\d+$/;
    this.error = false;
    if(!reg.test(temp)){
      this.error = true;
    }
    this.bank.BANKCARD = val.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  // submit
  submit() {
    let str = this.bank.BANKCARD;
    str = str.replace(/\s+/g, "");
    console.log(str);
    let reg = /^\d{19}$/;
    if (!reg.test(str)) {
      this.showToast("请输入正确银行卡号");
      return;
    }
    let loading = this.createLoading();
    if (!this.form.valid) {
      return;
    }
    let areas = this.area.split(" ");
    let inputs = {
      address: this.bank.BANKADDRESS,
      bank: this.bank.BANK,
      bankcard: str
    };
    if (this.bank && this.bank.ID) {
      inputs["id"] = this.bank.ID;
      inputs["strAction"] = "updatenibank";
    } else {
      inputs["strAction"] = "addnibank";
    }
    if (areas && areas.length > 0) {
      inputs["province"] = areas[0];
      inputs["city"] = areas[1];
      inputs["district"] = areas[2];
    }else{
      this.showToast("请选择所在地区");
      return;
    }

    this.commonService.loginPwd(inputs).subscribe(
      res => {
        loading && loading.dismiss(); //关闭加载框
        if (res.statusCode == 0) {
          this.showToast(res.message);
          if (this.source && this.source == "new") {
            let result = res.body;
            if (res.body && res.body.length) {
              this.bank.ID = res.body[0]["ID"];
            }
            let str = this.bank.BANKCARD;
            this.bank.BANKCARD = str.replace(/\s+/g, "");
            this.viewCtrl.dismiss(this.bank);
            return;
          } else if (this.source && this.source != "new") {
            this.viewCtrl.dismiss(this.source);
            return;
          }
          this.navCtrl.push("bankList");
        } else {
          this.showToast(res.message);
        }
      },
      err => {
        loading && loading.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

  // remove
  remove() {
    let self = this;
    if (!self.bank.ID) {
      return;
    }
    let confirm = this.alertCtrl.create({
      title: "提示",
      message: "是否确认要删除当前银行卡？",
      buttons: [
        {
          text: "取消",
          cssClass: "text-gray",
          handler: () => {}
        },
        {
          text: "确认",
          handler: () => {
            let loading = this.createLoading();
            this.commonService
              .loginPwd({
                strAction: "deletenibank",
                id: this.bank.ID
              })
              .subscribe(
                res => {
                  loading && loading.dismiss(); //关闭加载框
                  if (res.statusCode == 0) {
                    this.showToast(res.message);
                    this.navCtrl.push("bankList");
                  } else {
                    this.showToast(res.message);
                  }
                },
                err => {
                  loading && loading.dismiss(); //关闭加载框
                  console.error("ERROR", err);
                }
              );
          }
        }
      ]
    });
    confirm.present();
  }
}
