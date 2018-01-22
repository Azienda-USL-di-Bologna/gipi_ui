import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GlobalContextService } from "@bds/nt-angular-context";
import { CommonData } from "../authorization/common-data"
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "../../environments/app.constants";
import { Ruolo } from "../classi/server-objects/entities/ruolo";

@Component({
  selector: 'after-login',
  templateUrl: './after-login.component.html',
  styleUrls: ['./after-login.component.scss']
})
export class AfterLoginComponent implements OnInit {

    private commonData = new CommonData();
    private ruoliDataSource: DataSource;
    private odataContextDefinition: OdataContextDefinition;
    private ruoli: Ruolo[];

    constructor(private router: Router,
                private globalContextService: GlobalContextService,
                private odataContextFactory: OdataContextFactory ) { }

    ngOnInit() {
        console.log("siamo nell After Login");    
                
        this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
        this.ruoliDataSource = new DataSource({
            store: this.odataContextDefinition.getContext()[Entities.Ruolo.name],
        });
        this.ruoliDataSource.load().then(res => {
            this.ruoli = res;
            this.commonData.ruoli = this.ruoli;
            this.globalContextService.setInnerSharedObject("commonData", this.commonData);
        });

        this.router.navigate(["/home"], { queryParams: { reset: true } });
    }
}
