import {Azienda} from './azienda';
import {Ruolo} from './ruolo';
import {Entities} from '../../../../environments/app.constants';
import {Entity} from '@bds/nt-angular-context/entity';
import {OdataForeignKey} from '@bds/nt-angular-context/server-object';

export class Persona extends Entity {
  id: number;
  attiva: boolean;
  codiceFiscale: string;
  codiceStruttura: string;
  cognome: string;
  nome: string;
  descrizione: string;
  bitRuoli: number;

  public static getOdataContextEntity(): any {
    return {
      key: 'id',
      keyType: 'Int32',
      fieldTypes: {
        id: 'Int32',
        cognome: 'String',
        nome: 'String',
        attiva: 'Boolean',
        codiceFiscale: 'String',
        descrizione: 'String',
        bitRuoli: 'Int32'
      }
    }
  }
}
