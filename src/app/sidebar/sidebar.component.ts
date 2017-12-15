import { Component, OnInit } from "@angular/core";
import { SidebarItem } from "../classi/client-objects/SidebarItem";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {

  public sidebarItems: Array<SidebarItem> = [];
  public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];

  constructor() {
    this.sidebarItems.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
    this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi"));
    this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi", this.sidebarItems2));
  }

  ngOnInit() {
  }

}
