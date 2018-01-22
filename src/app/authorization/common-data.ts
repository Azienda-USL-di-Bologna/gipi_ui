import { Ruolo } from "../classi/server-objects/entities/ruolo";

export class CommonData {
    private _ruoli: Ruolo[];

    constructor() {
    }

    public set ruoli(ruoli: Ruolo[]) {
         this._ruoli = ruoli;
    }

    public get ruoli() {
        return this._ruoli;
    }
}
