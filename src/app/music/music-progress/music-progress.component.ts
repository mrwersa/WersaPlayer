import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'music-progress',
  templateUrl: './music-progress.component.html',
  styleUrls: ['./music-progress.component.scss']
})
export class MusicProgressComponent {
  @Input() elapsed: string;
  @Input() total: string;
  @Input() value: number;
  @Input() max: number;

  @Output()
  seek: EventEmitter<number> = new EventEmitter<number>();

  isSliding = false;

  formatLabel(value: number | null) {
    if (!value) {
      return '00:00';
    }
    return moment.utc(value * 1000).format('mm:ss');
  }

  onInputChange(event: any) {
    this.seek.emit(event.value);
  }

}
