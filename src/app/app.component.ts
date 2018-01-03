import {Component, OnDestroy, OnInit, HostListener} from "@angular/core";
import {Location} from "@angular/common";
import {CustomReuseStrategy} from "@bds/nt-angular-context/routes/custom-reuse-strategy";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import { SidebarItem } from "./classi/client-objects/SidebarItem";
import {GlobalContextService, OdataContextFactory} from "@bds/nt-angular-context";
import {Ruolo} from "./classi/server-objects/entities/ruolo";
import {Subscription} from "rxjs/Subscription";
import {ODATA_BASE_URL} from "../environments/app.constants";
import { $ } from "protractor";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

    private userInfoMap: object;
    private subscriptions: Subscription[] = [];
    // buttonBar: Observable<boolean>;

    public username: string;
    public azienda: string;
    public ruolo: Ruolo;
    public route: string;

    public sidebarItems: Array<SidebarItem> = [];
    public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];
    public userInfoMap$: Observable<Object>;
    public sidebarIcon: string = "chevronright";


    

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
      console.log(event);
      if(event.code=="F5"){
        this.router.navigate([""]);
      }
    }

    constructor(private location: Location, public router: Router, private globalContextService: GlobalContextService, private odataContextFactory: OdataContextFactory) {
        // this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));
        // if (this.userInfoMap) {
        //     this.username = this.userInfoMap["username"];
        //     this.azienda = this.userInfoMap["azienda"];
        // }
        this.odataContextFactory.setOdataBaseUrl(ODATA_BASE_URL);
        console.log("hostname", window.location.hostname);
        console.log("host", window.location.host);
        console.log("protocol", window.location.protocol);
        console.log("location", window.location);
        this.sidebarItems.push(new SidebarItem("Home", "home"));
        this.sidebarItems.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
        this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi"));
        this.sidebarItems.push(new SidebarItem("Lista Iter", "app-lista-iter"));
        this.sidebarItems.push(new SidebarItem("Test", "", this.sidebarItems2));
        // this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi", this.sidebarItems2));
        // this.sidebarItems2.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
        this.route = this.router.url;

        this.globalContextService.setSubjectInnerSharedObject("userInfoMap", null);
    }

    slide() {
        let sideBar = document.getElementById("sidebar-id");

        if (sideBar.classList.contains("active")) {
            sideBar.classList.remove("active");
        } else {
            sideBar.classList.add("active");
        }
        this.sidebarIcon = (this.sidebarIcon === "chevronright" ? "chevronleft" : "chevronright");
    }

    screen(width) {
        return ( width < 700 ) ? "sm" : "lg";
    }


    ngOnInit() {
        /** sottoscrivendosi a questo evento è possibile intercettare la pressione di indietro o aventi del browser
         * purtroppo non c'è modo di differenziarli
         */
        this.subscriptions.push(
            (this.location.subscribe(
            x => {
                if (!!x.pop && x.type === "popstate") {
                    console.log("pressed back or forward or changed location manually");
                    // ogni volta che vado indietro o avanti indico di ricaricare dalla cache il componente nel quale si sta andando
                    CustomReuseStrategy.componentsReuseList.push("*");
                }
            })
        ) as Subscription);

        if (sessionStorage.getItem("userInfoMap")) {
            this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));
            this.username = this.userInfoMap["username"];
            this.ruolo = this.userInfoMap["ruolo"];
            this.azienda = this.userInfoMap["azienda"]["nome"];
        }

        this.userInfoMap$ = this.globalContextService.getSubjectInnerSharedObject("userInfoMap");
        this.userInfoMap$.subscribe(
            (value: any) => {
                if (value) {
                    this.userInfoMap = value;
                    this.username = value["username"];
                    this.ruolo = value["ruolo"];
                    this.azienda = value.azienda.nome;
                }

            }
        );
    }

    ngOnDestroy() {
        console.log("onDestroy");
        if (this.subscriptions && this.subscriptions.length > 0) {
            for (const subcription of this.subscriptions) {
                subcription.unsubscribe();
            }
        }
    }

    onLogout() {

        const loginMethod = sessionStorage.getItem("loginMethod");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userInfoMap");
        sessionStorage.removeItem("loginMethod");

        if (loginMethod !== "sso") {
            this.router.navigate(["/login"]);
        }
        else {
            window.location.href = "https://gdml.internal.ausl.bologna.it/Shibboleth.sso/Logout";
        }
    }

}


