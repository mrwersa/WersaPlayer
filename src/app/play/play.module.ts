import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayPage } from './play.page';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: PlayPage }])
    ],
    declarations: [
        PlayPage
    ]
})
export class PlayPageModule { }
