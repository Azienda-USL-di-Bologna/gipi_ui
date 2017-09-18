import { Component, OnInit } from '@angular/core';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import ODataContext from 'devextreme/data/odata/context';
import {
  ODATA_STORE_ROOT_URL, odataAziendeStruttureTipiProcPath,
  odataTipiProcedimentoPath
} from '../../environments/app.constant'
import { TipiProcedimentoService, Tab } from './tipi-procedimento.service';
import { GlobalService } from '../global-service';


@Component({
  selector: 'app-tipi-procedimento',
  templateUrl: './tipi-procedimento.component.html',
  styleUrls: ['./tipi-procedimento.component.css'],
  providers: [TipiProcedimentoService]
})
export class TipiProcedimentoComponent implements OnInit {


  events: Array<string> = [];


  dataSourceTipiProcedimento: any;
  companyDataSource: DataSource;
  associatedCompaniesSource: DataSource;

  companyProcTypeGrid: any;
  procTypeGrid: any;

  selectedRow: any;

  formItems: any;
  defaultOpenModesSource: string[];

  currentEditingRow: any;
  currentProcTypeCompanies: any[];

  editingTabs: Tab[];

  popupVisible: boolean = false;



  aziendeNonAssociateArray: string[];
  tutteLeAziendeArray: string[];

  tutteLeAziende: any;

  context: any;




  constructor(private service: TipiProcedimentoService, private gs: GlobalService) {

    this.currentEditingRow = new Object();
    this.editingTabs = service.getTabs();
    this.defaultOpenModesSource = ['b', 'A', 'd'];


    this.dataSourceTipiProcedimento = new DataSource({
      store: new ODataStore({
        key: 'idTipoProcedimento',
        url: ODATA_STORE_ROOT_URL + odataTipiProcedimentoPath
      }),
      onChanged: function () {

      },
      expand: ['aziendeStruttureTipiProcedimentoList/idAzienda']
    });


    // mi serve chiamarlo qui perchè se no non fa bene il binding di associatedCompaniesSource col dataSource della tabella di cross
    this.associatedCompaniesSource = service.getCompanyStructureProcTypeSource(-1);

    this.companyDataSource = service.getCompaniesSource();





  }

  ngOnInit() {

  }

  getCurrentId() {
    if (!this.currentEditingRow)
      return '0';
    return this.currentEditingRow.idTipoProcedimento;
  }

  provaTemplate(a, b, c) {
    console.log("dentroooooo");
  }

  handleEvent(eventName, e) {
    switch (eventName) {
      case 'editingStart':
        this.editingStart(e);
        break;
      case 'companyProcTypeGridInit':
        this.onInitCompanyProcTypeGrid(e);
        break;
      case 'procTypeGridInit':
        this.onInitProcTypeGrid(e);
        break;
      case 'aziendeTipiProcedimentoGridRowUpdating':
      //debugger
        this.aziendeTipiProcedimentoGridRowUpdating(e);
        break;
    }

    this.events.unshift(eventName);
  }


  clearEvents() {
    this.events = [];
  }



  changeSelectedRow(e) {
    console.log(e);
  }

  editingStart(e) {

    this.currentEditingRow = e.data;
    this.associatedCompaniesSource = this.service.getCompanyStructureProcTypeSource(this.getCurrentId());

    //this.companyProcTypeGrid.refresh();

    // this.associatedCompaniesSource.load()
    //   .done(function (res) {
    //
    //   })
    //   .fail(function (err) {
    //
    //   });
  }

  onInitProcTypeGrid(e) {
    this.procTypeGrid = e.component;
  }

  onInitCompanyProcTypeGrid(e) {
    this.companyProcTypeGrid = e.component;
    window['companyProcTypeGrid'] = this.companyProcTypeGrid;
  }


  buttonAssociaClicked(key) {
    console.log("cliccato il bottone associa");
    //debugger;
    this.associatedCompaniesSource = this.service.getCompanyStructureProcTypeSource(key);
    this.popupVisible = true;
  }




  aziendeTipiProcedimentoGridRowUpdating(e) {
    console.log(e);

    this.gs.provaVisibilita();


this.context=this.gs.getContext();

this.context.AziendeStruttureTipiProcedimentos.update(e.key, {
    idAzienda: this.context.objectLink("Aziendas", e.newData.idAzienda.id)
});

    //this.associatedCompaniesSource.store().update(e.key, {'idAzienda': e.newData.idAzienda.__metadata})


/*    console.log(this.context);

    this.associatedCompaniesSource{
      this.companyDataSource.o
    }



    this.Aziend {
      Aziendas: this.context.objectLink("Azienda", e.newData.AziendaDetail.Id)
    });*/
  }



}

