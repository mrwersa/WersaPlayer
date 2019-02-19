import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeDownloadService {

  constructor(private websocketService: WebsocketService) {
    this.websocketService.connect();
  }

  public downloadVideo(videoId: string) {
    this.websocketService.sendMessage('download', videoId);
  }

  public onMessage(): Observable<Object> {
    return this.websocketService.onMessage();
  }
}
