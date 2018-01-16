
import { Ruoli, BIT_RUOLI } from "../../environments/app.constants"

export class LoggedUser {

    private userInfoMap: Object;
    private _isMOBS: boolean;

    /*    private isUS: boolean;
        private isMOBS: boolean;
        private isOBS: boolean;
        private isADM: boolean;
        private isSUPERADM: boolean;*/

    constructor(userInfoMap: Object) {
        this.userInfoMap = userInfoMap;
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
            if((bit_ruoli & maschera) > 0){
                arrayRuoli.push(Ruoli[ruolo])
            }
        }
        return arrayRuoli;
    }



    public get isMOBS(): boolean{
        return this._isMOBS;
    }

}