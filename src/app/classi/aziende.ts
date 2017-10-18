export class Azienda {
  readonly id: number;
  readonly codice: string;
  readonly descrizione: string;

  constructor(id: number, codice : string, descrizione: string){
    this.id = id;
    this.codice = codice;
    this.descrizione = descrizione;
  }
}

export var AZIENDE : Azienda[]=[
  new Azienda(2, 'AUSLBO', 'Azienda Unità Sanitaria Locale di Bologna'),
  new Azienda(10,'AOSPBO', 'Azienda Ospedaliero-Universitaria di Bologna'),
  new Azienda(3, 'IOR', 'Istituto Ortopedico Rizzoli'),
  new Azienda(11,'AUSLIMOLA', 'Azienda Unità Sanitaria Locale di Imola'),
  new Azienda(12,'AOSPFE', 'Azienda Ospedaliero-Universitaria di Ferrara'),
  new Azienda(13,'AUSLFE', 'Azienda Unità Sanitaria Locale di Ferrara'),
  new Azienda(5, 'AUSLPARMA', 'Azienda Unità Sanitaria Locale di Parma')
];
