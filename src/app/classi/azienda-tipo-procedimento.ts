export class AziendaTipoProcedimento {
    id: number;
    dataFine: Date;
    dataInizio: Date;
    descrizioneTipoProcedimento: string;
    durataMassimaProcedimento: string;
    durataMassimaSospensione: string;
    idAzienda: Link;
    idTipoProcedimento: Link;
    idTitolo: Link;
    procedimentoList: Link;
}

class Link {
    __deferred: Deferred;
}
class Deferred {
    uri: string;
}
