import {Component, Input, OnInit} from "@angular/core";
import { SidebarItem } from "../classi/client-objects/SidebarItem";
import {Router} from "@angular/router";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  @Input("sidebarItems") sidebarItems: Array<SidebarItem>;

   public clicked = true;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  public click(event, item: SidebarItem){
    console.log("evento: ", event);
    this.router.navigate([item.routerLink], {queryParams: {reset: true}});
  }
}
