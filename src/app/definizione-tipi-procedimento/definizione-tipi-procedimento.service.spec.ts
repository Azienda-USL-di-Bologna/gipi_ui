import { TestBed, inject } from '@angular/core/testing';

import { DefinizioneTipiProcedimentoService } from './definizione-tipi-procedimento.service';

describe('DefinizioneTipiProcedimentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefinizioneTipiProcedimentoService]
    });
  });

  it('should be created', inject([DefinizioneTipiProcedimentoService], (service: DefinizioneTipiProcedimentoService) => {
    expect(service).toBeTruthy();
  }));
});
