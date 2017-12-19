import { Component, Input, OnInit } from "@angular/core";
import { SidebarItem } from "../classi/client-objects/SidebarItem";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  @Input() sidebarItems: Array<SidebarItem>;

   public clicked = true;

  constructor() {

  }

  ngOnInit() {
  }

  selectItem(event) {
    console.log("LOGGO: ", event);

  }

  public prova(event){
    console.log("evento: ", event);
    // this.clicked = true;
  }
}
