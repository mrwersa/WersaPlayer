import { Component, OnInit, Input } from "@angular/core";
import { VideoDetail } from "../../models/video-detail.model";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player/ngx";

import { YoutubeDownloadService } from "../../services/youtube-download.service";

enum DownloadStaus {
    NotDownloaded,
    Downloading,
    Downloaded,
    Error
}

@Component({
    selector: "app-search-result",
    templateUrl: "./search-result.component.html",
    styleUrls: ["./search-result.component.scss"]
})
export class SearchResultComponent implements OnInit {
    @Input() result: VideoDetail;
    downloadStaus = DownloadStaus;
    status: DownloadStaus;

    constructor(
        private youtubeVideoPlayer: YoutubeVideoPlayer,
        private youtubeDownloadService: YoutubeDownloadService
    ) {
        this.status = DownloadStaus.NotDownloaded;
    }

    ngOnInit() {
        this.youtubeDownloadService.downloads.subscribe(msg => {
            if (msg.type === "download-finished") {
                this.status = DownloadStaus.Downloaded;
            } else if (msg.type === "download-error") {
                this.status = DownloadStaus.Error;
            } else if (msg.type === "download-progress") {
                this.status = DownloadStaus.Downloading;
            }
            console.log(msg);
        });
    }

    downloadVideo(videoId) {
        this.status = DownloadStaus.Downloading;
        this.youtubeDownloadService.downloadVideo(videoId);
    }

    playVideo(videoId) {
        this.youtubeVideoPlayer.openVideo(videoId);
    }
}
