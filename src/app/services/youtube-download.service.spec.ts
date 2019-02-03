import { TestBed } from '@angular/core/testing';

import { YoutubeDownloadService } from './youtube-download.service';

describe('YoutubeDownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YoutubeDownloadService = TestBed.get(YoutubeDownloadService);
    expect(service).toBeTruthy();
  });
});
