import { Component, Input, Output, EventEmitter, ViewChild, ɵConsole } from '@angular/core';


import { MatSlider } from '@angular/material';

import * as moment from 'moment';

@Component({
    selector: 'music-progress',
    templateUrl: './music-progress.component.html',
    styleUrls: ['./music-progress.component.scss']
})
export class MusicProgressComponent {
    @Input() elapsed: string;
    @Input() total: string;
    @Input() max: number;
    private _value: number;
    @Input() set value(value: number) {
        if (!this.sliding) {
            this._value = value;
        }
    }
    get value(): number {
        return this._value;
    }
    @Output() seek: EventEmitter<number> = new EventEmitter<number>();

    sliding = false;

    formatLabel(value: number | null) {
        if (!value) {
            return '00:00';
        }
        return moment.utc(value * 1000).format('mm:ss');
    }

    onInputChange(event: any) {
        if (this.sliding) {
            this.seek.emit(event.value);
            this.sliding = false;
        }
    }

    onSliderChange(event: any) {
        this.sliding = true;
    }
}
