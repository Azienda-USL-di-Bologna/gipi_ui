import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Data } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { GlobalContextService } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";
import { bUtente, bRuolo } from "@bds/nt-entities";


@Injectable()
export class RoleGuard implements CanActivate {

    private loggedUser: LoggedUser;     // lo leggo dal loggedUser dello SharedObject
    private ruoliConcessi: string[];    // i ruoli concessi li leggo nel parametro ruoliConcessi nella proprietà data del Router.

    constructor(private router: Router, private globalContextService: GlobalContextService) {
        this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser"); 
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        
        // confronto il nomeBreve dei ruoli dell'utente con i ruoli concessi passati nel parametro ruoliConcessi: se fanno match, restituisco true
        this.ruoliConcessi = next.data.ruoliConcessi;
        let ruoliUtente = this.loggedUser.getField(bUtente.ruoli);
       
        for (let i = 0; i < this.ruoliConcessi.length; i++) {
            const rc = this.ruoliConcessi[i];
            for (let j = 0; j < ruoliUtente.length; j++) {
                const ru = ruoliUtente[j][bRuolo.nomeBreve];
                if (ru === rc) {
                    return true;
                }                
            }
        }       
        return false;
    }
}
