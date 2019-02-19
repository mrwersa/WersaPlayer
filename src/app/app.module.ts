import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { StoreModule } from '@ngrx/store';

import { AudioFileService } from './services/audio-file.service';
import { WebsocketService } from './services/websocket.service';
import { YoutubeDownloadService } from './services/youtube-download.service';
import { mediaStateReducer } from './services/store.provider';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({
            mediaState: mediaStateReducer
        }),
        IonicStorageModule.forRoot(),
        MaterialModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        WebsocketService,
        YoutubeDownloadService,
        AudioFileService,
        FileTransfer,
        HTTP,
        Media,
        BackgroundMode,
        MusicControls,
        FileTransferObject,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
