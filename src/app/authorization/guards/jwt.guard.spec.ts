import { TestBed, async, inject } from '@angular/core/testing';

import { JwtGuard } from './jwt.guard';

describe('JwtGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtGuard]
    });
  });

  it('should ...', inject([JwtGuard], (guard: JwtGuard) => {
    expect(guard).toBeTruthy();
  }));
});
