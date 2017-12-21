import {Component, OnInit} from "@angular/core";
import {ResolveEnd, Route, Router} from "@angular/router";
import {CustomReuseStrategy} from "@bds/nt-angular-context/Routes/custom-reuse-strategy";
import "rxjs/add/operator/filter";


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
                    if (reset){
                        this.visitedRoutes = [];
                    }
                    const currentRoute: Route = this.router.config.find(e => e.path === path);

                    if (currentRoute.data.breadcrumb) {
                        // const currentBreadcrump: string = this.router.config.find(e => e.path === path).data.breadcrumb;
                        const index = this.visitedRoutes.findIndex(e => e.path === currentRoute.path);
                        if (index >= 0) {
                            this.visitedRoutes = this.visitedRoutes.slice(0, index + 1);

                            // if (!reset)
                            //     CustomReuseStrategy.componentsReuseList.push("*");
                        }
                        else {
                            this.visitedRoutes.push(currentRoute);
                            // CustomReuseStrategy.componentsReuseList.push("*");
                        }
                        // console.log("RouterConfig", this.router.config);
                    }
                }
            );
    }

    onClick(){
        CustomReuseStrategy.componentsReuseList.push("*");
    }
}
