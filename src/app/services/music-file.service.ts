import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';

import { environment } from '../../environments/environment';
import { TrackDetail } from './../models/track-detail.model';

@Injectable({
  providedIn: 'root'
})
export class MusicFileService {

  constructor(private storage: Storage, private transfer: FileTransfer) { }

  public downloadTrack(id: string) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = environment.WS_URL + "/downloads/" + id;

    let promise = new Promise((resolve, reject) => {
      fileTransfer.download(url, File.dataDirectory + 'file.pdf').then((entry) => {
        resolve();
      }, (error) => {
        reject();
      });
    });

    return promise;
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
