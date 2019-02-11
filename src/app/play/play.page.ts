import { Component } from '@angular/core';

import { MusicFileService } from '../services/music-file.service';
import { TrackDetail } from './../models/track-detail.model';


@Component({
    selector: 'app-play',
    templateUrl: 'play.page.html',
    styleUrls: ['play.page.scss']
})
export class PlayPage {
    tracks: TrackDetail[];
    playing: boolean = true;
    currentTrack: any;
    progressInterval: any;

    constructor(private musicFileService: MusicFileService) {

        this.musicFileService.getAllTracs().then(
            (tracks: TrackDetail[]) => {
                this.tracks = tracks;

                if (this.tracks.length > 0) {
                    this.currentTrack = this.tracks[0];
                }
            }
        )

    }

    playTrack(track: TrackDetail) {

        // First stop any currently playing tracks

        for (let checkTrack of this.tracks) {

            if (checkTrack.playing) {
                this.pauseTrack(checkTrack);
            }

        }

        track.playing = true;
        this.currentTrack = track;

        // Simulate track playing
        this.progressInterval = setInterval(() => {

            track.progress < 100 ? track.progress++ : track.progress = 0;

        }, 1000);

    }

    pauseTrack(track: TrackDetail) {

        track.playing = false;
        clearInterval(this.progressInterval);

    }

    nextTrack() {

        let index = this.tracks.indexOf(this.currentTrack);
        index >= this.tracks.length - 1 ? index = 0 : index++;

        this.playTrack(this.tracks[index]);

    }

    prevTrack() {

        let index = this.tracks.indexOf(this.currentTrack);
        index > 0 ? index-- : index = this.tracks.length - 1;

        this.playTrack(this.tracks[index]);

    }
}
