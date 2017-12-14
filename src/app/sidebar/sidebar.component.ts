import { Component, OnInit } from "@angular/core";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  close(){
    let sideBar = document.getElementById("sidebar");
    let contentPage = document.getElementById("sidebar-page");
    console.log("toggle");
    if (sideBar.classList.contains("active")) {
      sideBar.classList.remove("active");
      contentPage.classList.remove("active");
    } else {
      sideBar.classList.add("active");
      contentPage.classList.add("active");
    }
  }

}
