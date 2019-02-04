import { Component, OnInit, Input } from '@angular/core';

import { VideoDetail } from '../video-detail.model';
import { YoutubeSearchService } from '../../services/youtube-search.service';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit {
  @Input() results: VideoDetail[];
  nextPageToken: string;

  constructor(private youtube: YoutubeSearchService) { }

  ngOnInit() {
    this.nextPageToken = this.results[this.results.length - 1].nextPageToken;
  }

  loadMoreResults(event) {

    this.youtube.nextPage(this.nextPageToken).subscribe(
      _results => {
        this.results.concat(_results);
        this.nextPageToken = _results[_results.length - 1].nextPageToken;
        event.target.complete();
      },
      err => {
        console.log(err);
        event.target.complete();
      }
    );
  }
}
