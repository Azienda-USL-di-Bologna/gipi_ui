import { Component, OnInit } from '@angular/core';
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";
import {Router} from "@angular/router";
import {SessionManager} from "../login/session-manager";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private sessionManager: SessionManager){
    sessionManager.setExpireTokenOnIdle(300);
  }
  ngOnInit() {
  }

}
