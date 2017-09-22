import { AziendaAssociata } from './azienda-associata';

export class TipoProcedimento {
      idTipoProcedimento: number;
      nomeTipoProcedimento: string;
      descrizioneTipoProcedimentoDefault: string;
      modoApertura: string;
      normaRiferimento: string;
      dataInizioValidita: Date;
      dataFineValidita: Date;
      durataMassimaSospensione: string;
      aziendeAssociate: Array<AziendaAssociata>;
}
