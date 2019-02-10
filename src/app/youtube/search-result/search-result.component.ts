import { Component, OnInit, Input } from '@angular/core';
import { VideoDetail } from '../../models/video-detail.model';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

import { YoutubeDownloadService } from '../../services/youtube-download.service';
import { MusicFileService } from '../../services/music-file.service';

enum DownloadStatus {
    NotDownloaded,
    Downloading,
    Downloaded,
    Error
}

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
    private _result: VideoDetail;
    downloadStatus = DownloadStatus;
    status: DownloadStatus;

    constructor(
        private youtubeVideoPlayer: YoutubeVideoPlayer,
        private youtubeDownloadService: YoutubeDownloadService,
        private musicFileService: MusicFileService,
    ) {
        this.status = DownloadStatus.NotDownloaded;
    }

    get result(): VideoDetail {
        return this._result;
    }

    @Input()
    set result(_result: VideoDetail) {
        if (_result) {
            this._result = _result;
            this.musicFileService.getTrackMetaData(this._result.id).then(
                () => {
                    this.status = DownloadStatus.Downloaded;
                },
                () => {
                    this.status = DownloadStatus.NotDownloaded;
                },
            );
        }
    }

    ngOnInit() {
        this.youtubeDownloadService.downloads.subscribe(msg => {
            if (this.result && msg.data.id === this.result.id) {
                if (msg.type === 'download-finished') {
                    this.status = DownloadStatus.Downloaded;
                    // this.musicFileService.addTrack(msg.data.id);    
                } else if (msg.type === 'download-error') {
                    this.status = DownloadStatus.Error;
                } else if (msg.type === 'download-progress') {
                    this.status = DownloadStatus.Downloading;
                }
            }
        });
    }

    downloadVideo(videoId) {

        this.status = DownloadStatus.Downloading;
        this.youtubeDownloadService.downloadVideo(videoId);
    }

    playVideo(videoId) {
        this.youtubeVideoPlayer.openVideo(videoId);
    }
}
