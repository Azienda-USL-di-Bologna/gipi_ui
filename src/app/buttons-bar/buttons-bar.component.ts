import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {SharedData} from "@bds/nt-angular-context";

@Component({
  selector: 'app-buttons-bar',
  templateUrl: './buttons-bar.component.html',
  styleUrls: ['./buttons-bar.component.scss']
})
export class ButtonsBarComponent implements OnInit {

  @Output("out") out = new EventEmitter<Object>();

  constructor(private router: Router, private sharedData: SharedData) { }

  ngOnInit() {
  }


  click1() {
    const pos: number = this.router.url.indexOf("?");
    let baseUrl: string;
    if (pos > 0) {
      baseUrl = this.router.url.substring(null, pos);
    } else {
      baseUrl = this.router.url;
    }
    this.router.navigate([baseUrl], { queryParams: { save: true }});
    this.out.emit("click1");
  }

  click2() {
    const pos: number = this.router.url.indexOf("?");
    let baseUrl: string;
    if (pos > 0) {
      baseUrl = this.router.url.substring(null, pos);
    } else {
      baseUrl = this.router.url;
    }
    this.router.navigate([baseUrl], { queryParams: { reload: true }});
    this.out.emit("click2");
  }
}
