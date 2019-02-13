import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { StoreModule } from '@ngrx/store';

import { MusicFileService } from './services/music-file.service';
import { WebsocketService } from './services/websocket.service';
import { YoutubeDownloadService } from './services/youtube-download.service';
import { AudioService } from './services/audio.service';
import { mediaStateReducer } from './providers/store.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        StoreModule.forRoot({
            appState: mediaStateReducer
        }),
        IonicStorageModule.forRoot()
    ],
    providers: [
        StatusBar,
        SplashScreen,
        WebsocketService,
        YoutubeDownloadService,
        MusicFileService,
        FileTransfer,
        FileTransferObject,
        AudioService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
