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
    seeking = false;
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

        this.store.select('mediaState')
            .pipe(pluck('media', 'loadedmetadata'), filter(value => value === true))
            .subscribe(() => {
                // create a music control for locked screen
                this.musicControls.create({
                    track: this.tracks[this.currentIndex].title,
                    cover: this.tracks[this.currentIndex].thumbnailUrl,
                    isPlaying: true,
                    duration: this.state.duration,
                    // hide previous/next/close buttons:
                    hasPrev: !this.isFirstPlaying(),
                    hasNext: !this.isLastPlaying(),
                });
                // activate the music control
                this.musicControls.listen();

                // show footer (music player)
                this.displayFooter = 'active';
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
                if (!this.seeking) {
                    this.seek = value;
                    this.musicControls.updateElapsed(value);
                }
            });

        let self = this;
        this.musicControls.subscribe().subscribe(action => {
            function events(action) {
                const message = JSON.parse(action).message;
                switch (message) {
                    case 'music-controls-next':
                        self.next();
                        break;
                    case 'music-controls-previous':
                        self.previous();
                        break;
                    case 'music-controls-pause':
                        self.pause();
                        break;
                    case 'music-controls-play':
                        self.play();
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
                        self.audioFileService.seekTo(seekToInSeconds);
                        break;
                }
            }
        });
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

    onSeekStart() {
        this.seeking = true;
    }

    onSeekEnd(event: any) {
        if (this.seeking) {
            this.audioFileService.seekTo(event.target.value);
            this.seeking = false;
        }
    }

    reset() {
        this.currentIndex = -1;
        this.displayFooter = 'inactive';
    }
}
