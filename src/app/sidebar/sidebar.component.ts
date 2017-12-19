import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { SidebarItem } from "../classi/client-objects/SidebarItem";
import {Router} from "@angular/router";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  @Input("sidebarItems") sidebarItems: Array<SidebarItem>;
  @Output("resetBreadcrumbs") resetBreadcrumbs = new EventEmitter<boolean>();

   public clicked = true;

  constructor(private router: Router) {

  }

  ngOnInit() {
  }

  selectItem(event) {
    console.log("LOGGO: ", event);

  }

  public prova(event, item: SidebarItem){
    console.log("evento: ", event);
    this.resetBreadcrumbs.emit(true);
    this.router.navigate([item.routerLink], {queryParams: {reset: true}});
    // this.clicked = true;
  }
}
