import { Entity } from "@bds/nt-angular-context/entity";
import { Entities}  from "../../../../environments/app.constants";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { FaseIter } from "./fase-iter";
import { Utente } from "./utente";
import { Fase } from "./fase";
import { ProcedimentoCache } from "./procedimento-cache";

export class Iter extends Entity {
  id: number;
  idResponsabileProcedimento: Utente;
  FK_id_responsabile_procedimento: number;
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
  idFaseCorrente: Fase;
  iterList: Iter[];
  idIterPrecedente: Iter;
  faseIterList: FaseIter[];
  procedimentoCache: ProcedimentoCache;
  dataChiusuraPrevista: Date;


  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        idResponsabileProcedimento: new OdataForeignKey(Entities.Utente, "id"),
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
        idFaseCorrente: new OdataForeignKey(Entities.Fase, "id"),
        idIterPrecedente: new OdataForeignKey(Entities.Iter, "id"),
        procedimentoCache: new OdataForeignKey(Entities.ProcedimentoCache, "idIter")
      }
    }
  }
}
