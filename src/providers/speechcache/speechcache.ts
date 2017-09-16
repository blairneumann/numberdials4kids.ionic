import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/map';

const BaseURL = 'https://jtoun1d1qe.execute-api.us-west-2.amazonaws.com/prod/NumberDials4KidsSpeechCache?type=[TYPE]&[TYPE]=[VALUE]';

@Injectable()
export class SpeechcacheProvider {

  private BaseDir: string;
  private transfer: FileTransferObject;

  constructor(private http: Http, private storage: Storage,
      private fileTransfer: FileTransfer, private file: File) {

    this.BaseDir = this.file.dataDirectory; // .replace(/^file:\/\//, '');
    this.transfer = this.fileTransfer.create();
  }

  private normalizeValue(type: string, value: string): string {
    if (type === 'clock') {
      value = value.replace(/:/g, '.');
    }

    return value;
  }

  get(type: string, value: string): Promise<string> {
    console.log('get', type, value);

    value = this.normalizeValue(type, value);

    return new Promise((resolve, reject) => {
      this.getFromFileSystem(type, value).then(uri => {
        resolve(uri);
      }, error => {
        this.getFromStorage(type, value).then(uri => {
          resolve(uri);
        }, error => {
          this.getFromRemoteCache(type, value).then(url => {
            resolve(url);
          }, error => {
            reject(error);
          });
        });
      });
    });
  }


  // ** File System **

  private makeFilePath(type: string, value: string): string {
    return `${this.BaseDir}${type}`;
  }

  private makeFileName(type: string, value: string): string {
    return `${value}.mp3`;
  }

  private makeFileUri(type: string, value: string): string {
    return `${this.makeFilePath(type, value)}/${this.makeFileName(type, value)}`;
  }

  private getFromFileSystem(type: string, value: string): Promise<string> {
    console.log('getFromFileSystem', type, value);

    return new Promise((resolve, reject) => {
      let path = this.makeFilePath(type, value);
      let name = this.makeFileName(type, value);

      console.log('getFromFileSystem', path, name);

      this.file.checkFile(path, name).then(exists => {
        let uri = this.makeFileUri(type, value);

        console.log('getFromFileSystem', uri);

        if (exists) {
          resolve(uri);
        } else {
          reject(Error(`File not found: ${uri}`));
        }
      }, error => {
        console.log('getFromFileSystem', 'reject', error.name, error.message);
        reject(error);
      });
    });
  }

  private copyToFileSystem(type: string, value: string, content: any): Promise<string> {
    console.log('copyToFileSystem', type, value);

    return new Promise((resolve, reject) => {
      this.file.writeFile(this.makeFilePath(type, value), this.makeFileName(type, value), content).then(entry => {
        resolve(entry.toURL());
      }, error => {
        reject(error);
      })
    });
  }

  private downloadToFileSystem(type: string, value: string, url: string): Promise<string> {
    console.log('downloadToFileSystem', type, value);

    return new Promise((resolve, reject) => {
      this.transfer.download(url, this.makeFileUri(type, value)).then(entry => {
        resolve(entry.toURL());
        this.copyToStorage(type, value).then(uri => {
          console.log('downloadToFileSystem', 'copyToStorage', uri);
        });
      }, error => {
        reject(error);
      })
    });
  }


  // ** Storage **

  private makeStorageKey(type: string, value: string): string {
    return `${type}|${value}`;
  }

  private getFromStorage(type: string, value: string): Promise<string> {
    console.log('getFromStorage', type, value);

    return new Promise((resolve, reject) => {
      let key = this.makeStorageKey(type, value);

      this.storage.get(key).then(content => {
        if (content == null) {
          reject(Error(`getFromStorage: key not found: ${key}`));
        } else {
          this.copyToFileSystem(type, value, content).then(temp => {
            resolve(content);
          }, error => {
            reject(error);
          });
        }
      }, error => {
        reject(error);
      });
    });
  }

  private copyToStorage(type: string, value: string): Promise<string> {
    console.log('copyToStorage', type, value);

    return new Promise((resolve, reject) => {
      this.file.readAsText(this.makeFilePath(type, value), this.makeFileName(type, value)).then(content => {
        this.storage.set(this.makeStorageKey(type, value), content).then(() => {
          resolve(this.makeFileUri(type, value));
        }, error => {
          reject(error);
        })
      }, error => {
        reject(error);
      });
    });
  }


  // ** Remote Cache **

  private makeUrl(type: string, value: string): string {
    return BaseURL.replace(/\[TYPE]/g, type).replace(/\[VALUE]/g, value);
  }

  private getFromRemoteCache(type: string, value: string): Promise<string> {
    console.log('getFromRemoteCache', type, value);

    return new Promise((resolve, reject) => {
      this.http.get(this.makeUrl(type, value))
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
