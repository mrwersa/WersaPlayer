import { Component, OnInit, Input } from "@angular/core";

import { VideoDetail } from "../../models/video-detail.model";
import { YoutubeSearchService } from "../../services/youtube-search.service";

@Component({
  selector: "app-search-result-list",
  templateUrl: "./search-result-list.component.html",
  styleUrls: ["./search-result-list.component.scss"]
})
export class SearchResultListComponent implements OnInit {
  private _results: VideoDetail[];
  private nextPageToken: string;

  constructor(private youtube: YoutubeSearchService) {}

  get results(): VideoDetail[] {
    // transform value for display
    return this._results;
  }

  @Input()
  set results(_results: VideoDetail[]) {
    this._results = _results;
    this.nextPageToken = this._results[this.results.length - 1].nextPageToken;
  }

  ngOnInit() {}

  loadMoreResults(event) {
    this.youtube.nextPage(this.nextPageToken).subscribe(
      _results => {
        this._results = this._results.concat(_results);
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
