import { Component, OnInit, Input } from '@angular/core';
import { VideoDetail } from '../video-detail.model';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Subject } from 'rxjs';

import { YoutubeDownloadService } from '../../services/youtube-download.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  @Input() result: VideoDetail;

  constructor(private youtube: YoutubeVideoPlayer, private youtubeDownloadService: YoutubeDownloadService) { }

  ngOnInit() {
    this.youtubeDownloadService.downloads.subscribe(msg => {
      if (msg.type == 'download-finished') {
        
      }
      console.log(msg);
    })
  }

  playVideo(videoId) {
    this.youtube.openVideo(videoId)
  }

  downloadVideo(videoId) {
    this.youtubeDownloadService.downloadVideo(videoId);
  }
}