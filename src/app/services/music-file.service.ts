import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { TrackDetail } from './../models/track-detail.model';

@Injectable()
export class MusicFileService {

  constructor(private storage: Storage) { }

  public downloadTrack(id: string) {

  }

  public playTrack(id: string) {

  }

  public getTrackMetaData(id: string) {
    let promise = new Promise((resolve, reject) => {
      this.storage.get(id).then((track) => {
        if (track) {
          resolve(track);
        } else {
          reject();
        }
      });
    });

    return promise;
  }

  public addTrackMetadata(track: TrackDetail) {
    this.storage.set(track.id, track);
  }
}
