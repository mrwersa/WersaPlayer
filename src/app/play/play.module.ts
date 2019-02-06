import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayPage } from './play.page';

import { ProgressBarComponent } from '../progress-bar/progress-bar.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: PlayPage }])
    ],
    declarations: [
        ProgressBarComponent,
        PlayPage
    ]
})
export class PlayPageModule { }
