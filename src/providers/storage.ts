import { Storage } from '@ionic/storage';
import {Injectable } from '@angular/core';

@Injectable()
export class StorageData{
    constructor(public storge: Storage){};
    get(name){
        this.storge.get(name).then((val) => {
            return val;
        });
    };
    set(name, data){
        this.storge.set(name, data);
    };
}