export class Azienda {
  readonly codice: string;
  readonly descrizione: string;

  constructor(codice : string, descrizione: string){
    this.codice = codice;
    this.descrizione = descrizione;
  }
}

export var AZIENDE : Azienda[]=[
  new Azienda('AUSLBO', 'Azienda Unità Sanitaria Locale di Bologna'),
  new Azienda('AOSPBO', 'Azienda Ospedaliero-Universitaria di Bologna'),
  new Azienda('IOR', 'Istituto Ortopedico Rizzoli'),
  new Azienda('AUSLIMOLA', 'Azienda Unità Sanitaria Locale di Imola'),
  new Azienda('AOSPFE', 'Azienda Ospedaliero-Universitaria di Ferrara'),
  new Azienda('AUSLFE', 'Azienda Unità Sanitaria Locale di Ferrara'),
  new Azienda('AUSLPARMA', 'Azienda Unità Sanitaria Locale di Parma')
];
