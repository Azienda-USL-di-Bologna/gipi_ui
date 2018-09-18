import {Component, OnDestroy, OnInit, HostListener} from "@angular/core";
import {Location} from "@angular/common";
import {CustomReuseStrategy, NavbarService} from "@bds/nt-context";
import {ActivatedRoute, NavigationEnd, NavigationStart, Params, Route, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {GlobalContextService, OdataContextFactory} from "@bds/nt-context";
import {Ruolo, bUtente, bAzienda, bRuolo} from "@bds/nt-entities";
import {Subscription} from "rxjs/Subscription";
import {BarsMode, GlobalContextVariable, LOGOUT_URL, ODATA_BASE_URL} from "../environments/app.constants";
import {SidebarItem} from "@bds/nt-context";
import {LoggedUser} from "@bds/nt-login";
import * as $ from "jquery";
import * as deLocalization from "devextreme/localization";
import {AppConfiguration} from "./config/app-configuration";
import { ParametriAziendaService } from "./services/parametri-azienda.service";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    public username: string;
    public azienda: string;
    public descrizioneAzienda: string;
    public nomeUtente: string;
    public cognomeUtente: string;
    public isUserLogged: boolean = false;

    public ruolo: string = "";
    public ruoli: Ruolo[];

    public route: string;
    public classeSidebar: string = "sidebar-style d-none";
    public classeRightSide: string;

    public enableSidebarByRole: boolean;
    public sidebarItems: Array<SidebarItem> = [];
    // public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];
    public userInfoMap$: Observable<Object>;
    public loggedUser$: Observable<LoggedUser>;

    public visitedRoutesFromService$: Observable<Route[]>;

    public XIcon: string = "assets/images/x-mark-512.png";
    public backArrowIcon: string = "assets/images/arrow-112-512.png";
    public closeIcon: string = this.XIcon;

    constructor(private location: Location, public router: Router, private activatedRoute: ActivatedRoute,
                private globalContextService: GlobalContextService,
                private odataContextFactory: OdataContextFactory, public appConfig: AppConfiguration,
                private navbarService: NavbarService,
                private parametriAziendaService: ParametriAziendaService) {
        this.odataContextFactory.setOdataBaseUrl(ODATA_BASE_URL);
        console.log("hostname", window.location.hostname);
        console.log("host", window.location.host);
        console.log("protocol", window.location.protocol);
        console.log("location", window.location);

        this.visitedRoutesFromService$ = this.navbarService.visitedRoutes$;

        // mi sottoscrivo all'observable che contiene le rotte visitate in modo che ogni volta che cambia vengo notificato
        this.visitedRoutesFromService$.subscribe((visitedRoutes) => {

            // nel caso sia rimasto un solo elemento nell'array delle rotte visitate (per sicurezza controllo anche il caso in cui sia vuoto), cambio l'icona mettendoci quella con la X
            if (!visitedRoutes ||  visitedRoutes.length <= 1) {
               this.closeIcon = this.XIcon;
            }
            // altrimenti metto quella con la freccia all'indietro
            else {
               this.closeIcon = this.backArrowIcon;
            }
        });


        this.route = this.router.url;
        // this.router.events
        //     .filter((event) => (event instanceof NavigationStart) || (event instanceof NavigationEnd))
        //     .subscribe(
        //         (next: any) => {
        //         });

        // leggo dai queryParams il parametro "showbars", se c'è a seconda del suo valore decido di mostrare o nascondere l'appbar e la sidebar
        // mettendolo qui nell'AppComponent, vale per tutte le interfacce
        this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
            const barsModeParam: string = queryParams["barsmode"];

            if (barsModeParam) {
                switch (barsModeParam) {
                    case BarsMode.ALL: {
                        this.appConfig.setAppBarVisible(true);
                        this.appConfig.setSideBarVisible(true);
                        this.appConfig.setAppBarSimple(false);
                        break;
                    }
                    case BarsMode.NONE: {
                        this.appConfig.setAppBarVisible(false);
                        this.appConfig.setSideBarVisible(false);
                        this.appConfig.setAppBarSimple(false);
                        break;
                    }
                    case BarsMode.SIMPLE: {
                        this.appConfig.setAppBarVisible(true);
                        this.appConfig.setSideBarVisible(false);
                        this.appConfig.setAppBarSimple(true);
                        break;
                    }
                    case BarsMode.SIMPLE_WITH_SIDEBAR: {
                        this.appConfig.setAppBarVisible(true);
                        this.appConfig.setSideBarVisible(true);
                        this.appConfig.setAppBarSimple(true);
                    }
                }
            }
        });

        this.buildLocalization();
    }

    private buildLocalization() {
        deLocalization.locale("it");

        $.getJSON("assets/localization/it.json").then(function (data) {
            deLocalization.loadMessages(data);
        }).fail(function () {
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
        // console.log("IS SD???", loggedUser.isSD())
        if (loggedUser.isSD())
            this.sidebarItems.push(new SidebarItem("Lista Iter Per Demiurghi", "lista-iter-per-demiurgo"));
        if (loggedUser.isOS())
            this.sidebarItems.push(new SidebarItem("Elenco Iter Aziendali", "lista-iter-aziendali"));

        this.sidebarItems.push(new SidebarItem("Procedimenti Attivi", "procedimenti-attivi"));
        this.sidebarItems.push(new SidebarItem("Elenco iter", "app-lista-iter"));
        // this.sidebarItems.push(new SidebarItem("Test", "", this.sidebarItems2));
    }

    // @HostListener("window:keydown", ["$event"])
    // keyEvent(event: KeyboardEvent) {
    //     if (event.code === "F5") {
    //         this.router.navigate(["/home"]);
    //     }
    // }

    slide(isLogout: boolean) {
        if (this.classeSidebar.indexOf("active") >= 0 || isLogout) {
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
        const $this = this;
        window.addEventListener("click", function (e) {
            if (document.getElementById("userDropdown") && !document.getElementById("userDropdown").contains(<Node> e.target) && !document.getElementById("userDropdownToggle").contains(<Node> e.target)
                && $("#userDropdown").hasClass("show")) {
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
                        this.descrizioneAzienda = loggedUser.getField(bUtente.aziendaLogin)[bAzienda.descrizione];
                        this.nomeUtente = loggedUser.getField(bUtente.nome);
                        this.cognomeUtente = loggedUser.getField(bUtente.cognome);

                        this.enableSidebarByRole = false;
                        this.ruoli.forEach(element => {
                            if (!this.enableSidebarByRole && element[bRuolo.nomeBreve] !== "UG") {
                                this.enableSidebarByRole = true;
                            }
                            this.ruolo += element[bRuolo.nomeBreve] + " ";
                        });
                        this.parametriAziendaService.getParametri("gipi", loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id]);
                        if (this.enableSidebarByRole) {
                            this.buildSideBar(loggedUser);
                        }
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

        this.slide(true); // Chiudo la sidebar se è aperta

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

    onClose() {

        // Al click del pulsante di chiusura, controllo se sono nella finestra iniziale, se si, chiudo la finistra, se no vado indietro

        // se sono nel path iniziale l'icona sarà stata cambiata con la X di chisura
        if (this.closeIcon === this.XIcon) {
            window.close();
        }
        else {
            this.location.back();
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

    getBackgroundColor() {
        let router: any = this.router;
        if (router.currentUrlTree.root &&
            router.currentUrlTree.root.children &&
            router.currentUrlTree.root.children.primary &&
            router.currentUrlTree.root.children.primary.segments[0].path === "iter-procedimento") {
            return "background-darker clRightSide";
        } else {
            return "clRightSide";
        }
    }
}
