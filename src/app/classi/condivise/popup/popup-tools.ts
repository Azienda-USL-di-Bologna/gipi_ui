export class PopupRow{
    public codice: string;
    public descrizione: string;
    public valore: string;

    constructor(codice?: string, descrizione?: string, valore?:string){
        this.codice = codice;
        this.descrizione = descrizione;
        this.valore = valore;
    }
}

export function buildFromKeysArray(keys: string[], obj:any): PopupRow[]{
    let result: PopupRow[] = [];
    for (let key of keys) {
        if(obj.hasOwnProperty(key)){
          if(obj[key] instanceof Date){
            result.push(new PopupRow(key, key, obj[key].toLocaleDateString()));
          }else{
            result.push(new PopupRow(key, key, obj[key]));
          }
        }
    }
    return result;
}