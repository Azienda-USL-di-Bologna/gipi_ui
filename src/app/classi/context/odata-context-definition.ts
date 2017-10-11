import {Injectable} from "@angular/core";
import ODataContext from "devextreme/data/odata/context";
import {ODATA_STORE_ROOT_URL, odataAziendeTipiProcPath} from "../../../environments/app.constant";

export const Entities = {
    TipoProcedimentos: "TipoProcedimentos",
    Aziendas: "Aziendas",
    AziendaTipoProcedimentos: "AziendaTipoProcedimentos",
    Strutturas: "Strutturas",
};

@Injectable()
export class OdataContextDefinition {
private odataContext:ODataContext;

    constructor() {
        this.odataContext = new ODataContext({
            url: ODATA_STORE_ROOT_URL,
            entities: {
                [Entities.TipoProcedimentos]: {
                    key: "idTipoProcedimento",
                    keyType: "Int32"
                },
                [Entities.Aziendas]: {
                    key: "id",
                    keyType: "Int32"
                },
                [Entities.AziendaTipoProcedimentos]: {
                    key: "id",
                    keyType: "Int32"
                },
                [Entities.Strutturas]: {
                    key: "id",
                    keyType: "Int32"
                }
            }
        });
    }



    public getContext():ODataContext{
        return this.odataContext;
    }
}
