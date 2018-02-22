// header http
export const HEADER_AUTH_TOKEN_NAME = "authorization";

// ========================= Url =====================================
// export const ODATA_BASE_URL: string = environment.odataStoreRootUrl;
const hostname: string = window.location.hostname;
const port: string = hostname === "localhost" ? ":10006" : ":443";
console.log("hostname", hostname);
console.log("port", port);

export const ODATA_BASE_RELATIVE_URL: string = "/gipi/resources/odata.svc";
export const ODATA_BASE_URL: string = window.location.protocol + "//" + hostname + port + ODATA_BASE_RELATIVE_URL;
export const CUSTOM_RESOURCES_RELATIVE_URL: string = "/gipi/resources/custom/";
export const CUSTOM_RESOURCES_BASE_URL: string = window.location.protocol + "//" + hostname + port + CUSTOM_RESOURCES_RELATIVE_URL;


// login
export const LOGOUT_RELATIVE_URL: string = "/Shibboleth.sso/Logout";
export const LOGOUT_URL = window.location.protocol + "//" + hostname + port + LOGOUT_RELATIVE_URL;
export const LOGIN_RELATIVE_URL: string = "/gipi/user/login/";
export const LOGIN_URL: string = window.location.protocol + "//" + hostname + port + LOGIN_RELATIVE_URL;


console.log("ODATA_BASE_URL", ODATA_BASE_URL);
console.log("CUSTOM_RESOURCES_BASE_URL", CUSTOM_RESOURCES_BASE_URL);
console.log("LOGIN_URL", LOGIN_URL);
console.log("1", window.location.protocol + "//" + hostname + port + "/gipi/resources/odata.svc");
console.log("2", window.location.protocol + "//" + hostname + "/gipi/resources/odata.svc");

export const DEFAULT_TIMEZONE_OFFSET = 0;
export const DEFAULT_CURRENCY = "EUR";

// ======================= local save name ========================================
export const STORAGE_SECURITY_TOKEN = "hmacApp-security";
export const STORAGE_LOGGEDIN_USER = "nextLoggeduser";
// cookie name
export const CSRF_CLAIM_HEADER = "_crsf";

export const defaultSeparator = "/";
export const odataUtentiPath = "/Utentes";
export const odataTipiProcedimentoPath = "/TipoProcedimentos";
export const odataCompanyPath = "/Aziendas";
export const odataAziendeTipiProcPath = "/AziendaTipoProcedimentos";
export const odataStrutturePath = "/Strutturas";

// ======================= ENUM ========================================
// export const afferenzaStruttura = {
//     diretta: "diretta",
//     funzionale: "funzionale"
// };

// Azienda: Entity = new Azienda(),
//     Utente: Entity = new Utente(),
//     Struttura: Entity = new Struttura(),
//     UtenteStruttura: Entity = new UtenteStruttura(),
//     AfferenzaStruttura: Entity = new AfferenzaStruttura(),
//     TipoProcedimento: Entity = new TipoProcedimento(),
//     Ruolo: Entity = new Ruolo(),
//     AziendaTipoProcedimento: Entity = new AziendaTipoProcedimento(),
//     Titolo: Entity = new Titolo(),
//     Procedimento: Entity = new Procedimento(),
//     Iter: Entity = new Iter(),
//     Fase: Entity = new Fase(),
//     FaseIter: Entity = new FaseIter(),
//     Evento: Entity = new Evento(),
//     EventoIter: Entity = new EventoIter(),
//     ProcedimentoCache: Entity = new ProcedimentoCache(),
//     DocumentoIter: Entity = new DocumentoIter(),

// export const Entities: ServerObjectsDescriptor = {
    // Azienda: azienda,
    // Utente:  new Utente(),
    // Struttura: new Struttura(),
    // UtenteStruttura: new UtenteStruttura(),
    // AfferenzaStruttura: new AfferenzaStruttura(),
    // TipoProcedimento: new TipoProcedimento(),
    // Ruolo: new Ruolo(),
    // AziendaTipoProcedimento: new AziendaTipoProcedimento(),
    // Titolo: new Titolo(),
    // Procedimento: new Procedimento(),
    // Iter: new Iter(),
    // Fase: new Fase(),
    // FaseIter: new FaseIter(),
    // Evento: new Evento(),
    // EventoIter: new EventoIter(),
    // ProcedimentoCache:  new ProcedimentoCache(),
    // DocumentoIter: new DocumentoIter()
// };

// export const FunctionsImport: ServerObjectsDescriptor = {
//     GetStruttureByTipoProcedimento: new GetStruttureByTipoProcedimento()
// };






