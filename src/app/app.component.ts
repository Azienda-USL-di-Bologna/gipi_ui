import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {CustomReuseStrategy} from "@bds/nt-angular-context/Routes/custom-reuse-strategy";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Ruolo} from "./classi/server-objects/entities/ruolo";
import {Azienda} from "./classi/server-objects/entities/azienda";
import { SidebarItem } from "./classi/client-objects/SidebarItem";
import { getElement } from "devextreme-angular";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    _opened= false;
    // buttonBar: Observable<boolean>;

    private userInfoMap: Object;
    username: String = "";
    azienda: Azienda;

    public sidebarItems: Array<SidebarItem> = [];
    public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];

    _toggleSidebar() {
        this._opened = !this._opened;
    }

    constructor(private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {
        this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));
        if (this.userInfoMap) {
            this.username = this.userInfoMap["username"];
            this.azienda = this.userInfoMap["azienda"];
        }
      this.sidebarItems.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
      this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi"));
      this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi", this.sidebarItems2));
      this.sidebarItems2.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
    }

    slide(){
        let sideBar = document.getElementById("sidebar-id");
        if (sideBar.classList.contains("active")) {
            sideBar.classList.remove("active");
        } else {
          sideBar.classList.add("active");
        }
    }
    screen(width) {
        return ( width < 700 ) ? "sm" : "lg";
    }


    ngOnInit() {
        /** sottoscrivendosi a questo evento è possibile intercettare la pressione di indietro o aventi del browser
         * purtroppo non c'è modo di differenziarli
         */
        this.location.subscribe(
            x => {
                if (!!x.pop && x.type === "popstate") {
                     console.log("pressed back or forward or changed location manually");
                    // ogni volta che vado indietro o avanti indico di ricaricare dalla cache il componente nel quale si sta andando
                    CustomReuseStrategy.componentsReuseList.push("*");
                }
            }
        );

        this.activatedRoute.queryParams.subscribe(
            params => console.log("params: ", params));

        // this.buttonBar = this.globalContext.buttonBarVisible;
    }
}

export interface SidebarItem {
    description: string,
    routerLInk: string,
    children?: Array<SidebarItem>
}


