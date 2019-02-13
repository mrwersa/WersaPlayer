import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavController, NavParams, IonToolbar, IonContent, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET } from '../providers/store.service';
import { AudioService } from '../services/audio.service';
import { FormControl } from '@angular/forms';

import { MusicFileService } from '../services/music-file.service';
import { TrackDetail } from './../models/track-detail.model';
import { File } from '@ionic-native/file';
import { pluck, filter, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-play',
    templateUrl: 'play.page.html',
    styleUrls: ['play.page.scss'],
    animations: [
        trigger('showHide', [
            state(
                'active',
                style({
                    opacity: 1
                })
            ),
            state(
                'inactive',
                style({
                    opacity: 0
                })
            ),
            transition('inactive => active', animate('250ms ease-in')),
            transition('active => inactive', animate('250ms ease-out'))
        ])
    ]
})
export class PlayPage {
    tracks: any = [];
    seekbar: FormControl = new FormControl("seekbar");
    state: any = {};
    onSeekState: boolean;
    currentTrack: any = {};
    displayFooter: string = "inactive";
    loggedIn: Boolean;
    @ViewChild(IonToolbar) toolBar: IonToolbar;
    @ViewChild(IonContent) content: IonContent;

    constructor(
        private musicFileService: MusicFileService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public audioService: AudioService,
        public loadingCtrl: LoadingController,
        private store: Store<any>
    ) {
        let loader = this.presentLoading();
        this.musicFileService.getAllTracs().then(
            (tracks: TrackDetail[]) => {
                this.tracks = tracks;
                this.loadingCtrl.dismiss('tracks');
            }
        )

        this.musicFileService.tracks.subscribe((track: TrackDetail) => {
            this.tracks.push(track);
        });
    }

    async presentLoading() {
        let loading = await this.loadingCtrl.create({
            message: 'Loading Content. Please Wait...',
            id: 'tracks'
        });
        return await loading.present();
    }

    ionViewWillLoad() {
        this.store.select('appState').subscribe((value: any) => {
            this.state = value.media;
        });

        // Resize the Content Screen so that Ionic is aware of footer
        this.store
            .select('appState')
            .pipe(pluck('media', 'canplay'), filter(value => value === true))
            .subscribe(() => {
                this.displayFooter = 'active';
            });

        // Updating the Seekbar based on currentTime
        this.store
            .select('appState')
            .pipe(
                pluck('media', 'timeSec'),
                filter(value => value !== undefined),
                map((value: any) => Number.parseInt(value)),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                this.seekbar.setValue(value);
            });
    }

    openTrack(track, index) {
        this.currentTrack = { index, track };
        let url = File.dataDirectory + track.id + '.mp3';
        this.playStream(track.id);
    }

    resetState() {
        this.audioService.stop();
        this.store.dispatch({ type: RESET });
    }

    playStream(url) {
        this.resetState();
        this.audioService.playStream(url).subscribe(event => {
            const audioObj = event.target;

            switch (event.type) {
                case 'canplay':
                    return this.store.dispatch({ type: CANPLAY, payload: { value: true } });

                case 'loadedmetadata':
                    return this.store.dispatch({
                        type: LOADEDMETADATA,
                        payload: {
                            value: true,
                            data: {
                                time: this.audioService.formatTime(
                                    audioObj.duration * 1000,
                                    'HH:mm:ss'
                                ),
                                timeSec: audioObj.duration,
                                mediaType: 'mp3'
                            }
                        }
                    });

                case 'playing':
                    return this.store.dispatch({ type: PLAYING, payload: { value: true } });

                case 'pause':
                    return this.store.dispatch({ type: PLAYING, payload: { value: false } });

                case 'timeupdate':
                    return this.store.dispatch({
                        type: TIMEUPDATE,
                        payload: {
                            timeSec: audioObj.currentTime,
                            time: this.audioService.formatTime(
                                audioObj.currentTime * 1000,
                                'HH:mm:ss'
                            )
                        }
                    });

                case 'loadstart':
                    return this.store.dispatch({ type: LOADSTART, payload: { value: true } });
            }
        });
    }

    pause() {
        this.audioService.pause();
    }

    play() {
        this.audioService.play();
    }

    stop() {
        this.audioService.stop();
    }

    next() {
        let index = this.currentTrack.index + 1;
        let file = this.tracks[index];
        this.openTrack(file, index);
    }

    previous() {
        let index = this.currentTrack.index - 1;
        let file = this.tracks[index];
        this.openTrack(file, index);
    }

    isFirstPlaying() {
        return this.currentTrack.index === 0;
    }

    isLastPlaying() {
        return this.currentTrack.index === this.tracks.length - 1;
    }

    onSeekStart() {
        this.onSeekState = this.state.playing;
        if (this.onSeekState) {
            this.pause();
        }
    }

    onSeekEnd(event) {
        if (this.onSeekState) {
            this.audioService.seekTo(event.value);
            this.play();
        } else {
            this.audioService.seekTo(event.value);
        }
    }

    reset() {
        this.resetState();
        this.currentTrack = {};
        this.displayFooter = "inactive";
    }

}
