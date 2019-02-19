
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatSliderModule
} from '@angular/material';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatSliderModule
    ],
    exports: [
        BrowserAnimationsModule,
        MatSliderModule
    ]
})
export class MaterialModule { }
