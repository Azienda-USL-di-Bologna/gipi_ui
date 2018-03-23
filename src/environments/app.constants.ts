// header http
export const HEADER_AUTH_TOKEN_NAME = "authorization";

// ========================= Url =====================================
// export const ODATA_BASE_URL: string = environment.odataStoreRootUrl;
const hostname: string = window.location.hostname;
export const LOCALHOST_PORT: string = "10006";
const port: string = hostname === "localhost" ? ":" + LOCALHOST_PORT : ":443";
console.log("hostname", hostname);
console.log("port", port);

export const ODATA_BASE_RELATIVE_URL: string = "/gipi-api/resources/odata.svc";
export const ODATA_BASE_URL: string = window.location.protocol + "//" + hostname + port + ODATA_BASE_RELATIVE_URL;
export const CUSTOM_RESOURCES_RELATIVE_URL: string = "/gipi-api/resources/custom/";
export const CUSTOM_RESOURCES_BASE_URL: string = window.location.protocol + "//" + hostname + port + CUSTOM_RESOURCES_RELATIVE_URL;


// login
export const LOGOUT_RELATIVE_URL: string = "/Shibboleth.sso/Logout";
export const LOGOUT_URL = window.location.protocol + "//" + hostname + port + LOGOUT_RELATIVE_URL;
export const LOGIN_RELATIVE_URL: string = "/gipi-api/user/login/";
export const LOGIN_URL: string = window.location.protocol + "//" + hostname + port + LOGIN_RELATIVE_URL;

export const LOGIN_ROUTE: string = "/login";
export const HOME_ROUTE: string = "/home";



console.log("ODATA_BASE_URL", ODATA_BASE_URL);
console.log("CUSTOM_RESOURCES_BASE_URL", CUSTOM_RESOURCES_BASE_URL);
console.log("LOGIN_URL", LOGIN_URL);
console.log("1", window.location.protocol + "//" + hostname + port + "/gipi-api/resources/odata.svc");
console.log("2", window.location.protocol + "//" + hostname + "/gipi-api/resources/odata.svc");

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

// =====================GlobalContextServiceData================================


// ======================= ENUM ========================================







