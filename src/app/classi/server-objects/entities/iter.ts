import { Entity } from "@bds/nt-angular-context/entity";
import { Entities}  from "../../../../environments/app.constants";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { FaseIter } from "./fase-iter";
import { Utente } from "./utente";
import { Fase } from "./fase";

export class Iter extends Entity {
  id: number;
  idResponsabileProcedimento: Utente;
  numeroIter: number;
  annoIter: number;
  oggetto: string;
  stato: string;
  dataCreazione: Date;
  dataAvvio: Date;
  dataChiusura: Date;
  esito: string;
  esitoMotivazione: string;
  promotore: string;
  presenzaControinteressati: string;
  noteControinteressati: string;
  modalitaCollegamentoPrecedente: string;
  idFascicolo: string;
  nomeFascicolo: string;
  idTitolo: number;
  nomeTitolo: string;
  derogaDurata: number;
  motivoDerogaDurata: string;
  derogaSospensione: number;
  motivoDerogaSospensione: string;
  idResponsabileAdozioneProcedimentoFinale: Utente; 
  idFase: Fase;
  iterList: Iter[];
  idIterPrecedente: Iter;
  faseIterList: FaseIter[];

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        idResponsabileProcedimento: "Int32",
        numeroIter: "Int32",
        annoIter: "Int32",
        oggetto: "String",
        stato: "String",
        dataCreazione: "DateTime",
        dataAvvio: "DateTime",
        dataChiusura: "DateTime",
        esito: "String",
        esitoMotivazione: "String",
        promotore: "String",
        presenzaControinteressati: "String",
        noteControinteressati: "String",
        modalitaCollegamentoPrecedente: "String",
        idFascicolo: "String",
        nomeFascicolo: "String",
        idTitolo: "Int32",
        nomeTitolo: "String",
        derogaDurata: "Int32",
        motivoDerogaDurata: "String",
        derogaSospensione: "Int32",
        motivoDerogaSospensione: "String",
        idResponsabileAdozioneProcedimentoFinale: new OdataForeignKey(Entities.Utente, "id"),
        idFase: new OdataForeignKey(Entities.Fase, "id"),
        idIterPrecedente: new OdataForeignKey(Entities.Iter, "id")
      }
    }
  }
}
