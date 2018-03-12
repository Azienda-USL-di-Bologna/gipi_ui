import DataSource from "devextreme/data/data_source";
import { Component, Input, ViewEncapsulation, OnInit, SimpleChanges } from "@angular/core";
import { FaseIter, Fase, Iter } from "@bds/nt-entities";
import { OdataContextFactory } from "@bds/nt-context";
import { OdataContextDefinition } from "@bds/nt-context";


@Component({
  selector: "app-sequenza-delle-fasi",
  templateUrl: "./sequenza-delle-fasi.component.html",
  styleUrls: ["./sequenza-delle-fasi.component.scss"]
})
export class SequenzaDelleFasiComponent implements OnInit {

  public datasource: DataSource;
  public idIter: number;
  public statoAttuale: string;

  @Input() set daPadre(value: any){
    this.idIter = parseInt(value["idIter"]);
    let _that = this;
    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[new FaseIter().getName()],
      expand: ["idFase", "idIter"],
      filter: ["idIter.id", "=", this.idIter],
      pageSize: 5,
      onChanged: function(){
        _that.statoAttuale = "(" + this.items()[0].idFase.nome + ")";
      }
    });
  };

  public faseIter: FaseIter = new FaseIter;
  public iter: Iter = new Iter();
  public fasi: Array<Fase>;
  private odataContextDefinition: OdataContextDefinition;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() { }


}
