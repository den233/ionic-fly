import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage({
    name: "remitAccountPopover",
    segment: "remitAccountPopover",
    defaultHistory: []
})
@Component({
  selector: 'page-remit-account-popover',
  templateUrl: 'remit-account-popover.html',
})
export class RemitAccountPopoverPage {

    public callback: any;
    public type: string;
    public data;

    public type2 = {
        VALUE_TITLE:'全部',
        VALUE_CODE:0
    }

    constructor(
        public viewCtrl: ViewController,
        private navParams : NavParams
    ){
        this.callback = this.navParams.get('cb');
        this.type = this.navParams.get('type');
        this.data = this.navParams.get('data');
        console.log(this.type);
        console.log(this.data);
    }

    radioChange(item){
        if(this.type){
            let data = item;
            this.callback(data);
            this.viewCtrl.dismiss();
        }

    }


}
