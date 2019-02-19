import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'music-controls',
  templateUrl: './music-controls.component.html',
  styleUrls: ['./music-controls.component.scss']
})
export class MusicControlsComponent {
  @Input() hasPrev: boolean;
  @Input() hasNext: boolean;
  @Input() isPlaying: boolean;

  @Output()
  pause: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  play: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  next: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  previous: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }


  onPause() {
    this.pause.emit();
  }

  onPlay() {
    this.play.emit();
  }

  onNext() {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }

}
