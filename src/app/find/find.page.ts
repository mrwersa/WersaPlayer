import { Component } from '@angular/core';
import { VideoDetail } from '../youtube/video-detail.model';


@Component({
  selector: 'app-find',
  templateUrl: 'find.page.html',
  styleUrls: ['find.page.scss']
})
export class FindPage {
  results: VideoDetail[];
  loading: boolean;
  message = '';

  updateResults(results: VideoDetail[]): void {
    this.results = results;
    if (this.results.length === 0) {
      this.message = 'Not found...';
    } else {
      this.message = 'Top 10 results:';
    }
  }
}
