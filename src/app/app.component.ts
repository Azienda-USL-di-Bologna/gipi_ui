import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {CustomReuseStrategy} from "@bds/nt-angular-context/Routes/custom-reuse-strategy";
import {ActivatedRoute} from "@angular/router";
import {GlobalContextService} from "./global-context.service";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    private _opened= false;
    buttonBar: Observable<boolean>;

    private _toggleSidebar() {
        this._opened = !this._opened;
    }

    constructor(private location: Location, private activatedRoute: ActivatedRoute, private globalContext: GlobalContextService) {
    }

    ngOnInit() {
        /** sottoscrivendosi a questo evento è possibile intercettare la pressione di indietro o aventi del browser
         * purtroppo non c'è modo di differenziarli
         */
        this.location.subscribe(
            x => {
                if (!!x.pop && x.type === "popstate") {
                     console.log("press back");
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
