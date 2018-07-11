/**
 * create by pangmiaoran
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { CommonService } from '../../../../providers/common.service';

@IonicPage({
  name: "addressDetailAdd",
  segment: "addressDetailAdd",
  defaultHistory: []
})
@Component({
  selector: 'page-address-detail-edit',
  templateUrl: 'detail-edit.html'
})
export class AddressDetailEditPage {
  isSubmit: boolean;
  detail = '江苏省 苏州市';
  private form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public commonService: CommonService,
    public viewCtrl: ViewController,
    public storage: Storage
  ) {
    this.detail = navParams.get('selected') || '';
    this.form = this.formBuilder.group({
      detail: ["", Validators.required]
    });
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
  loadData() {}

  goBack() {
    this.viewCtrl.dismiss({isBack: true});
  }

  // submit
  submit(){
    this.viewCtrl.dismiss(this.detail);
  }
}
