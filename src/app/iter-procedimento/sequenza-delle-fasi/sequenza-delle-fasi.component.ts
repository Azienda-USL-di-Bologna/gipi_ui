import DataSource from "devextreme/data/data_source";
import { Component, Input, ViewEncapsulation, OnInit, SimpleChanges } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { FaseIter } from '../../classi/server-objects/entities/fase-iter';
import { Fase } from '../../classi/server-objects/entities/fase';
import { Iter } from '../../classi/server-objects/entities/iter';
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { OdataContextDefinition } from '@bds/nt-angular-context/odata-context-definition';
import { Entities } from "environments/app.constants";
import { isUndefined } from "util";


@Component({
  selector: 'app-sequenza-delle-fasi',
  templateUrl: './sequenza-delle-fasi.component.html',
  styleUrls: ['./sequenza-delle-fasi.component.scss']
})
export class SequenzaDelleFasiComponent implements OnInit {

  public datasource: DataSource;

  //qua devo prendermi poi il parametro dell'oggetto Iter che mi passa la videata
  //@Input("idIter") idIter: string;
  @Input("daPadre") daPadre: Object;



  public faseIter: FaseIter = new FaseIter;
  public iter: Iter = new Iter();
  public fasi: Array<Fase>;
  private odataContextDefinition: OdataContextDefinition;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();

    // this.datasource = new DataSource({
    //   store: this.odataContextDefinition.getContext()[Entities.FaseIter.name],
    //   expand: ['idFase'],
    //   filter: ['FK_id_iter', '=', this.idIter]
    //   //sort: ['dataInizioFase']
    // });
    // this.datasource.sort({ getter: "dataInizioFase", desc: true });
  }

  ngOnInit() {
    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.FaseIter.name],
      expand: ['idFase', 'idIter'],
      filter: ['idIter.id', '=', parseInt(this.daPadre['idIter'])]
      //sort: ['dataInizioFase']
    });
    this.datasource.sort({ getter: "idFase", desc: true });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.datasource != undefined) {
      this.datasource.load();
    }

  }


}
