import { Component, OnInit, Input } from "@angular/core";
import { VideoDetail } from "../video-detail.model";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player/ngx";

import { YoutubeDownloadService } from "../../services/youtube-download.service";

enum DownloadStaus {
    NotDownloaded,
    Dowloading,
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
    downloadStatus: DownloadStaus;

    constructor(
        private youtubeVideoPlayer: YoutubeVideoPlayer,
        private youtubeDownloadService: YoutubeDownloadService
    ) {
        this.downloadStatus = DownloadStaus.NotDownloaded;
    }

    ngOnInit() {
        this.youtubeDownloadService.downloads.subscribe(msg => {
            if (msg.type === "download-finished") {
                this.downloadStatus = DownloadStaus.Downloaded;
            } else if (msg.type === "download-error") {
                this.downloadStatus = DownloadStaus.Error;
            } else if (msg.type === "download-progress") {
                this.downloadStatus = DownloadStaus.Dowloading;
            }
            console.log(msg);
        });
    }

    downloadVideo(videoId) {
        this.youtubeDownloadService.downloadVideo(videoId);
    }

    playVideo(videoId) {
        this.youtubeVideoPlayer.openVideo(videoId);
    }
}
