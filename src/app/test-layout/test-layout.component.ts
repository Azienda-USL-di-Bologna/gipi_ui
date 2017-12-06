import { Component, OnInit } from '@angular/core';
import {Category, Service} from "./service";



@Component({
  selector: 'app-test-layout',
  templateUrl: './test-layout.component.html',
  styleUrls: ['./test-layout.component.scss']
})
export class TestLayoutComponent implements OnInit {

  menuVisible: boolean;
  toolbarItems: any[];
  dataSource: Category[];

  private _opened= false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  screen(width) {
    return ( width < 700 ) ? 'sm' : 'lg';
  }



  constructor(service: Service) {
    this.menuVisible = true;
    this.toolbarItems = [
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'menu',
          onClick: () => {
            this.menuVisible = !this.menuVisible;
          }
        }
      }, {
        location: 'center',
        template: 'title'
      }
    ];
    this.dataSource = service.getProducts();
  }

  ngOnInit() {
  }

  click(){
    this.menuVisible = !this.menuVisible;
  }




}


