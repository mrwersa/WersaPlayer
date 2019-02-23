import { Component } from '@angular/core';
import { VideoDetail } from '../models/video-detail.model';


@Component({
    selector: 'app-find',
    templateUrl: 'find.page.html',
    styleUrls: ['find.page.scss']
})
export class FindPage {
    results: VideoDetail[];
    message = '';

    updateResults(results: VideoDetail[]): void {
        this.results = results;
    }
}
