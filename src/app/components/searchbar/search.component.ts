import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';  
@Component({  
  selector: 'search-bar',  
  templateUrl: 'search.component.html' 
})  
export class SearchComponent implements OnInit {  
  @Input() placeholder: string;    
  @Output() click = new EventEmitter<any>();  
  
  constructor() { }  
  ngOnInit() {  
  }  
  query(info) {  
    if(typeof info === 'object'){
      return;
    }
    if(typeof info === 'string'){
      this.click.emit(info); 
    } 
  }  
} 