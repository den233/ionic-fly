import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage({
    name: "remitStatusPopover",
    segment: "remitStatusPopover",
    defaultHistory: []
})
@Component({
  selector: 'page-remit-status-popover',
  templateUrl: 'remit-status-popover.html',
})
export class RemitStatusPopoverPage {

    public callback: any;
    public type: string;
    public data;
    public type2 = {
        name:'全部',
        value:0
    }

    constructor(
        public viewCtrl: ViewController,
        private navParams : NavParams
    ){
        this.callback = this.navParams.get('cb');
        this.type = this.navParams.get('type');
        this.data = this.navParams.get('data');
    }

    radioChange(item){
        if(this.type){
            let data = item;
            this.callback(data);
            this.viewCtrl.dismiss();
        }

    }

}
