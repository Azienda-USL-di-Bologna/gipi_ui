import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {CustomReuseStrategy} from "@bds/nt-angular-context/Routes/custom-reuse-strategy";
import {ActivatedRoute} from "@angular/router";
import {GlobalContextService} from "./global-context.service";
import {Observable} from "rxjs/Observable";
import {Ruolo} from "./classi/server-objects/entities/ruolo";
import {Azienda} from "./classi/server-objects/entities/azienda";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    _opened= false;
    buttonBar: Observable<boolean>;

    private userInfoMap: Object;
    username: String = "";
    azienda: Azienda;

    private _toggleSidebar() {
        this._opened = !this._opened;
    }

    constructor(private location: Location, private activatedRoute: ActivatedRoute, private globalContext: GlobalContextService) {
        this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));
        if (this.userInfoMap){
            this.username = this.userInfoMap["username"];
            this.azienda = this.userInfoMap["azienda"];
        }
    }

    screen(width) {
        return ( width < 700 ) ? 'sm' : 'lg';
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

        this.buttonBar = this.globalContext.buttonBarVisible;
    }
}
