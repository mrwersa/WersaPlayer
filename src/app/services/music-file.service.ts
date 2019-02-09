import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { TrackDetail } from './../models/track-detail.model';

@Injectable({
  providedIn: 'root'
})
export class MusicFileService {

  constructor(private storage: Storage) { }


  public downloadTrack(videoId: string) {

  }

  public getAllTracks() {
    this.storage.get('tracks').then((tracks) => {

    });
  }

  public getTrack(id: string) {
    this.storage.get(id).then((track) => {

    });
  }

  public addTrack(track: TrackDetail) {
    this.storage.set(track.id, track);
  }

}
