export class SospensioneParams {
    public idIter: number;
    public numeroIter: number;
    public annoIter: number;
    public idUtente: number;
    public codiceRegistroDocumento: string;
    public numeroDocumento: string;
    public annoDocumento: number;
    public oggettoDocumento: string;
    public dataRegistrazioneDocumento: Date;
    public note: string;
    public codiceStatoCorrente: string;
    public codiceStatoProssimo: string;
    public dataCambioDiStato: Date;
    public isFaseDiChiusura: boolean;
    public esito: string;
    public esitoMotivazione: string;
    public azione: string; // Passaggio di fase o Cambio di stato
    public idOggettoOrigine: string;
    public dataAvvioIter: Date; 
    public glogParams: string;
  }