import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class WebsocketService {

  private socket;

  constructor() { }

  connect(): Subject<MessageEvent> {
    this.socket = io(environment.WS_URL);

    let observable = new Observable(observer => {
      this.socket.on('download-finished', (data) => {
        observer.next({ type: 'download-finished', data: data });
      })
      this.socket.on('download-error', (data) => {
        observer.next({ type: 'download-error', data: data });
      })
      this.socket.on('download-progress', (data) => {
        observer.next({ type: 'download-progress', data: data });
      })

      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (videoId: string) => {
        this.socket.emit('download', videoId);
      },
    };

    return Subject.create(observer, observable);
  }

}