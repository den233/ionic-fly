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
  name: "addressEdit",
  segment: "addressEdit",
  defaultHistory: []
})
@Component({
  selector: "page-address-edit",
  templateUrl: "edit.html"
})
export class AddressEditPage {
  isSubmit: boolean;
  title: string;
  cityColumns: any[];
  areaData = [];
  area = "";
  address = {
    id: "",
    username: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    district: "",
    postalcode: "",
    tel: "",
    ISDEFAULT: true
  };
  source = "";
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
    this.address.id = navParams.get("id") || "";
    this.title = this.address.id ? "修改收货地址" : "新增收货地址";
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("1[34578]\\d{9}")
        ])
      ],
      area: ["", Validators.required],
      address: ["", Validators.required],
      postalcode: ["", Validators.pattern("[1-9][0-9]{5}")],
      tel: ["", Validators.pattern("([0-9]{3,4}-)?[0-9]{7,8}")],
      isDefault: [""]
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
  }
  goBack() {
    if (this.source && this.source == "new") {
      this.viewCtrl.dismiss();
      return;
    } else if (this.source && this.source == "confirmOrder") {
      this.viewCtrl.dismiss(this.source);
      return;
    }
    this.navCtrl.push("addressList");
  }
  loadData() {
    if (this.address.id) {
      let self = this;
      if (self.address.id) {
        let loading = this.createLoading();
        this.commonService
          .order({
            strAction: "getAppProductAddressById",
            id: this.address.id
          })
          .subscribe(
            res => {
              loading.dismiss(); //关闭加载框
              if (res.statusCode == 0) {
                let body = res.body.data;
                let result = body[0] || {};
                if (result && Reflect.ownKeys(result).length) {
                  self.address["id"] = result["ID"];
                  self.address["username"] = result["USER_NAME"];
                  self.address["province"] = result["PROVINCE"];
                  self.address["city"] = result["CITY"];
                  self.address["district"] = result["DISTRICT"];
                  self.address["address"] = result["ADDRESS"];
                  self.address["phone"] = result["PHONE"];
                  self.address["postalcode"] = result["POSTALCODE"];
                  self.address["tel"] = result["TELEPHONE"];
                  self.address["ISDEFAULT"] =
                    result["ISDEFAULT"] == "1" ? true : false;
                  self.area =
                    self.address["province"] +
                    " " +
                    self.address["city"] +
                    " " +
                    self.address["district"];
                }
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
  }

  // get pro
  getProvice() {
    // pro
    let regions = this.cityColumns[0].options;
    for (let i in regions) {
      if (regions[i].value == this.address.province) {
        this.areaData.push(regions[i].text);
        break;
      }
    }
    // city
    let city = this.cityColumns[1].options;
    for (let j in city) {
      if (city[j].value == this.address.city) {
        this.areaData.push(city[j].text);
        break;
      }
    }
    // district
    let district = this.cityColumns[2].options;
    for (let k in district) {
      if (district[k].value == this.address.district) {
        this.areaData.push(district[k].text);
        break;
      }
    }
    return this.areaData.join(" ");
  }

  // set default address
  setDefaultAddress() {
    let self = this;
    if (self.address.id && this.address.ISDEFAULT) {
      this.commonService
        .order({
          strAction: "putAppProductDefaultAddress",
          id: this.address.id
        })
        .subscribe(
          res => {
            if (res.statusCode == 0) {
              this.showToast(res.message);
              this.loadData();
            } else {
              this.showToast(res.message);
            }
          },
          err => {
            console.error("ERROR", err);
          }
        );
    }
  }

  // submit
  submit() {
    let loading = this.createLoading();
    if (!this.form.valid) {
      return;
    }
    let areas = this.area.split(" ");
    let inputs = {
      strAction: "postAppProductAddress",
      username: this.address.username,
      address: this.address.address,
      phone: this.address.phone
      // isDefault: this.address.isDefault ? 1 : 0
    };
    if (areas && areas.length > 0) {
      inputs["province"] = areas[0];
      inputs["city"] = areas[1];
      inputs["district"] = areas[2];
    }
    if (this.address.postalcode) {
      inputs["postalcode"] = this.address.postalcode;
    }
    if (this.address.tel) {
      inputs["telephone"] = this.address.tel;
    }
    if (this.address.id) {
      inputs["strAction"] = "putAppProductAddress";
      inputs["id"] = this.address.id;
    }
    this.commonService.order(inputs).subscribe(
      res => {
        loading && loading.dismiss(); //关闭加载框
        if (res.statusCode == 0) {
          let result = res.body["data"] || [];
          let param = result[0] || {
            ADDRESS: "",
            CITY: "",
            CITY_NAME: "",
            DISTRICT: "",
            DISTRICT_NAME: "",
            ISDEFAULT: "",
            PHONE: "",
            POSTALCODE: "",
            PROVINCE: "",
            STATE_PROVINCE_NAME: "",
            TELEPHONE: "",
            USER_NAME: ""
          };
          this.showToast(res.message);
          console.log('编辑页source:',this.source);
          if (this.source == "new") {
            this.viewCtrl.dismiss(param);
            return;
          } 
          if (this.source == "confirmOrder") {
            this.viewCtrl.dismiss(this.source);
            return;
          }
          this.navCtrl.push("addressList");
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
    if (!self.address.id) {
      return;
    }
    let confirm = this.alertCtrl.create({
      title: "提示",
      message: "是否确认要删除当前地址？",
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
              .order({
                strAction: "deleteAppProductAddress",
                id: this.address.id
              })
              .subscribe(
                res => {
                  loading && loading.dismiss(); //关闭加载框
                  if (res.statusCode == 0) {
                    this.showToast(res.message);
                    let param = {
                      ADDRESS: "",
                      CITY: "",
                      CITY_NAME: "",
                      DISTRICT: "",
                      DISTRICT_NAME: "",
                      ISDEFAULT: "",
                      PHONE: "",
                      POSTALCODE: "",
                      PROVINCE: "",
                      STATE_PROVINCE_NAME: "",
                      TELEPHONE: "",
                      USER_NAME: ""
                    };
                    console.log('编辑页source:',this.source);
                    if (this.source == "new") {
                      this.viewCtrl.dismiss(param);
                      return;
                    }
                    if (this.source == "confirmOrder") {
                      this.viewCtrl.dismiss(this.source);
                      return;
                    }
                    this.navCtrl.push("addressList");
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
