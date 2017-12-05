import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { Entities } from "../../environments/app.constants";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { SharedData } from '@bds/nt-angular-context/shared-data';
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";

import { SequenzaDelleFasiComponent } from './sequenza-delle-fasi/sequenza-delle-fasi.component';
import { Iter } from '../classi/server-objects/entities/iter';
import { Utente } from '../classi/server-objects/entities/utente';
import { Fase } from '../classi/server-objects/entities/fase';
import { FaseIter } from '../classi/server-objects/entities/fase-iter';

@Component({
  selector: 'app-iter-procedimento',
  templateUrl: './iter-procedimento.component.html',
  styleUrls: ['./iter-procedimento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IterProcedimentoComponent implements OnInit {

  public iter: Iter = new Iter();
  public dataSourceIter: DataSource;
  public durataPrevista: number;
  public idIter: string = '6';

  constructor(private odataContextFactory: OdataContextFactory, private sharedData: SharedData) { 
    const oataContextDefinitionTitolo: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nomeTitolo");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

    this.dataSourceIter = new DataSource({
        store: oataContextDefinitionTitolo.getContext()[Entities.Iter.name],
        expand: ['idFase', 'idIterPrecedente', 'idResponsabileAdozioneProcedimentoFinale'],
        filter: [['id', '=', 6]]
    });
    this.dataSourceIter.load().then(res =>{
      console.log('RES: ', res)
      this.iter.build(res[0], Iter);

      // let dataChiusuraPrevista: Date = new Date();
      // dataChiusuraPrevista.setDate(this.iter.dataAvvio, this.iter.idResponsabileAdozioneProcedimentoFinale.)
      // this.durataPrevista = this.iter.
      console.log('Iter: ', this.iter)
    });
  }

  ngOnInit() {
  }

}
