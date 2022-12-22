import { singleton } from '../decorators/singleton';

@singleton
export class StreamService {

  constructor() { }

  /**
   * readStreamFromGCP - read stream using GCP SDK, passing gcp path file & file name
   */
  public async readStreamFromGCP(gcpPathFile: string, filename: string): Promise<void> {
    try {
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage();
        const bucket = storage.bucket(gcpPathFile);
        const file = bucket.file(filename);
        const readStream = file.createReadStream();
        return readStream;
    } catch (streamServiceError) {
      console.log('streamServiceError ', streamServiceError);
    }
  }
}
