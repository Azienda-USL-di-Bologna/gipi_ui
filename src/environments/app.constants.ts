import {environment} from './environment';
import {Azienda} from '../app/classi/server-objects/entities/azienda';
import {Utente} from '../app/classi/server-objects/entities/utente';
import {Struttura} from '../app/classi/server-objects/entities/struttura';
import {UtenteStruttura} from '../app/classi/server-objects/entities/utente-struttura';
import {AfferenzaStruttura} from '../app/classi/server-objects/entities/afferenza-struttura';
import {TipoProcedimento} from '../app/classi/server-objects/entities/tipo-procedimento';
import {Ruolo} from '../app/classi/server-objects/entities/ruolo';
import {AziendaTipoProcedimento} from '../app/classi/server-objects/entities/azienda-tipo-procedimento';
import {Titolo} from '../app/classi/server-objects/entities/titolo';
import {ServerObjectsDescriptor} from '@bds/nt-angular-context/context-module-config';
import {Procedimento} from '../app/classi/server-objects/entities/procedimento';
import {GetStruttureByTipoProcedimento} from "../app/classi/server-objects/functions-import/get-strutture-by-tipo-procedimento";

export const Entities: ServerObjectsDescriptor = {
    Azienda: {name: 'Aziendas', class: Azienda},
    Utente: {name: 'Utentes', class: Utente},
    Struttura: {name: 'Strutturas', class: Struttura},
    UtenteStruttura: {name: 'UtenteStrutturas', class: UtenteStruttura},
    AfferenzaStruttura: {name: 'AfferenzaStrutturas', class: AfferenzaStruttura},
    TipoProcedimento: {name: 'TipoProcedimentos', class: TipoProcedimento},
    Ruolo: {name: 'Ruolos', class: Ruolo},
    AziendaTipoProcedimento: {name: 'AziendaTipoProcedimentos', class: AziendaTipoProcedimento},
    Titolo: {name: "Titolos", class: Titolo},
    Procedimento: {name: "Procedimentos", class: Procedimento}
}

export const FunctionsImport: ServerObjectsDescriptor = {
    GetStruttureByTipoProcedimento: {name: "GetStruttureByTipoProcedimento", class: GetStruttureByTipoProcedimento}
}

// header http
export const HEADER_AUTH_TOKEN_NAME = "authorization";

// ========================= Url =====================================
export const ODATA_BASE_URL: string = environment.odataStoreRootUrl;
// login
export const LOGIN_URL: string = environment.loginUrl;
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
export const odataStrutturePath = '/Strutturas';
