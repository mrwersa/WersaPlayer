import { TestBed } from '@angular/core/testing';

import { MusicFileService } from './music-file.service';

describe('MusicFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicFileService = TestBed.get(MusicFileService);
    expect(service).toBeTruthy();
  });
});
