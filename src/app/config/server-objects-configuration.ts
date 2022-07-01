import {
    Azienda, Utente, Struttura, UtenteStruttura, AziendaTipoProcedimento, TipoProcedimento, AfferenzaStruttura,
    Ruolo, Iter, FaseIter, Fase, Titolo, Procedimento, Evento, EventoIter, DocumentoIter, ProcedimentoCache,
    GetStruttureByTipoProcedimento, GetIterUtente, GetUtentiGerarchiaStruttura, Stato, GetTipiProcedimento, Registro, RegistroTipoProcedimento, Persona, RegistroIter
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
        DocumentoIter: new DocumentoIter(),
        Stato: new Stato(),
        Registro: new Registro(),
        RegistroIter: new RegistroIter(),
        RegistroTipoProcedimento: new RegistroTipoProcedimento(),
        Persona: new Persona()
    };
    return  new ServerObjectsConfiguration(entities);
}

export function getFunctionsImportConfiguration(): ServerObjectsConfiguration {

    const functionsImport: ServerObjectsDescriptor = {
        GetStruttureByTipoProcedimento: new GetStruttureByTipoProcedimento(),
        GetIterUtente: new GetIterUtente(),
        GetUtentiGerarchiaStruttura: new GetUtentiGerarchiaStruttura(),
        GetTipiProcedimento: new GetTipiProcedimento()
    };

    return new ServerObjectsConfiguration(functionsImport);
}