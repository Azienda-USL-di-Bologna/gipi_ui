import { Azienda } from './aziende';

export class TipoProcedimento {
      idTipoProcedimento: number;
      nomeTipoProcedimento: string;
      descrizioneTipoProcedimentoDefault: string;
      modoApertura: string;
      normaRiferimento: string;
      dataInizioValidita: Date;
      dataFineValidita: Date;
      durataMassimaSospensione: string;
      aziendeAssociate: Array<Azienda>;
}
