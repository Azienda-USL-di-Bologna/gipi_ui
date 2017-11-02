export const Entities = {
  Azienda: "Aziendas",
  Utente: "Utentes",
  Struttura: "Strutturas",
  UtenteStruttura: "UtenteStrutturas",
  AfferenzaStruttura: "AfferenzaStrutturas",
  TipoProcedimento: "TipoProcedimentos",
  Ruolo: "Ruolos",
  AziendaTipoProcedimento: "AziendaTipoProcedimentos",
  Titolo: "Titolos"
};

export class OdataForeignKey {
  private targetEntity: string;
  private keyName: string;

  constructor(targetEntity: string, keyName: string) {
    this.targetEntity = targetEntity;
    this.keyName = keyName;
  }

  public getTargetEntity(): string {
    return this.targetEntity;
  }

  public getKeyName(): string {
    return this.keyName;
  }
}

export class ContextUtils {
}
