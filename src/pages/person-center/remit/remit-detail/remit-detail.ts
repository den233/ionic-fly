import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,Content} from 'ionic-angular';

@IonicPage({
    name: "remitDetail",
    segment: "remitDetail",
    defaultHistory: []
})

@Component({
  selector: 'page-remit-detail',
  templateUrl: 'remit-detail.html',
})
export class RemitDetailPage {

    @ViewChild(Content) content:Content;

    public item;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.item = this.navParams.get('item');
        console.log(this.item);
    }

    ionViewDidLoad(){
        this.content.ionScroll.subscribe(($event: any) => {
            let top = $event.scrollTop;
            console.log(top)
        })
    }

    goBack(){
        this.navCtrl.pop()
    }
}
