import {Injectable} from "@angular/core";
import ODataContext from "devextreme/data/odata/context";
import {ODATA_STORE_ROOT_URL, odataAziendeTipiProcPath} from "../../../environments/app.constant";


import {keyConverters, EdmLiteral} from 'devextreme/data/odata/utils';
import * as moment from 'moment';
import * as config from 'devextreme/core/config';

export const Entities = {
    TipoProcedimento: "TipoProcedimentos",
    Azienda: "Aziendas",
    AziendaTipoProcedimento: "AziendaTipoProcedimentos",
    Struttura: "Strutturas",
};

export class OdataForeignKey {
  private targetEntity: string;
  private keyName: string;

  constructor(targetEntity: string, keyName: string) {
    this.targetEntity = targetEntity;
    this.keyName = keyName;
  }

  public getTargetEntity(): string {
    return this.targetEntity;
  }

  public getKeyName(): string {
    return this.keyName;
  }
}

@Injectable()
export class OdataContextDefinition {
private odataContext:ODataContext;

    constructor() {
        this.odataContext = new ODataContext({
            url: ODATA_STORE_ROOT_URL,
            entities: {
                [Entities.TipoProcedimento]: {
                    key: "idTipoProcedimento",
                    keyType: "Int32",
                    fieldTypes: {
                        dataInizioValidita: "DateTime",
                        dataFineValidita: "DateTime"

                        // come FK manca idTitolo
                    }
                },
                [Entities.Azienda]: {
                    key: "id",
                    keyType: "Int32"
                },
                [Entities.AziendaTipoProcedimento]: {
                    key: "id",
                    keyType: "Int32",
                    fieldType: {
                        id: "Int32",
                        // come campi non Fk c'è solo l'id
                        idAzienda: new OdataForeignKey(Entities.Azienda, "id"),
                        idTipoProcedimento: new OdataForeignKey(Entities.TipoProcedimento, "id"),
                        // come FK manca idTitolo
                    }
                },
                [Entities.Struttura]: {
                    key: "id",
                    keyType: "Int32",
                    fieldType: {
                        id: "Int32",
                        // come campi non Fk c'è solo l'id
                        idAzienda: new OdataForeignKey(Entities.Azienda, "id"),
                        // come FK manca idStrutturaPadre, idStrutturaSegreteria
                    }
                }
            }
        });
    }



    public getContext():ODataContext{
        return this.odataContext;
    }
}
