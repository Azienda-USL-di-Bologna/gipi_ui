import {environment} from './environment';
import {Azienda} from "../app/classi/entities/azienda";
import {Utente} from "../app/classi/entities/utente";
import {Struttura} from "../app/classi/entities/struttura";
import {UtenteStruttura} from "../app/classi/entities/utente-struttura";
import {AfferenzaStruttura} from "../app/classi/entities/afferenza-struttura";
import {TipoProcedimento} from "../app/classi/entities/tipo-procedimento";
import {Ruolo} from "../app/classi/entities/ruolo";
import {AziendaTipoProcedimento} from "../app/classi/entities/azienda-tipo-procedimento";
import {Titolo} from "../app/classi/entities/titolo";

export const Entities = {
    Azienda: {name: "Aziendas", class: Azienda},
    Utente: {name: "Utentes", class: Utente},
    Struttura: {name: "Strutturas", class: Struttura},
    UtenteStruttura: {name: "UtenteStrutturas", class: UtenteStruttura},
    AfferenzaStruttura: {name: "AfferenzaStrutturas", class: AfferenzaStruttura},
    TipoProcedimento: {name: "TipoProcedimentos", class: TipoProcedimento},
    Ruolo: {name: "Ruolos", class: Ruolo},
    AziendaTipoProcedimento: {name: "AziendaTipoProcedimentos", class: AziendaTipoProcedimento},
    Titolo: {name: "Titolos", class: Titolo}
};

// header http
export const HEADER_AUTH_TOKEN_NAME = 'authorization';

// ========================= Url =====================================
export const ODATA_BASE_URL: string = environment.odataStoreRootUrl;
// login
export const LOGIN_URL = '/auth/login';
export const LOGOUT_URL = '/logout';

export const DEFAULT_TIMEZONE_OFFSET = 0;
export const DEFAULT_CURRENCY = 'EUR';

// ======================= local save name ========================================
export const STORAGE_SECURITY_TOKEN = 'hmacApp-security';
export const STORAGE_LOGGEDIN_USER = 'nextLoggeduser';
// cookie name
export const CSRF_CLAIM_HEADER = '_crsf';

export const defaultSeparator = '/';
export const odataUtentiPath = '/Utentes';
export const odataTipiProcedimentoPath = '/TipoProcedimentos';
export const odataCompanyPath = '/Aziendas';
export const odataAziendeTipiProcPath = '/AziendaTipoProcedimentos';
