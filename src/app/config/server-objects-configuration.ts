import {
    Azienda, Utente, Struttura, UtenteStruttura, AziendaTipoProcedimento, TipoProcedimento, AfferenzaStruttura,
    Ruolo, Iter, FaseIter, Fase, Titolo, Procedimento, Evento, EventoIter, DocumentoIter, ProcedimentoCache,
    GetStruttureByTipoProcedimento, GetIterUtente
} from "@bds/nt-entities";
import {ServerObject, ServerObjectsDescriptor, ServerObjectsConfiguration} from "@bds/nt-context";
// import * as ServerObjectConfiguration from "@bds/nt-context";

export function getEntitiesConfiguration(): ServerObjectsConfiguration {

    const entities: ServerObjectsDescriptor = {
        Azienda: new Azienda(),
        Utente:  new Utente(),
        Struttura: new Struttura(),
        UtenteStruttura: new UtenteStruttura(),
        AfferenzaStruttura: new AfferenzaStruttura(),
        TipoProcedimento: new TipoProcedimento(),
        Ruolo: new Ruolo(),
        AziendaTipoProcedimento: new AziendaTipoProcedimento(),
        Titolo: new Titolo(),
        Procedimento: new Procedimento(),
        Iter: new Iter(),
        Fase: new Fase(),
        FaseIter: new FaseIter(),
        Evento: new Evento(),
        EventoIter: new EventoIter(),
        ProcedimentoCache:  new ProcedimentoCache(),
        DocumentoIter: new DocumentoIter()
    };
    return  new ServerObjectsConfiguration(entities);
}

export function getFunctionsImportConfiguration(): ServerObjectsConfiguration {

    const functionsImport: ServerObjectsDescriptor = {
        GetStruttureByTipoProcedimento: new GetStruttureByTipoProcedimento(),
        GetIterUtente: new GetIterUtente()
    };

    return new ServerObjectsConfiguration(functionsImport);
}