
import { Ruoli } from "../../environments/app.constants"
import { Ruolo } from "../classi/server-objects/entities/ruolo";
import { Azienda } from "../classi/server-objects/entities/azienda";
import { UtenteStruttura } from "../classi/server-objects/entities/utente-struttura";

export class LoggedUser {

    private userInfoMap: Object;

    private _idUtente : number;
    private _username: string;
    private _aziendaLogin: Azienda;
    private _strutture: UtenteStruttura[];
    
    private _ruoli: Ruolo[];

    private _isUG: boolean;
    private _isMOS: boolean;
    private _isOS: boolean;
    private _isCA: boolean;
    private _isCI: boolean;
    private _isAS: boolean;
    private _isSD: boolean;



    constructor(userInfoMap: Object) {


        this.userInfoMap = userInfoMap;
        this._idUtente = this.userInfoMap["idUtente"];
        this._username = this.userInfoMap["username"];
        this._aziendaLogin = this.userInfoMap["aziendaLogin"];
        this._strutture = this.userInfoMap["strutture"];
        this._ruoli = this.userInfoMap["ruoli"];
    }


    public get idUtente(){
        return this._idUtente;
    }

    public get username(){
        return this._username;
    }

    public get aziendaLogin(){
        return this._aziendaLogin;
    }

    public get strutture(){
        return this._strutture;
    }

    public get ruoli(){
        return this._ruoli;
    }



    public get isUG(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.UG]);
        return (trovato != undefined);
    }

    public get isMOS(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.MOS]);
        return (trovato != undefined);
    }

    public get isOS(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.OS]);
        return (trovato != undefined);
    }

    public get isCA(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.CA]);
        return (trovato != undefined);
    }

    public get isCI(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.CI]);
        return (trovato != undefined);
    }

    public get isAS(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.AS]);
        return (trovato != undefined);
    }

    public get isSD(): boolean {
        let trovato: Ruolo = this._ruoli.find(ruolo => ruolo.nomeBreve == Ruoli[Ruoli.SD]);
        return (trovato != undefined);
    }



}