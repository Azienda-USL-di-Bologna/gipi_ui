import { Component, OnDestroy, OnInit, HostListener, Input } from "@angular/core";
import { Location } from "@angular/common";
import { CustomReuseStrategy } from "@bds/nt-angular-context/routes/custom-reuse-strategy";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { GlobalContextService, OdataContextFactory } from "@bds/nt-angular-context";
import { Ruolo } from "./classi/server-objects/entities/ruolo";
import { Subscription } from "rxjs/Subscription";
import {LOGOUT_URL, ODATA_BASE_URL} from "../environments/app.constants";
import { SidebarItem } from "@bds/nt-angular-context/templates/sidebar/sidebar.component";
import { $ } from "protractor";
import { LoggedUser } from "./authorization/logged-user";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    public username: string;
    public azienda: string;
    public isUserLogged: boolean = false;

    public ruolo: string = "";
    public ruoli: Ruolo[];

    public route: string;
    public classeSidebar: string = "sidebar-style d-none";
    public classeRightSide: string;

    public sidebarItems: Array<SidebarItem> = [];
    public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];
    public userInfoMap$: Observable<Object>;
    public loggedUser$: Observable<LoggedUser>;


    constructor(private location: Location, public router: Router, private globalContextService: GlobalContextService, private odataContextFactory: OdataContextFactory) {
        this.odataContextFactory.setOdataBaseUrl(ODATA_BASE_URL);
        console.log("hostname", window.location.hostname);
        console.log("host", window.location.host);
        console.log("protocol", window.location.protocol);
        console.log("location", window.location);

        this.route = this.router.url;

        this.globalContextService.setSubjectInnerSharedObject("userInfoMap", null);

    }

    private buildSideBar(loggedUser: LoggedUser) {
        this.sidebarItems = [];

        this.sidebarItems.push(new SidebarItem("Home", "home"));
        if (loggedUser.isCI) {
            this.sidebarItems.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
        }

        this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi"));
        this.sidebarItems.push(new SidebarItem("Lista Iter", "app-lista-iter"));
        this.sidebarItems.push(new SidebarItem("Test", "", this.sidebarItems2));
    }

    @HostListener("window:keydown", ["$event"])
    keyEvent(event: KeyboardEvent) {
        if (event.code === "F5") {
            this.router.navigate(["/home"]);
        }
    }

    slide() {
        if (this.classeSidebar.indexOf("active") >= 0) {
            this.classeSidebar = "col-2 sidebar-style d-none ";
            this.classeRightSide = ""
        } else {
            this.classeSidebar = "col-2 sidebar-style d-block active";
            this.classeRightSide = "offset-2 "
        }
    }

    screen(width) {
        return (width < 700) ? "sm" : "lg";
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

        this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
        this.subscriptions.push(
            this.loggedUser$.subscribe(
                (loggedUser: LoggedUser) => {
                    if (loggedUser) {
                        this.ruoli = loggedUser.ruoli;
                        this.ruolo = "";
                        this.ruoli.forEach(element => {
                            this.ruolo += element.nomeBreve + " ";
                        });
                        this.buildSideBar(loggedUser);
                    }
                }
            )
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
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("loginMethod");
        if (loginMethod !== "sso") {
            console.log(loginMethod);
            this.router.navigate(["/login"]);
        }
        else {
            // window.location.href = "https://gdml.internal.ausl.bologna.it/Shibboleth.sso/Logout";
            window.location.href = LOGOUT_URL;
        }
    }

    getContentBodyClasses(){
        if(this.router.url === '/login'){
            return 'col heightCPC';
        }else{
            return 'col';
        }
    }
}
