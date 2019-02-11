import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { TrackDetail } from './../../models/track-detail.model';
import { VideoDetail } from '../../models/video-detail.model';
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
        private youtubeDownloadService: YoutubeDownloadService,
        private musicFileService: MusicFileService,
        public alertController: AlertController
    ) { }

    get result(): VideoDetail {
        return this._result;
    }

    @Input()
    set result(_result: VideoDetail) {
        if (_result) {
            this._result = _result;
            this.musicFileService.getTrack(this._result.id).then(
                () => {
                    this.status = DownloadStatus.Downloaded;
                },
                () => {
                    this.youtubeDownloadService.getDownloadStatus(this._result.id);
                },
            );
        }
    }

    ngOnInit() {
        this.youtubeDownloadService.onMessage().subscribe((msg: any) => {
            if (this.result && msg.data.id === this.result.id) {
                if (msg.type === 'download-finished') {
                    this.musicFileService.addTrack(new TrackDetail({
                        id: msg.data.id,
                        title: msg.data.data.title,
                        description: msg.data.data.description,
                        thumbnail: msg.data.data.thumbnail
                    })).then(
                        () => { // success
                            this.status = DownloadStatus.Downloaded;
                        },
                        () => { // fail
                            this.status = DownloadStatus.Error;
                            this.presentError(msg.data.id);
                        });

                } else if (msg.type === 'download-error') {
                    this.status = DownloadStatus.Error;
                    this.presentError(msg.data.id);
                    console.log(msg);
                } else if (msg.type === 'download-progress') {
                    this.status = DownloadStatus.Downloading;
                } else if (msg.type === 'download-status') {
                    if (msg.data.status === 'downloading') {
                        this.status = DownloadStatus.Downloading;
                    } else {
                        this.status = DownloadStatus.NotDownloaded;
                    }
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
            message: 'Failed to download ' + videoName,
            buttons: ['OK']
        });

        await alert.present();
    }
}
