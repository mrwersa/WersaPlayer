import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeDownloadService {
  public downloads: Subject<any>;

  constructor(private websocketService: WebsocketService) {
    this.downloads = <Subject<any>>websocketService
      .connect()
      .pipe(map((response: any): any => {
        return response;
      }));
  }

  downloadVideo(videoId) {
    this.downloads.next(videoId);
  }
}
