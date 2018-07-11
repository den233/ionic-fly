import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from '../../../../providers/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from "jquery";

@IonicPage({
    name: "chargeBalance",
    segment: "chargeBalance",
    defaultHistory: []
})

@Component({
  selector: 'page-charge-balance',
  templateUrl: 'charge-balance.html',
})
export class ChargeBalancePage {

  public wallet;
  public chargeCount;
  public chargeCount2;
  public isChoose = true;
  public payBody;

  private chargeForm: FormGroup;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private formBuilder: FormBuilder,
      public commonService: CommonService,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      private sanitizer: DomSanitizer) {
      this.wallet = navParams.get('money') || 0;
      this.chargeForm = this.formBuilder.group({
          money: ["", Validators.required],
          check: ["", Validators.compose([
              Validators.required,
              Validators.pattern('^[\d]+$')
          ])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChargeBalancePage');
    this.payBody = null;
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


  charge(){

      let loading = this.createLoading();

      this.commonService
      .alipay({
          strAction: "pay",
          subject:'在线支付',
          amount:this.chargeCount
      })
      .subscribe(
          data => {
              if (data.statusCode == 0) {
                  this.payBody = data.body;
                  this.payBody = this.assembleHTML(this.payBody);
                  let con = <HTMLElement>document.getElementById('payContainer');
                  $(con).bind('DOMNodeInserted', function(e) {
                      $(con).find('form')[0].submit();
                  });

                  // con.getElementsByTagName('form')[0].submit();

              }else {
                  this.showToast(data.message);
              }

              loading.dismiss();
          },
          err => {
              console.error("ERROR", err);
          }
      );
  }


    assembleHTML(strHTML:any) {
        return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    }


  goBack(){
    this.navCtrl.pop();
  }


  inputCharge(){

  }

    pay(){
        document.getElementsByTagName('form')[1].submit();
    }


}
