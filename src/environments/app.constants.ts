import {environment} from "./environment";
import {Azienda} from "../app/classi/server-objects/entities/azienda";
import {Utente} from "../app/classi/server-objects/entities/utente";
import {Struttura} from "../app/classi/server-objects/entities/struttura";
import {UtenteStruttura} from "../app/classi/server-objects/entities/utente-struttura";
import {AfferenzaStruttura} from "../app/classi/server-objects/entities/afferenza-struttura";
import {TipoProcedimento} from "../app/classi/server-objects/entities/tipo-procedimento";
import {Ruolo} from "../app/classi/server-objects/entities/ruolo";
import {AziendaTipoProcedimento} from "../app/classi/server-objects/entities/azienda-tipo-procedimento";
import {Titolo} from "../app/classi/server-objects/entities/titolo";
import {ServerObjectsDescriptor} from "@bds/nt-angular-context/context-module-config";
import {Procedimento} from "../app/classi/server-objects/entities/procedimento";
import {GetStruttureByTipoProcedimento} from "../app/classi/server-objects/functions-import/get-strutture-by-tipo-procedimento";
import { EventoIter } from "../app/classi/server-objects/entities/evento-iter";
import { Iter } from "../app/classi/server-objects/entities/iter";
import { Evento } from "../app/classi/server-objects/entities/evento";
import { Fase } from "../app/classi/server-objects/entities/fase";
import { FaseIter } from "../app/classi/server-objects/entities/fase-iter";
import { ProcedimentoCache } from "../app/classi/server-objects/entities/procedimento-cache";
import { DocumentoIter } from "app/classi/server-objects/entities/documento-iter";

export const Entities: ServerObjectsDescriptor = {
    Azienda: {name: "Aziendas", class: Azienda},
    Utente: {name: "Utentes", class: Utente},
    Struttura: {name: "Strutturas", class: Struttura},
    UtenteStruttura: {name: "UtenteStrutturas", class: UtenteStruttura},
    AfferenzaStruttura: {name: "AfferenzaStrutturas", class: AfferenzaStruttura},
    TipoProcedimento: {name: "TipoProcedimentos", class: TipoProcedimento},
    Ruolo: {name: "Ruolos", class: Ruolo},
    AziendaTipoProcedimento: {name: "AziendaTipoProcedimentos", class: AziendaTipoProcedimento},
    Titolo: {name: "Titolos", class: Titolo},
    Procedimento: {name: "Procedimentos", class: Procedimento},
    Iter: {name: "Iters", class: Iter},
    Fase: {name: "Fases", class: Fase},
    FaseIter: {name: "FaseIters", class: FaseIter},
    Evento: {name: "Eventos", class: Evento},
    EventoIter: {name: "EventoIters", class: EventoIter},
    ProcedimentoCache: {name: "ProcedimentoCaches", class: ProcedimentoCache},
    DocumentoIter: {name: "DocumentoIters", class: DocumentoIter}
};

export const FunctionsImport: ServerObjectsDescriptor = {
    GetStruttureByTipoProcedimento: {name: "GetStruttureByTipoProcedimento", class: GetStruttureByTipoProcedimento},
};

// header http
export const HEADER_AUTH_TOKEN_NAME = "authorization";

// ========================= Url =====================================
// export const ODATA_BASE_URL: string = environment.odataStoreRootUrl;
const hostname: string = window.location.hostname;
const port: string = hostname === "localhost" ? ":10006" : ":443";
console.log("hostname", hostname);
console.log("port", port);

export const ODATA_BASE_URL: string = window.location.protocol + "//" + hostname + port + "/gipi/resources/odata.svc";
export const CUSTOM_RESOURCES_BASE_URL: string = window.location.protocol + "//" + hostname + port + "/gipi/resources/custom/";


// login
export const LOGOUT_URL = "/logout";
export const LOGIN_URL: string = window.location.protocol + "//" + hostname + port + "/gipi/user/login/";

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
export const afferenzaStruttura = {
    diretta: "diretta",
    funzionale: "funzionale"
};

export enum Ruoli {US,MOBS,OBS,ADM,SUPERADM};

export const BIT_RUOLI = {"US":1,"MOBS":2,"OBS":4,"ADM":8,"SUPERADM":16};






