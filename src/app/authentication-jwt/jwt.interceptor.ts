import { HttpEvent , HttpRequest , HttpHandler , HttpInterceptor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Observable} from "rxjs/Observable";
import { Utils } from './utils';
import 'rxjs/add/operator/map';

export class JwtInterceptor implements HttpInterceptor{

    constructor(){}

    // public static getToken: () => string = () =>{
    //     console.log("getToken() : " + JSON.stringify(sessionStorage.getItem("token")));
    //     return sessionStorage.getItem("token");
    // };

    public static getToken(): string {
        console.log("getToken() : " + JSON.stringify(sessionStorage.getItem("token")));
        return sessionStorage.getItem("token");
    }

    intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {


        
        const token = JwtInterceptor.getToken();
        request = request.clone({
            setHeaders: {"Authorization": `Bearer ${token}`}
        });
        
        
        console.log("request_da_inviare: " + JSON.stringify(request));

        return next.handle(request);
    }
}