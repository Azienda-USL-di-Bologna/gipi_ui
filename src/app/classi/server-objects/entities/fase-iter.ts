/*
import {Fase} from "./fase";
import {Iter} from "./fase";
*/
import {Entity} from "@bds/nt-angular-context/entity";
export class FaseIter extends Entity {
    idFaseIter: number;
    idIter: number;
    idFase: number;
    data_inizio_fase: Date;
    data_fine_fase: Date;


    public static getOdataContextEntity(): any {
        return {
            key:'idFaseIter',
            keyType: 'Int32',
            fieldsTypes: {
                idFaseIter: 'Int32',
                idFase: 'Int32',
                idIter: 'Int32',
                data_inizio_fase: 'DateTime',
                data_fine_fase: 'DateTime'
            }
        }
    }
}