import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class WebsocketService {

    private socket;

    constructor() { }

    connect(): void {
        this.socket = io(environment.WS_URL);
    }

    public sendMessage(type: string, message: Object): void {
        this.socket.emit(type, message);
    }

    public onMessage(): Observable<Object> {
        return new Observable<Object>(observer => {
            this.socket.on('download-finished', (data) => {
                observer.next({ type: 'download-finished', data: data });
            });
            this.socket.on('download-error', (data) => {
                observer.next({ type: 'download-error', data: data });
            });
            this.socket.on('download-progress', (data) => {
                observer.next({ type: 'download-progress', data: data });
            });
            this.socket.on('download-status', (data) => {
                observer.next({ type: 'download-status', data: data });
            });

            return () => {
                this.socket.disconnect();
            };
        });
    }

}
