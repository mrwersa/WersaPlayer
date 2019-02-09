import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { VideoDetail } from '../../models/video-detail.model';
import { YoutubeSearchService } from '../../services/youtube-search.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Output() results = new EventEmitter<VideoDetail[]>();

  constructor(private youtube: YoutubeSearchService) { }

  ngOnInit() {
  }

  search(query) {
    if (query.length < 1) {
      this.results.emit([]);
    } else {
      this.youtube.search(query).subscribe(
        _results => {
          this.results.emit(_results);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
