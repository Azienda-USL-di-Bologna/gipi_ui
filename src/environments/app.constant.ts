import {environment} from './environment';

// header http
export const HEADER_AUTH_TOKEN_NAME = 'authorization';

// ========================= Url =====================================
export const ODATA_STORE_ROOT_URL: string = environment.odataStoreRootUrl;
// login
export const LOGIN_URL = '/auth/login';
export const LOGOUT_URL = '/logout';


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
