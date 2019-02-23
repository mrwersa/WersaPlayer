import { Component, OnInit } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { Store } from '@ngrx/store';

import { AudioFileService } from '../services/audio-file.service';
import { TrackDetail } from './../models/track-detail.model';
import { pluck, filter, map, distinctUntilChanged } from 'rxjs/operators';
import { MusicControls } from '@ionic-native/music-controls/ngx';

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
export class PlayPage implements OnInit {
    tracks: TrackDetail[] = [];
    currentIndex = -1;
    seek = 0;
    state: any = {};
    displayFooter = 'inactive';
    searchTerm: String = '';

    constructor(
        private musicControls: MusicControls,
        private audioFileService: AudioFileService,
        private store: Store<any>
    ) { }

    ngOnInit() {
        // track listener
        this.audioFileService.tracks
            .pipe(
                filter(
                    (track: TrackDetail) =>
                        track.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1))
            .subscribe((track: TrackDetail) => {
                this.checkAndAddTrack(track);
            });

        this.store.select('mediaState').subscribe((value: any) => {
            this.state = value.media;
        });

        // stopped => next track
        this.store
            .select('mediaState')
            .pipe(
                pluck('media', 'stopped'),
                filter(value => value !== undefined),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                if (value) {
                    this.next();
                }
            });

        // wait for the metadata to load then show the footer
        this.store
            .select('mediaState')
            .pipe(
                pluck('media', 'loadedmetadata'),
                filter(value => value === true)
            )
            .subscribe(() => {
                // show footer (music player)
                this.displayFooter = 'active';
            });

        // wait to get duration then show music controls
        this.store
            .select('mediaState')
            .pipe(
                pluck('media', 'durationSec'),
                filter(value => value !== undefined),
                map((value: any) => Number.parseInt(value)),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                this.createMediaControls(this.tracks[this.currentIndex], value);
            });

        // Updating the Seekbar based on currentTime
        this.store
            .select('mediaState')
            .pipe(
                pluck('media', 'timeSec'),
                filter(value => value !== undefined),
                map((value: any) => Number.parseInt(value)),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                this.seek = value;
                this.musicControls.updateElapsed({
                    elapsed: value,
                    isPlaying: this.state.playing
                });
            });
    }

    openTrack(index) {
        this.currentIndex = index;
        if (index >= 0 && index < this.tracks.length) {
            this.audioFileService.openTrack(this.tracks[index]);
        } else {
            this.currentIndex = -1;
        }
    }

    pause() {
        this.audioFileService.pauseTrack();
    }

    play() {
        this.audioFileService.playTrack();
    }

    next() {
        if (this.isLastPlaying()) {
            this.openTrack(0);
        } else {
            this.openTrack(this.currentIndex + 1);
        }
    }

    previous() {
        if (this.isFirstPlaying()) {
            this.openTrack(this.tracks.length - 1);
        } else {
            this.openTrack(this.currentIndex - 1);
        }
    }

    isFirstPlaying() {
        return this.currentIndex === 0;
    }

    isLastPlaying() {
        return this.currentIndex === this.tracks.length - 1;
    }

    onSeek(event: any) {
        this.audioFileService.seekTo(event * 1000);
    }

    checkAndAddTrack(track: TrackDetail) {
        let found = this.tracks.some(function(t) {
            return t.id === track.id;
        });
        if (!found) { this.tracks.push(track); }
    }

    createMediaControls(track: TrackDetail, duration) {
        // create a music control for locked screen
        this.musicControls.create({
            track: track.title,
            // cover: this.tracks[this.currentIndex].thumbnailUrl,
            isPlaying: this.state.playing,
            dismissable: true,
            duration: duration,
            hasScrubbing: true,
            hasPrev: true,
            hasNext: true,
            ticker: 'Now playing "' + track.title + '"'
        });

        // music controls callbacks
        this.musicControls.subscribe().subscribe(action => {
            const message = JSON.parse(action).message;
            console.log(message);
            switch (message) {
                case 'music-controls-next':
                    this.next();
                    break;
                case 'music-controls-previous':
                    this.previous();
                    break;
                case 'music-controls-pause':
                    this.musicControls.updateIsPlaying(false);
                    this.pause();
                    break;
                case 'music-controls-play':
                    this.musicControls.updateIsPlaying(true);
                    this.play();
                    break;
                case 'music-controls-toggle-play-pause':
                    this.musicControls.updateIsPlaying(this.state.playing);
                    break;
                case 'music-controls-seek-to':
                    console.log('seek toooooo');
                    console.log(action);
                    const seekToInSeconds = JSON.parse(action).position;
                    console.log(seekToInSeconds);
                    this.musicControls.updateElapsed({
                        elapsed: seekToInSeconds,
                        isPlaying: this.state.playing
                    });
                    this.audioFileService.seekTo(seekToInSeconds * 1000);
                    break;
                case 'music-controls-headset-unplugged':
                    this.pause();
                    break;
            }
        });

        // activate the music control
        this.musicControls.listen();
    }
}
