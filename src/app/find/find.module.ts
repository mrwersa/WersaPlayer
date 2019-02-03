import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FindPage } from './find.page';
import { SearchBoxComponent } from '../youtube/search-box/search-box.component';
import { SearchResultComponent } from '../youtube/search-result/search-result.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FindPage }])
  ],
  declarations: [
    FindPage,
    SearchBoxComponent,
    SearchResultComponent]
})
export class FindPageModule {}
