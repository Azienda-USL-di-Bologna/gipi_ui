import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {ButtonAppearance} from "../classi/client-objects/ButtonAppearance";

@Component({
  selector: "app-buttons-bar",
  templateUrl: "./buttons-bar.component.html",
  styleUrls: ["./buttons-bar.component.scss"]
})
export class ButtonsBarComponent implements OnInit {

  @Input("backButton") backButton: ButtonAppearance;
  @Input("saveButton") saveButton: ButtonAppearance;
  @Input("reloadButton") reloadButton: ButtonAppearance;
  @Input("restoreButton") restoreButton: ButtonAppearance;

  @Output("out") out = new EventEmitter<Object>();

  constructor(private router: Router) { }

  ngOnInit() {
  }


  save() {
    const pos: number = this.router.url.indexOf("?");
    let baseUrl: string;
    if (pos > 0) {
      baseUrl = this.router.url.substring(null, pos);
    } else {
      baseUrl = this.router.url;
    }
    this.router.navigate([baseUrl], { queryParams: { save: true }});
    this.out.emit("save");
  }

  reload() {
    const pos: number = this.router.url.indexOf("?");
    let baseUrl: string;
    if (pos > 0) {
      baseUrl = this.router.url.substring(null, pos);
    } else {
      baseUrl = this.router.url;
    }
    this.router.navigate([baseUrl], { queryParams: { reload: true }});
    this.out.emit("reload");
  }

  back(){
    const pos: number = this.router.url.indexOf("?");
    let baseUrl: string;
    if (pos > 0) {
      baseUrl = this.router.url.substring(null, pos);
    } else {
      baseUrl = this.router.url;
    }
    this.router.navigate([baseUrl], { queryParams: { back: true }});
    this.out.emit("back");
  }

  restore(){
    const pos: number = this.router.url.indexOf("?");
    let baseUrl: string;
    if (pos > 0) {
      baseUrl = this.router.url.substring(null, pos);
    } else {
      baseUrl = this.router.url;
    }
    this.router.navigate([baseUrl], { queryParams: { restore: true }});
    this.out.emit("restore");
  }
}


export interface Blocco {
  label: string,
  viewIcon: boolean
}

