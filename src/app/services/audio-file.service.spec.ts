import { TestBed } from '@angular/core/testing';

import { AudioFileService } from './audio-file.service';

describe('AudioFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioFileService = TestBed.get(AudioFileService);
    expect(service).toBeTruthy();
  });
});
