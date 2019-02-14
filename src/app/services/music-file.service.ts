import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { TrackDetail } from './../models/track-detail.model';

@Injectable({
    providedIn: 'root'
})
export class MusicFileService {
    public tracks: Subject<TrackDetail> = new Subject<TrackDetail>();;

    constructor(private storage: Storage, private transfer: FileTransfer) { }

    public getAllTracks() {
        let promise = new Promise((resolve, reject) => {
            let tracks: TrackDetail[] = [];

            this.storage.forEach((value, key, index) => {
                tracks.push(value);
            });

            resolve(tracks);
        });

        return promise;
    }

    public getTrack(id: string) {
        let promise = new Promise((resolve, reject) => {
            this.storage.get(id).then((track) => {
                if (track) {
                    resolve(track);
                } else {
                    reject();
                }
            });
        });

        return promise;
    }

    public addTrack(track: TrackDetail) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const url = environment.WS_URL + "/downloads/" + track.id;

        let promise = new Promise((resolve, reject) => {
            fileTransfer.download(url, File.dataDirectory + track.id + '.mp3').then((entry) => {
                this.storage.set(track.id, track);
                this.tracks.next(track);
                resolve();
            }, (error) => {
                reject(error);
            });
        });

        return promise;
    }
}
