import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayPage } from './play.page';
import { MatSliderModule } from '@angular/material/slider';

import { MusicProgressComponent } from '../music/music-progress/music-progress.component';
import { MusicControlsComponent } from '../music/music-controls/music-controls.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSliderModule,
        RouterModule.forChild([{ path: '', component: PlayPage }])
    ],
    declarations: [
        PlayPage,
        MusicProgressComponent,
        MusicControlsComponent
    ]
})
export class PlayPageModule { }
