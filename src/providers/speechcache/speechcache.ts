import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/map';

const BaseURL = 'https://jtoun1d1qe.execute-api.us-west-2.amazonaws.com/prod/NumberDials4KidsSpeechCache?type=[TYPE]&[TYPE]=[VALUE]';

@Injectable()
export class SpeechcacheProvider {

  private BaseDir: string;
  private transfer: FileTransferObject;

  constructor(private http: Http,
      private fileTransfer: FileTransfer, private file: File) {

    this.BaseDir = this.file.cacheDirectory;
    this.transfer = this.fileTransfer.create();
  }

  private normalizeValue(type: string, value: string): string {
    if (type === 'clock') {
      value = value.replace(/:/g, '.');
    }

    return value;
  }

  get(type: string, value: string): Promise<string> {
    value = this.normalizeValue(type, value);

    return new Promise((resolve, reject) => {
      this.getFromFileSystem(type, value).then(uri => {
        resolve(uri);
      }, error => {
        this.getFromRemoteCache(type, value).then(url => {
          resolve(url);
        }, error => {
          reject(error);
        });
      });
    });
  }


  // ** File System **

  private makeFilePath(type: string, value: string): string {
    return this.BaseDir;
  }

  private makeFileName(type: string, value: string): string {
    return `${type}/${value}.mp3`;
  }

  private makeFileUri(type: string, value: string): string {
    return `${this.makeFilePath(type, value)}${this.makeFileName(type, value)}`;
  }

  private getFromFileSystem(type: string, value: string): Promise<string> {
    let path = this.makeFilePath(type, value);
    let name = this.makeFileName(type, value);

    return new Promise((resolve, reject) => {
      this.file.checkFile(path, name).then(exists => {
        let uri = this.makeFileUri(type, value);

        if (exists) {
          resolve(uri);
        } else {
          reject(Error(`File not found: ${uri}`));
        }
      }, error => {
        reject(error);
      });
    });
  }

  private downloadToFileSystem(type: string, value: string, url: string): Promise<string> {
    let uri = this.makeFileUri(type, value);

    return new Promise((resolve, reject) => {
      this.transfer.download(url, uri).then(entry => {
        resolve(entry.toURL());
      }, error => {
        reject(error);
      })
    });
  }


  // ** Remote Cache **

  private makeUrl(type: string, value: string): string {
    return BaseURL.replace(/\[TYPE]/g, type).replace(/\[VALUE]/g, value);
  }

  private getFromRemoteCache(type: string, value: string): Promise<string> {
    let url = this.makeUrl(type, value);

    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(response => response.json() || { })
        .subscribe(result => {
          this.downloadToFileSystem(type, value, result.url).then(uri => {
            resolve(uri);
          }, error => {
            reject(error);
          });
        }, error => {
          reject(error);
        });
    });
  }
}
