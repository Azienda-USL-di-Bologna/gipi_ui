import { Component, Input } from '@angular/core';
import { Iter } from 'app/classi/server-objects/entities/iter';
import { OdataContextFactory } from '@bds/nt-angular-context';
import { OdataContextDefinition } from '@bds/nt-angular-context/odata-context-definition';
import { CustomLoadingFilterParams } from '@bds/nt-angular-context/custom-loading-filter-params';
import { Entities } from 'environments/app.constants';

@Component({
  selector: 'avvia-nuovo-iter',
  templateUrl: './avvia-nuovo-iter.component.html',
  styleUrls: ['./avvia-nuovo-iter.component.scss']
})
export class AvviaNuovoIterComponent {
  
  private odataContextDefinition: OdataContextDefinition;
  
  public nomeProcedimento: string;
  public iter: Iter = new Iter();
  public dataSourceUtenti = {};
  public utenteConnesso = "Ilithia"

  @Input()
  set procedimentoSelezionato(procedimento: any) {
    this.nomeProcedimento = procedimento.nome;
    //this.optionChanged();
  }

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();   
    this.iter.dataCreazione = new Date();
    // console.log(JSON.parse(sessionStorage.getItem("userInfoMap")));
    this.buildDataSourceUtenti();
  }

  buildDataSourceUtenti() {
    const customOdataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSourceUtenti = {
      store: customOdataContextDefinition.getContext()[Entities.Utente.name].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        customOdataContextDefinition.customLoading(loadOptions);
      }),
      paginate: true,
      pageSize: 15
    };
  }

  avviaIter() {
    console.log(this.iter);
  }

  public handleEvent(name: String, data: any) {
    switch (name) {
      case "onClickProcedi":
        this.avviaIter();
      break
    }
  }
}
