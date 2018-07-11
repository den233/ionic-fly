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
  name: "personInfo",
  segment: "personInfo",
  defaultHistory: []
})
@Component({
  selector: "page-person-info",
  templateUrl: "person-info.html"
})
export class PersonInfoPage {
  isSubmit: boolean;
  cityColumns = [];
  area = "";
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
    BIRTHDAY: "",
    USER_CODE: ""
  };
  cardTypes = [];
  memberLevels = [];
  private form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController
  ) {
    this.form = this.formBuilder.group({
      area: [""]
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
    this.getUserLevel();
  }
  loadData() {
    let loading = this.createLoading();
    this.commonService.modification({ strAction: "getMemberInfo" }).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let result = data.body || {};
          this.user = {
            ADDRESS: result["ADDRESS"],
            CARD_TYPE: this.findItemVal(result["CARD_TYPE"], this.cardTypes),
            CITY: result["CITY"],
            DISTRICT: result["DISTRICT"],
            FIRST_NAME: result["FIRST_NAME"],
            JOIN_DATE: result["JOIN_DATE"],
            MEMBER_LEVEL: this.findItemVal(result["MEMBER_LEVEL"], this.memberLevels),
            MOBILETELE: result["MOBILETELE"],
            PAPERNUMBER: result["PAPERNUMBER"],
            PAPERTYPE: result["PAPERTYPE"],
            PROVINCE: result["PROVINCE"],
            SEX: result["SEX"],
            BIRTHDAY: result["BIRTHDAY"],
            USER_CODE: result["USER_CODE"]
          };
          this.area =
            this.user["PROVINCE"] +
            " " +
            this.user["CITY"] +
            " " +
            this.user["DISTRICT"];
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

  findItemVal(val,list){
    for(let item of list){
      if(item['VALUE_CODE'] == val){
        return item['VALUE_TITLE'];
      }
    }
    return '';
  }

  getUserLevel() {
    this.commonService
      .order({
        strAction: "getAppMemberlevel"
      })
      .subscribe(
        res => {
          this.memberLevels = res.body['data'] || [];
          this.getCardTypes();
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
          this.cardTypes = res.body['data'] || [];
          this.loadData();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  goBack() {
    this.navCtrl.push("setting");
  }

  // go save address
  goSaveAddress() {
    let modal = this.modalCtrl.create("addressDetailAdd", {
      selected: this.user.ADDRESS
    });
    modal.onDidDismiss(result => {
      if (!result["isBack"]) {
        this.user.ADDRESS = result;
        let loading = this.createLoading();
        this.commonService
          .modification({
            strAction: "modifyMemberInfo",
            address: this.user.ADDRESS
          })
          .subscribe(
            data => {
              loading && loading.dismiss(); //关闭加载框
              this.showToast(data.message);
            },
            err => {
              loading && loading.dismiss(); //关闭加载框
              console.error("ERROR", err);
            }
          );
      }
    });
    modal.present();
  }

  // go edit mobile
  goEditMobile() {
    if (!this.user.MOBILETELE) {
        return;
    }
    this.navCtrl.push("sendCheckCode", {
      isUpdatePhone: true
    });
  }

  // save address
  changeAddress() {
    let areas = this.area.split(" ");
    let inputs = {
      strAction: "modifyMemberInfo"
    };
    if (areas && areas.length > 0) {
      inputs["province"] = areas[0];
      inputs["city"] = areas[1];
      inputs["district"] = areas[2];
    }
    let loading = this.createLoading();
    this.commonService.modification(inputs).subscribe(
      data => {
        loading && loading.dismiss(); //关闭加载框
        this.showToast(data.message);
      },
      err => {
        loading && loading.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
    console.log("come in");
  }
}
