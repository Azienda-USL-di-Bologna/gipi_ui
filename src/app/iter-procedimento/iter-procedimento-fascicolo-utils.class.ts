import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpHeaders } from "@angular/common/http";

export class IterProcedimentoFascicoloUtilsClass {
    
  public static getFascicoloIter(http, numerazioneGerarchica): any {
    if (numerazioneGerarchica) {
      /* let data = new Map<String, Object>();
      data.set("numerazioneGerarchica", numerazioneGerarchica); */
      return http.post(
        CUSTOM_RESOURCES_BASE_URL + "iter/getFascicoloConPermessi", 
        numerazioneGerarchica, 
        { headers: new HttpHeaders().set("content-type", "application/json") }
      );
    } else {
      console.log("Sembra che l'iter non abbia l'idFascicolo. Questo non va bene.");
    }
  }

  public static calcolaArrayCfVicari(permessi): any {
    let vicari: string[] = [];

    for (let key in permessi) {
      if (permessi[key] === "VICARIO") {
        vicari.push(key);   
      }
    }

    return vicari;
  }

  /* public static dammiCfResponsabile(permessi): string {
    for (let key in permessi) {
      if (permessi[key] === "RESPONSABILE") {
        return key; 
      }
    }
    return "";
  } */
}

export enum PERMESSI {
  NON_PERMESSO = 0,
  VISUALIZZA = 1,
  MODIFICA = 2,
  CANCELLA = 3,
  VICARIO = 4,
  RESPONSABILE = 5
}