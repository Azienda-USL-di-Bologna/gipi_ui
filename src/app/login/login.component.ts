import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { LOGIN_URL } from "../../environments/app.constants";
import { GlobalContextService } from "@bds/nt-angular-context";
import { LoggedUser } from "../authorization/logged-user";
import { CommonData } from "../authorization/common-data";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "../../environments/app.constants";
import { Ruolo } from "../classi/server-objects/entities/ruolo";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
    private ruoliDataSource: DataSource;
    private odataContextDefinition: OdataContextDefinition;
    private ruoli: Ruolo[];
    public errorMessage = "";
    public show: boolean = false;

    constructor(public httpClient: HttpClient,
        private router: Router,
        private globalContextService: GlobalContextService,
        private odataContextFactory: OdataContextFactory) {
    }

    private setDataLogin(data: any, httpMethod: string) {
        sessionStorage.setItem("token", data.token);

        if (httpMethod === "GET") {
            sessionStorage.setItem("loginMethod", "sso");
        }
        else {
            sessionStorage.setItem("loginMethod", "local");
        }

        let loggedUser = new LoggedUser(data.userInfo);
        // scrittura in due modi del dato: normale su varialibe di sessione che come observable
        this.globalContextService.setSubjectInnerSharedObject("loggedUser", loggedUser);
        this.globalContextService.setInnerSharedObject("loggedUser", loggedUser);
        sessionStorage.setItem("userInfo", JSON.stringify(data.userInfo));
    }

    ngOnInit() {

        this.httpClient.get<any>(LOGIN_URL)
            .subscribe(
            // Successful responses call the first callback.
            data => {
                this.setDataLogin(data, "GET");

                let redirectTo: string = sessionStorage.getItem("redirectTo");
                if (redirectTo) {
                    console.log("redirectTo", redirectTo);
                    sessionStorage.removeItem("redirectTo");
                    this.router.navigateByUrl(redirectTo);
                }
                else {
                    console.log("RedirectToHome");
                    this.router.navigate(["/home"], {queryParams: {reset: true}});
                }
            },
            (err) => {
                this.show = true;
            });


    }

    login(form: NgForm) {
        this.errorMessage = "";



        this.httpClient.post(LOGIN_URL, { username: form.value.username, "password": form.value.password, "codiceAzienda": form.value.codiceAzienda })
            .subscribe(
            (data: any) => {
                this.setDataLogin(data, "POST");
                let redirectTo: string = sessionStorage.getItem("redirectTo");
                if (redirectTo) {
                    console.log("redirectTo", redirectTo);
                    sessionStorage.removeItem("redirectTo");
                    this.router.navigateByUrl(redirectTo);
                }
                else {
                    console.log("RedirectToHome");
                    this.router.navigate(["/home"], {queryParams: {reset: true}});
                }
            },
            (err) => {
                console.log(err);
                form.value.username = "";
                form.value.password = "";
                console.log("Errore nel login!");
                this.errorMessage = "Errore: username e/o password errati";
            }
            );
    }
}
