import {forEach} from "@angular/router/src/utils/collection";
import {Router} from "@angular/router";
import {Component} from "@angular/core/core";

export class UtilityFunctions {

    isDataBiggerOrEqual(data1: Date, data2: Date): boolean {

        if (data1 == null || data2 == null)
            return false;

        if (data1.getFullYear() > data2.getFullYear())
            return true;
        else if (data1.getFullYear() < data2.getFullYear())
            return false;
        else {
            if (data1.getMonth() > data2.getMonth())
                return true;
            else if (data1.getMonth() < data2.getMonth())
                return false;
            else {
                if (data1.getDate() >= data2.getDate())
                    return true;
                else
                    return false;
            }
        }
    }

    /**
     * costruisce un array di filtri(da usare nel DataSource) sul campo (field) concatenando i valori (values) in "or"
     * @param {string} field il campo sul quale applicare i filtri
     * @param values i valori
     * @returns {any} l'array da usare nel DataSource
     */
    public buildMultipleFilterForArray(field: string, values: any): any {
        let array: any = [];

        array.push([field, "=", values.pop()]);

        values.forEach(function (e) {
            array.push("or");
            array.push([field, "=", e]);
        });

        return array;
    }



    /**
     * Riceve in input una data Date e restituisce una stringa in formato dd/mm/yyyy
     * @param date 
     */
    public static formatDateToString(date: Date): string {
        let dd = date.getDate(); 
        let mm = date.getMonth() + 1; 
        let yyyy = date.getFullYear();
        let dds = (dd < 10) ? "0" + dd : dd; 
        let mms = (mm < 10) ? "0" + mm : mm;
        return dds + "/" + mms + "/" + yyyy;
    }

    /**
     * Estrare un componente dalla configurazione del router cercandolo tramite un url
     * @param {Router} router
     * @param {string} url l'url tramite il quale estrarre il componente (non c'è bisogno di ripulirlo dai query params)
     * @returns {Component}
     */
    public static getComponentFromRouterConfig(router: Router, url: string): Component {
        const path: string = UtilityFunctions.clearUrl(url);
        let route: any = router.config.filter(s => s.path === path)[0];
        return route.component;
    }

    /**
     * Ripulisce un url dai query params e dalla barra iniziale (da utilizzare sugli url catturati dagli eventi di routing)
     * @param {string} url
     * @returns {String}
     */
    public static clearUrl(url: string): string {
        let pos: number = url.indexOf("?");
        if (pos <= 0 )
            pos = url.length;
        const path: string = url.substring(1, pos);
        return path;
    }
}