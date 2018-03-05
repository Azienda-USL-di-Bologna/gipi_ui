import { Component, OnDestroy, OnInit, HostListener, Input } from "@angular/core";
import { Location } from "@angular/common";
import { CustomReuseStrategy } from "@bds/nt-context/routes/custom-reuse-strategy";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import { Observable } from "rxjs/Observable";
import {GlobalContextService, OdataContextFactory, OdataForeignKey} from "@bds/nt-context";
import { Ruolo, bUtente, bAzienda, bRuolo } from "@bds/nt-entities";
import { Subscription } from "rxjs/Subscription";
import {LOGOUT_URL, ODATA_BASE_URL} from "../environments/app.constants";
import { SidebarItem } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";
import * as $ from "jquery";
import * as deLocalization from "devextreme/localization";


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
    // public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];
    public userInfoMap$: Observable<Object>;
    public loggedUser$: Observable<LoggedUser>;


    constructor(private location: Location, public router: Router, private globalContextService: GlobalContextService, private odataContextFactory: OdataContextFactory) {
        this.odataContextFactory.setOdataBaseUrl(ODATA_BASE_URL);
        console.log("hostname", window.location.hostname);
        console.log("host", window.location.host);
        console.log("protocol", window.location.protocol);
        console.log("location", window.location);

        this.route = this.router.url;
        this.router.events
            .filter((event) => (event instanceof NavigationStart) || (event instanceof NavigationEnd))
            .subscribe(
            (next) => {
                let reset = false;
            }
            );

        this.globalContextService.setSubjectInnerSharedObject("userInfoMap", null);

        this.buildLocalization();
    }

    private buildLocalization() {
        deLocalization.locale("it");

        $.getJSON("assets/localization/it.json").then(function(data) {
            deLocalization.loadMessages(data);
        }).fail(function() {
            console.log("It language not found, fallback to en");
            deLocalization.locale("en");
        });



        //  deLocalization.date.getD
    }

    private buildSideBar(loggedUser: LoggedUser) {
        this.sidebarItems = [];

        this.sidebarItems.push(new SidebarItem("Home", "home"));
        if (loggedUser.isCI()) {
            this.sidebarItems.push(new SidebarItem("Definizione Tipi Procedimento", "definizione-tipi-procedimento"));
        }
        if (loggedUser.isCA()) {
            this.sidebarItems.push(new SidebarItem("Tipi Procedimento Aziendale", "tipi-procedimento-aziendali"));
        }

        this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi"));
        this.sidebarItems.push(new SidebarItem("Lista Iter", "app-lista-iter"));
        // this.sidebarItems.push(new SidebarItem("Test", "", this.sidebarItems2));
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
            this.classeRightSide = "";
        } else {
            this.classeSidebar = "col-2 sidebar-style d-block active";
            this.classeRightSide = "offset-2 ";
        }
    }

    screen(width) {
        return (width < 700) ? "sm" : "lg";
    }


    ngOnInit() {


        // sad but necessary :c
        var $this = this;
        window.addEventListener('click', function(e){   
            if (!document.getElementById("userDropdown").contains(<Node>e.target) && !document.getElementById("userDropdownToggle").contains(<Node>e.target)
                && $("#userDropdown").hasClass('show')) {
                $this.onProfileBtnClick(e);
            }
        });
        

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
                        this.ruoli = loggedUser.getField(bUtente.ruoli);
                        this.ruolo = "";
                        this.azienda = loggedUser.getField(bUtente.aziendaLogin)[bAzienda.nome];
                        this.ruoli.forEach(element => {
                            this.ruolo += element[bRuolo.nomeBreve] + " ";
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

    onProfileBtnClick(e) {
        let btn = $("#userDropdownToggle");
        btn.toggleClass("focus");
        btn.blur();
        $("#userDropdown").toggleClass("show");
    }

    getContentBodyClasses() {
        if (this.router.url === "/login") {
            return "col heightCPC";
        } else {
            return "col";
        }
    }
}
