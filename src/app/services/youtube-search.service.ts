import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

import { VideoDetail } from '../models/video-detail.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeSearchService {

  constructor(private http: HTTP) { }

  nextPage(nextPageToken: string): Observable<VideoDetail[]> {
    const params: string = [
      `key=${environment.YOUTUBE_API_KEY}`,
      `part=snippet`,
      `type=video`,
      `maxResults=10`,
      `pageToken=${nextPageToken}`
    ].join('&');

    const queryUrl = `${environment.YOUTUBE_API_URL}?${params}`;

    this.http.get(queryUrl, {}, {})
      .then(data => {
      }).catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });

    return from(this.http.get(queryUrl, {}, {})).pipe(map(response => {
      let data = JSON.parse(response.data);

      return data['items'].map(item => {
        return new VideoDetail({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          nextPageToken: response['nextPageToken']
        });
      });
    }));
  }

  search(query: string): Observable<VideoDetail[]> {
    const params: string = [
      `q=${query}`,
      `key=${environment.YOUTUBE_API_KEY}`,
      `part=snippet`,
      `type=video`,
      `maxResults=10`
    ].join('&');

    const queryUrl = `${environment.YOUTUBE_API_URL}?${params}`;

    return from(this.http.get(queryUrl, {}, {})).pipe(map(response => {
      let data = JSON.parse(response.data);

      return data['items'].map(item => {
        return new VideoDetail({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          nextPageToken: response['nextPageToken']
        });
      });
    }));
  }
}
