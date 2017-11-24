import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Router, CanActivate} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {LOGIN_URL} from "../../environments/app.constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string = "";

  constructor(public httpClient: HttpClient, private router:Router) { }

  ngOnInit() {
      this.httpClient.get<any>(LOGIN_URL)
          .subscribe(
              // Successful responses call the first callback.
              data => {
                  sessionStorage.setItem("token", data.token);
                  sessionStorage.setItem("userinfo", data.username);
                  sessionStorage.setItem("loginMethod", "sso");
                  this.router.navigate(["/home"]);
              })
  }

  /* login(form: NgForm){

   if(form.value.email === 'admin@admin.com' && form.value.password === '123'){
   localStorage.setItem("email", form.value.email);
   this.router.navigate(['/dashboard']);
   }

   }*/

  login(form: NgForm) {
    this.errorMessage = "";

    this.httpClient.post(LOGIN_URL,{username : form.value.email , "password": form.value.password })
        .subscribe(
            (data: any) => {
              sessionStorage.setItem("token", data.token);
              sessionStorage.setItem("userinfo", data.username);
              sessionStorage.setItem("loginMethod", "local");
              this.router.navigate(["/home"]);
            },
            (err) => {
              console.log(err)
              form.value.email = "";
              form.value.password = "";
              console.log("Errore nel login!");
              this.errorMessage = "Errore: username e/o password errati"
            }
        );
  }



}
