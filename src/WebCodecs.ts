import Decoder from '@decoder/decoder';
import Encoder from '@encoder/encoder';
import generateFromCanvas from '@generator/canvas';
import IEncodedChunk from '@interfaces/IEncodedChunk';

class WebCodecs {
  public async do(): Promise<void> {
    const encodedChunk: IEncodedChunk | null = await this.encode();
    if (!encodedChunk) return;
    await this.decode(encodedChunk);
  }

  private async encode(): Promise<IEncodedChunk | null> {
    const encoder: Encoder = new Encoder();
    await encoder.init();

    const videoFrame: VideoFrame | null = await generateFromCanvas();
    if (videoFrame) {
      encoder.encode(videoFrame);
    }

    return new Promise((resolve: (value: IEncodedChunk | null) => void) => {
      setTimeout(() => {
        if (encoder.encodedChunk) {
          // eslint-disable-next-line no-console
          console.log('Encoded chunk available');
          resolve(encoder.encodedChunk);
        } else {
          // eslint-disable-next-line no-console
          console.log('No encoded chunk');
          resolve(null);
        }
      }, 5000);
    });
  }

  private async decode(encodedChunk: IEncodedChunk): Promise<void> {
    const decoder: Decoder = new Decoder();
    await decoder.init();
    if (decoder) {
      decoder.decode(encodedChunk);
    }
  }
}

export default WebCodecs;
