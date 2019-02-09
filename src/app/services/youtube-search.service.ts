import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { VideoDetail } from '../youtube/video-detail.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeSearchService {

  constructor(private http: HttpClient) { }

  nextPage(nextPageToken: string): Observable<VideoDetail[]> {
    const params: string = [
      `key=${environment.YOUTUBE_API_KEY}`,
      `part=snippet`,
      `type=video`,
      `maxResults=10`,
      `pageToken=${nextPageToken}`
    ].join('&');

    const queryUrl = `${environment.YOUTUBE_API_URL}?${params}`;

    return this.http.get(queryUrl).pipe(map(response => {
      return response['items'].map(item => {
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

    return this.http.get(queryUrl).pipe(map(response => {
      return response['items'].map(item => {
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
