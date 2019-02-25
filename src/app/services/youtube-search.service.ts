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

    search(query: string, nextPageToken?: string): Observable<VideoDetail[]> {
        let params = [
            `q=${encodeURI(query)}`,
            `key=${environment.YOUTUBE_API_KEY}`,
            `part=snippet`,
            `type=video`,
            `maxResults=10`,
            `videoDuration=any`
        ];

        if (nextPageToken) {
            params.push(`pageToken=${nextPageToken}`);
        }
        return this.getYouTubeDataAPI(params.join('&'), query);
    }

    private getYouTubeDataAPI(params: string, query: string): Observable<VideoDetail[]> {
        const queryUrl = `${environment.YOUTUBE_API_URL}?${params}`;

        return from(this.http.get(queryUrl, {}, {})).pipe(map(response => {
            let data = JSON.parse(response.data);
            return data['items'].map(item => {
                return new VideoDetail({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnailUrl: item.snippet.thumbnails.default.url,
                    nextPageToken: data['nextPageToken'],
                    query: query
                });
            });
        }));
    }
}
