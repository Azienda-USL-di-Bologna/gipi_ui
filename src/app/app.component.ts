import { Component, OnDestroy, OnInit, HostListener } from "@angular/core";
import { Location } from "@angular/common";
import { CustomReuseStrategy } from "@bds/nt-angular-context/routes/custom-reuse-strategy";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { GlobalContextService, OdataContextFactory } from "@bds/nt-angular-context";
import { Ruolo } from "./classi/server-objects/entities/ruolo";
import { Subscription } from "rxjs/Subscription";
import { ODATA_BASE_URL } from "../environments/app.constants";
import { SidebarItem } from "@bds/nt-angular-context/templates/sidebar/sidebar.component";
import { $ } from "protractor";
import { LoggedUser } from "./authorization/logged-user"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

    private userInfoMap: any;
    private subscriptions: Subscription[] = [];
    // buttonBar: Observable<boolean>;

    public username: string;
    public azienda: string;

    public ruolo: string = "";
    public ruoli: string[];

    public route: string;
    public classeSidebar: string = "sidebar-style";

    public sidebarItems: Array<SidebarItem> = [];
    public sidebarItems2: Array<SidebarItem> = [new SidebarItem("Iter Procedimento", "iter-procedimento")];
    public userInfoMap$: Observable<Object>;
    public loggedUser$: Observable<Object>;


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


    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.code == "F5") {
            this.router.navigate([""]);
        }
    }

    slide() {
        if (this.classeSidebar.indexOf("active") >= 0) {
            this.classeSidebar = "sidebar-style";
        } else {
            this.classeSidebar = "sidebar-style active";
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

        if (sessionStorage.getItem("userInfoMap")) {
            this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));
            this.username = this.userInfoMap["username"];
            // this.ruolo = this.userInfoMap["bit_ruoli"];
            // debugger;
            this.azienda = this.userInfoMap["aziende"]["nome"];
        }




        this.userInfoMap$ = this.globalContextService.getSubjectInnerSharedObject("userInfoMap");
        this.userInfoMap$.subscribe(
            (value: any) => {
                if (value) {
                    this.userInfoMap = value;
                    // debugger;
                    // this.username = value["username"];
                    // this.ruolo = value["bit_ruoli"];
                    this.azienda = value.aziende.nome;
                }

            }
        );

        // debugger;
        this.ruolo = "";
    
        this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
        this.subscriptions.push(
            this.loggedUser$.subscribe(
                (loggedUser: LoggedUser) => {
                    if (loggedUser) {
                        this.ruoli = loggedUser.getRuoli();
                        this.ruolo = "";
                        this.ruoli.forEach(element => {
                            this.ruolo += element + " "
                        }); ;
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


