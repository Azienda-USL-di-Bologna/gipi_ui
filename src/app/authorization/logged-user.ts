
import { Ruoli, BIT_RUOLI } from "../../environments/app.constants"

export class LoggedUser {

    private userInfoMap: Object;
    private _isMOBS: boolean;
    private _username: string;
    private _azienda: string;

    /*    private isUS: boolean;
        private isMOBS: boolean;
        private isOBS: boolean;
        private isADM: boolean;
        private isSUPERADM: boolean;*/

    constructor(userInfoMap: Object) {

        //debugger;
        this.userInfoMap = userInfoMap;
        this._username=userInfoMap["username"];
        this._azienda=userInfoMap["aziende"]["nome"];

/*
        this.isUS;
        this.isMOBS;
        this.isOBS;
        this.isADM;
        this.isSUPERADM;
        */
    }

    public hasRole(ruolo: Ruoli): boolean {


        let bit_ruoli = this.userInfoMap["bit_ruoli"];
        let maschera:number = BIT_RUOLI[Ruoli[ruolo]];

        return (bit_ruoli & maschera) > 0;
    }

    public getRuoli(): string[]{
        let bit_ruoli = this.userInfoMap["bit_ruoli"];
        let arrayRuoli: string[]= new Array();

        for(let ruolo in Ruoli){

            let maschera:number = BIT_RUOLI[Ruoli[ruolo]];
            if((bit_ruoli & maschera) > 0) {
                arrayRuoli.push(Ruoli[ruolo])
            }
        }
        return arrayRuoli;
    }

    public get username(): string {
        return this._username;
    }

    public get azienda(): string {
        return this._azienda;
    }
    public get isMOBS(): boolean {
        return this._isMOBS;
    }

}