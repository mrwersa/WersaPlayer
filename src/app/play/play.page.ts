import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Store } from '@ngrx/store';

import { AudioFileService } from '../services/audio-file.service';
import { TrackDetail } from './../models/track-detail.model';
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
export class PlayPage implements OnInit {
    tracks: TrackDetail[] = [];
    currentIndex = -1;
    seek = 0;
    state: any = {};
    displayFooter = 'inactive';

    constructor(private audioFileService: AudioFileService, private store: Store<any>) {
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
                this.seek = value;
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

    onSeekChange(event) {
        this.audioFileService.seekTo(event.value);
    }

    reset() {
        this.currentIndex = -1;
        this.displayFooter = 'inactive';
    }


}
