import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, NavigationEnd, ResolveEnd, Route, Router} from "@angular/router";
import {CustomReuseStrategy} from "@bds/nt-angular-context/Routes/custom-reuse-strategy";


@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {

    public visitedRoutes: Route[] = [];
    @Input("switchResetBreadcrumps") switchResetBreadcrumps: number = 0;

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof ResolveEnd)
            .subscribe(
                (next: ResolveEnd) => {
                    // console.log("boh", next.url);
                    let reset = false;
                    let url = next.url;
                    const pos: number = url.indexOf("?");
                    if (pos >= 0) {
                        url = url.substring(0, pos);
                    }
                    const path = url.substring(1);
                    const queryParams: any = next.state.root.queryParams;
                    if (queryParams) {
                        reset = queryParams.reset === "true";
                    }
                    const currentRoute: Route = this.router.config.find(e => e.path === path);
                    // const currentBreadcrump: string = this.router.config.find(e => e.path === path).data.breadcrumb;
                    const index = this.visitedRoutes.findIndex(e => e.path === currentRoute.path);
                    if (index >= 0) {
                        this.visitedRoutes = this.visitedRoutes.slice(0, index + 1);

                        if (!reset)
                            CustomReuseStrategy.componentsReuseList.push("*");
                    }
                    else {
                        this.visitedRoutes.push(currentRoute);
                        // CustomReuseStrategy.componentsReuseList.push("*");
                    }
                    // console.log("RouterConfig", this.router.config);
                }
            );

        // this.route
        //     .queryParams
        //     .subscribe(params => {
        //         // Defaults to 0 if no query param provided.
        //         console.log(params);
        //     });
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes["switchResetBreadcrumps"]) {
    //         this.visitedRoutes = [];
    //     }
    // }
}
