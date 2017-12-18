import { Component, OnInit } from "@angular/core";
import {NavigationEnd, ResolveEnd, Route, Router} from "@angular/router";
import {CustomReuseStrategy} from "@bds/nt-angular-context/Routes/custom-reuse-strategy";


@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {

    public visitedRoutes: Route[] = [];
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof ResolveEnd)
            .subscribe(
                (next: ResolveEnd) => {
                    // console.log("boh", next.url);
                    const url = next.url;
                    const path = url.substring(1);
                    const currentRoute: Route = this.router.config.find(e => e.path === path);
                    // const currentBreadcrump: string = this.router.config.find(e => e.path === path).data.breadcrumb;
                    const index = this.visitedRoutes.findIndex(e => e.path === currentRoute.path);
                    if (index >= 0) {
                        this.visitedRoutes = this.visitedRoutes.slice(0, index + 1);
                        CustomReuseStrategy.componentsReuseList.push("*");
                    }
                    else {
                        this.visitedRoutes.push(currentRoute);
                        // CustomReuseStrategy.componentsReuseList.push("*");
                    }
                    // console.log("RouterConfig", this.router.config);
                }
            );
    }

}
