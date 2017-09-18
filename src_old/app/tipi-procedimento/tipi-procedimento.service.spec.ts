import { TestBed, inject } from '@angular/core/testing';

import { TipiProcedimentoService } from './tipi-procedimento.service';

describe('TipiProcedimentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipiProcedimentoService]
    });
  });

  it('should be created', inject([TipiProcedimentoService], (service: TipiProcedimentoService) => {
    expect(service).toBeTruthy();
  }));
});
