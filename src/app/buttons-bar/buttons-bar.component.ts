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

  // comando con la label
  @Output("command") command = new EventEmitter<Object>();

  // lancio di eventi di output
  @Output("onBackButton") onBackButton = new EventEmitter();
  @Output("onSaveButton") onSaveButton = new EventEmitter();
  @Output("onReloadButton") onReloadButton = new EventEmitter();
  @Output("onRestoreButton") onRestoreButton = new EventEmitter();

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
    this.command.emit("save");
    this.onSaveButton.emit();
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
    this.command.emit("reload");
    this.onReloadButton.emit();
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
    this.command.emit("back");
    this.onBackButton.emit();
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
    this.command.emit("restore");
    this.onRestoreButton.emit();
  }
}


export interface Blocco {
  label: string,
  viewIcon: boolean
}

