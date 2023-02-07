import { TestBed } from '@angular/core/testing';

import { CnoteService } from './cnote.service';

describe('CnoteService', () => {
  let service: CnoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CnoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
