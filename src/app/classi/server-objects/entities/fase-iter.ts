/*
import {Fase} from "./fase";
import {Iter} from "./iter";
*/
import {Entity} from "@bds/nt-angular-context/entity";
import { Iter } from "app/classi/server-objects/entities/iter";
import { Fase } from "app/classi/server-objects/entities/fase";
export class FaseIter extends Entity {
    idFaseIter: number;
    FK_id_iter: number;
    idIter: Iter;
    FK_id_fase: number;
    idFase: Fase;
    dataInizioFase: Date;
    dataFineFase: Date;


    public static getOdataContextEntity(): any {
        return {
            key:'idFaseIter',
            keyTypes: 'Int32',
            fieldsTypes: {
                idFaseIter: 'Int32',
                idFase: 'Int32',
                idIter: 'Int32',
                dataInizioFase: 'DateTime',
                dataFineFase: 'DateTime'
            }
        }
    }
}