import { TestBed } from '@angular/core/testing';

import { MusicPlayService } from './music-play.service';

describe('MusicPlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicPlayService = TestBed.get(MusicPlayService);
    expect(service).toBeTruthy();
  });
});
