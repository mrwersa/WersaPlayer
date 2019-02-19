import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
    currentPos = 0;
    state: any = {};
    displayFooter = 'inactive';

    constructor(private musicControls: MusicControls, private audioFileService: AudioFileService, private store: Store<any>) {
        this.audioFileService.tracks.subscribe((track: TrackDetail) => {
            this.tracks.push(track);
        });
    }

    ngOnInit() {
        this.store.select('mediaState').subscribe((value: any) => {
            this.state = value.media;
        });

        // wait for the metadata to load then show the footer
        this.store.select('mediaState')
            .pipe(pluck('media', 'loadedmetadata'), filter(value => value === true))
            .subscribe(() => {
                // show footer (music player)
                this.displayFooter = 'active';
            });

        // wait to get duration then show music controls
        this.store.select('mediaState')
            .pipe(
                pluck('media', 'durationSec'),
                filter(value => value !== undefined),
                map((value: any) => Number.parseInt(value)),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                // create a music control for locked screen
                this.musicControls.create({
                    track: this.tracks[this.currentIndex].title,
                    // cover: this.tracks[this.currentIndex].thumbnailUrl,
                    isPlaying: true,
                    dismissable: true,
                    duration: value,
                    // hide previous/next/close buttons:
                    hasPrev: !this.isFirstPlaying(),
                    hasNext: !this.isLastPlaying(),
                    ticker: 'Now playing "' + this.tracks[this.currentIndex].title + '"'
                });
            });

        // Updating the Seekbar based on currentTime
        this.store.select('mediaState')
            .pipe(
                pluck('media', 'timeSec'),
                filter(value => value !== undefined),
                map((value: any) => Number.parseInt(value)),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                this.seek = value;
                this.currentPos = value;
                this.musicControls.updateElapsed(value);
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
                    this.pause();
                    break;
                case 'music-controls-play':
                    this.play();
                    break;
                case 'music-controls-destroy':
                    // self.reset();
                    break;

                // External controls (iOS only)
                case 'music-controls-toggle-play-pause':
                    break;
                case 'music-controls-seek-to':
                    const seekToInSeconds = JSON.parse(action).position;
                    this.musicControls.updateElapsed({
                        elapsed: seekToInSeconds,
                        isPlaying: true
                    });
                    this.audioFileService.seekTo(seekToInSeconds);
                    break;
            }
        });

        // activate the music control
        this.musicControls.listen();
    }

    openTrack(index) {
        this.currentIndex = index;
        if (index >= 0 && index < this.tracks.length) {
            this.audioFileService.openTrack(this.tracks[index]);
        }
    }

    pause() {
        this.audioFileService.pauseTrack();
    }

    play() {
        this.audioFileService.playTrack();
    }

    stop() {
        this.audioFileService.stopTrack();
    }

    next() {
        this.openTrack(this.currentIndex + 1);
    }

    previous() {
        this.openTrack(this.currentIndex - 1);
    }

    isFirstPlaying() {
        return this.currentIndex === 0;
    }

    isLastPlaying() {
        return this.currentIndex === this.tracks.length - 1;
    }

    onSeek(event: any) {
        if (this.currentPos !== event.target.value) {
            this.audioFileService.seekTo(event.target.value);
        }
    }

    reset() {
        this.currentIndex = -1;
        this.displayFooter = 'inactive';
    }
}
