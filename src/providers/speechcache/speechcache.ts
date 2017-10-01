import { Injectable } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const BaseURL = 'https://jtoun1d1qe.execute-api.us-west-2.amazonaws.com/prod/NumberDials4KidsSpeechCache?type=[TYPE]&[TYPE]=[VALUE]';

@Injectable()
export class SpeechcacheProvider {

  constructor(private http: Http, private file: File,
      private transfer: FileTransfer) {
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

  get baseDir(): string {
    return this.file.cacheDirectory;
  }

  get cacheDir(): string {
    return 'speechcache';
  }

  private makeFilePath(type: string, value: string): string {
    return this.baseDir;
  }

  private makeFileName(type: string, value: string): string {
    return `${this.cacheDir}/${type}/${value}.mp3`;
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
      let transfer = this.transfer.create();

      transfer.download(url, uri).then(entry => {
        resolve(entry.toURL());
      }, error => {
        reject(error);
      });
    });
  }

  clear(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.file.checkDir(this.baseDir, this.cacheDir).then(exists => {
        if (exists) {
          this.file.removeRecursively(this.baseDir, this.cacheDir).then(result => {
            resolve(result.success);
          }).catch(error => {
            reject(error);
          });
        } else {
          resolve(false);
        }
      }).catch(error => {
        if (error.code === 1) { // NOT_FOUND_ERR
          resolve(false);
        } else {
          reject(error);
        }
      });
    })
  }

  // ** Remote Cache **

  warmup(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(this.makeUrl('number', '0'))
        .subscribe(() => {
          resolve(true);
        }, error => {
          reject(error);
        });
    });
  }

  private makeUrl(type: string, value: string): string {
    return BaseURL.replace(/\[TYPE]/g, type).replace(/\[VALUE]/g, value);
  }

  private getFromRemoteCache(type: string, value: string): Promise<string> {
    let url = this.makeUrl(type, value);

    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(response => {
          return response.json() || { };
        }).subscribe(result => {
          resolve(result.url);

          this.downloadToFileSystem(type, value, result.url).catch(error => {
            console.error(error);
          });
        }, error => {
          reject(error);
        });
    });
  }
}
