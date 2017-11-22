import { Entity } from "@bds/nt-angular-context/entity";
import { Utente } from "app/classi/server-objects/entities/utente";
import { AziendaTipoProcedimento } from "app/classi/server-objects/entities/azienda-tipo-procedimento";
import { Struttura } from "app/classi/server-objects/entities/struttura";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { Entities } from "../../../../environments/app.constants";

export class Procedimento extends Entity {
  idProcedimento: number;
  idTitolarePotereSostitutivo: Utente;
  FK_id_titolare_potere_sostitutivo: number;
  idAziendaTipoProcedimento: AziendaTipoProcedimento;
  FK_id_azienda_tipo_procedimento: number;
  idStruttura: Struttura;
  FK_id_struttura: number;
  dataInizio: Date;
  dataFine: Date;
  ufficio: string;
  modalitaInfo: string;
  descrizioneAtti: string;

  public static getOdataContextEntity(): any {
    return {
      key: "idProcedimento",
      keyType: "Int32",
      fieldTypes: {
        idProcedimento: "Int32",
        idTitolarePotereSostitutivo: new OdataForeignKey(Entities.Utente, "id"),
        idAziendaTipoProcedimento: new OdataForeignKey(Entities.AziendaTipoProcedimento, "id"),
        idStruttura: new OdataForeignKey(Entities.Struttura, "id"),
        dataInizio: "DateTime",
        dataFine: "DateTime",
        ufficio: "String",
        modalitaInfo: "String",
        descrizioneAtti: "String"
      }
    }
  }
}
