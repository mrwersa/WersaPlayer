import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { Subject } from 'rxjs';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Store } from '@ngrx/store';

import { LOADEDMETADATA, PLAYING, TIMEUPDATE, RESET } from './store.provider';
import { environment } from '../../environments/environment';
import { TrackDetail } from '../models/track-detail.model';

import * as moment from 'moment';


@Injectable({
    providedIn: 'root'
})
export class AudioFileService {
    tracks: Subject<TrackDetail> = new Subject<TrackDetail>();
    progress: Subject<number> = new Subject<number>();
    private mediaObject: MediaObject;

    constructor(private storage: Storage, private transfer: FileTransfer, private media: Media, private store: Store<any>) {
        this.storage.forEach((value, key, index) => {
            this.tracks.next(value);
        });

        // dispatch track progress every one second
        setInterval(function () {
            if (this.mediaObject) {
                this.mediaObject.getCurrentPosition().then((curpos) => {
                    this.store.dispatch({
                        type: TIMEUPDATE,
                        payload: {
                            timeSec: curpos,
                            time: this.formatTime(
                                curpos * 1000,
                                'mm:ss'
                            )
                        }
                    });
                });
            }
        }, 1000);
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
        const url = environment.WS_URL + '/downloads/' + track.id;

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

    public openTrack(track: TrackDetail) {
        this.resetTrack();

        const path = File.dataDirectory.replace(/^file:\/\//, '') + track.id + '.mp3';
        this.mediaObject = this.media.create(path);
        let duration = this.mediaObject.getDuration();

        let counter = 0;
        let timerDur = setInterval(function () {
            counter = counter + 100;
            if (counter > 2000) {
                clearInterval(timerDur);
                this.store.dispatch({
                    type: LOADEDMETADATA,
                    payload: {
                        value: false,
                    }
                });
            }
            let dur = this.mediaObject.getDuration();
            if (dur > 0) {
                clearInterval(timerDur);
                this.store.dispatch({
                    type: LOADEDMETADATA,
                    payload: {
                        value: true,
                        data: {
                            time: this.formatTime(
                                duration * 1000,
                                'mm:ss'
                            ),
                            timeSec: duration,
                            mediaType: 'mp3'
                        }
                    }
                });
            }
        }, 100);
    }

    public playTrack() {
        if (this.mediaObject) {
            this.mediaObject.play({
                numberOfLoops: 2,
                playAudioWhenScreenIsLocked: false
            });
            this.store.dispatch({ type: PLAYING, payload: { value: true } });
        }
    }

    public pauseTrack() {
        if (this.mediaObject) {
            this.mediaObject.pause();
            this.store.dispatch({ type: PLAYING, payload: { value: false } });
        }
    }

    public stopTrack() {
        if (this.mediaObject) {
            this.mediaObject.stop();
        }
    }

    public seekTo(position) {
        this.mediaObject.seekTo(position);
    }

    public resetTrack() {
        if (this.mediaObject) {
            this.mediaObject.stop();
            this.mediaObject.release();
            this.store.dispatch({ type: RESET });
        }
    }

    private formatTime(time, format) {
        return moment.utc(time).format(format);
    }

    private getDurationSec(duration) {
        return moment.duration(duration).asSeconds();
    }
}
