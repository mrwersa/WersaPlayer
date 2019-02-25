import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { TrackDetail } from './../../models/track-detail.model';
import { VideoDetail } from '../../models/video-detail.model';
import { YoutubeDownloadService } from '../../services/youtube-download.service';
import { AudioFileService } from '../../services/audio-file.service';

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
        private youtubeDownloadService: YoutubeDownloadService,
        private audioFileService: AudioFileService,
        public alertController: AlertController
    ) { }

    get result(): VideoDetail {
        return this._result;
    }

    @Input()
    set result(_result: VideoDetail) {
        if (_result) {
            this._result = _result;
            this.audioFileService.getTrack(this._result.id).then(
                () => {
                    // it's already downloaded
                    this.status = DownloadStatus.Downloaded;
                },
                () => {
                    this.status = DownloadStatus.NotDownloaded;
                },
            );
        }
    }

    ngOnInit() {
        this.youtubeDownloadService.onMessage().subscribe((msg: any) => {
            console.log(msg.data.data.thumbnails);
            if (this.result && msg.data.id === this.result.id) {
                if (msg.type === 'download-finished') {
                    this.audioFileService.addTrack(new TrackDetail(this.result)).then(
                        () => { // success
                            this.status = DownloadStatus.Downloaded;
                        },
                        (error) => { // fail
                            this.status = DownloadStatus.Error;
                            this.presentError(error);
                        });

                } else if (msg.type === 'download-error') {
                    this.status = DownloadStatus.Error;
                    this.presentError(msg.data.data.title);
                    console.log(msg);
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

    }

    async presentError(videoName: string) {
        const alert = await this.alertController.create({
            header: 'Error',
            message: 'Failed to download "' + videoName + '"',
            buttons: ['OK']
        });

        await alert.present();
    }
}
