import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { LOGIN_URL } from "../../environments/app.constants";
import { GlobalContextService } from "@bds/nt-angular-context";
import { LoggedUser } from "../authorization/logged-user"

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
    errorMessage = "";
    public show: boolean = false;

    constructor(public httpClient: HttpClient, private router: Router, private globalContextService: GlobalContextService) { }

    ngOnInit() {
        this.httpClient.get<any>(LOGIN_URL)
            .subscribe(
            // Successful responses call the first callback.
            data => {
                this.setDataLogin(data, "GET");
            },
            (err) => {
                this.show = true;
            });
    }

    /* login(form: NgForm){
  
     if(form.value.email === 'admin@admin.com' && form.value.password === '123'){
     localStorage.setItem("email", form.value.email);
     this.router.navigate(['/dashboard']);
     }
  
     }*/

    login(form: NgForm) {
        this.errorMessage = "";

        this.httpClient.post(LOGIN_URL, { username: form.value.username, "password": form.value.password, "codiceAzienda": form.value.codiceAzienda })
            .subscribe(
            (data: any) => {
                this.setDataLogin(data, "POST");

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


    private setDataLogin(data: any, httpMethod: string) {
        sessionStorage.setItem("token", data.token);
        debugger;
        if (httpMethod === "GET") {
            sessionStorage.setItem("loginMethod", "sso");
        }
        else {
            sessionStorage.setItem("loginMethod", "local");
        }


        //let userInfoMap: Object = data.userInfoMap;

        //sessionStorage.setItem("userInfoMap", JSON.stringify(userInfoMap));

        //let loggedUser = new LoggedUser(userInfoMap);

        //this.globalContextService.setSubjectInnerSharedObject("loggedUser", loggedUser);

        this.router.navigate(["/home"], { queryParams: { reset: true } });
    }

}
