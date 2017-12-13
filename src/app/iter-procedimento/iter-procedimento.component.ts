import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { Entities } from "../../environments/app.constants";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";

import { SequenzaDelleFasiComponent } from './sequenza-delle-fasi/sequenza-delle-fasi.component';
import { Iter } from '../classi/server-objects/entities/iter';
import { Utente } from '../classi/server-objects/entities/utente';
import { Fase } from '../classi/server-objects/entities/fase';
import { FaseIter } from '../classi/server-objects/entities/fase-iter';
import { ProcedimentoCache } from '../classi/server-objects/entities/procedimento-cache';

@Component({
  selector: 'app-iter-procedimento',
  templateUrl: './iter-procedimento.component.html',
  styleUrls: ['./iter-procedimento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IterProcedimentoComponent implements OnInit {

  public iter: Iter = new Iter();
  public procedimentoCache = new ProcedimentoCache;
  public dataSourceIter: DataSource;
  public durataPrevista: number;
  public idIter: string = '6';
  public popupVisible: boolean = false;
  // Dati che verranno ricevuti dall'interfaccia chiamante
  public infoGeneriche: any = { azienda: 'AOSP-BO',
                              struttura: 'UO DaTer',
                              tipoProcedimento: 'Tipologia A',
                              numeroIter: 6
  };
  public popupData: any = { visible: false,
                            title: 'titolo',
                            field: 'nome campo',
                            fieldValue: 'valore'
  };

  constructor(private odataContextFactory: OdataContextFactory) {
    const oataContextDefinitionTitolo: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nomeTitolo");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

    this.dataSourceIter = new DataSource({
        store: oataContextDefinitionTitolo.getContext()[Entities.Iter.name],
        expand: ['idFase', 'idIterPrecedente', 'idResponsabileProcedimento', 'idResponsabileAdozioneProcedimentoFinale', 'procedimentoCache', 'procedimentoCache.idTitolarePotereSostitutivo'],
        filter: [['id', '=', 6]]
    });
    this.dataSourceIter.load().then(res =>{
      this.iter.build(res[0], Iter);
      this.iter.dataChiusuraPrevista = new Date( this.iter.dataAvvio.getTime());
      this.iter.dataChiusuraPrevista.setDate(this.iter.dataChiusuraPrevista.getDate() + this.iter.procedimentoCache.durataMassimaProcedimento);
    });
  }

  ngOnInit() {
  }

  updateNoteControInteressati(){
    this.popupData.title = 'Note controinteressati';
    this.popupData.field = 'noteControInteressati';
    this.popupData.fieldValue = this.iter.noteControinteressati;
    this.popupData.visible = true;
  }

  updateEsitoMotivazione(){
    this.popupData.title = 'Esito motivazione';
    this.popupData.field = 'esitoMotivazione';
    this.popupData.fieldValue = this.iter.esitoMotivazione;
    this.popupData.visible = true;
  }

}
