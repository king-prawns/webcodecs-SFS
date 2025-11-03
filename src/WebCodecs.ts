import decodeFrame from '@decoder/decode';
import getDecoder from '@decoder/decoder';
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
    const encoderInstance: Encoder = new Encoder();
    const encoder: VideoEncoder | null = await encoderInstance.getEncoder();
    const videoFrame: VideoFrame | null = await generateFromCanvas();
    if (encoder && videoFrame) {
      encoderInstance.encode(encoder, videoFrame);
    }

    return new Promise((resolve: (value: IEncodedChunk | null) => void) => {
      setTimeout(() => {
        if (encoderInstance.encodedChunk) {
          // eslint-disable-next-line no-console
          console.log('Encoded chunk available');
          resolve(encoderInstance.encodedChunk);
        } else {
          // eslint-disable-next-line no-console
          console.log('No encoded chunk');
          resolve(null);
        }
      }, 5000);
    });
  }

  private async decode(encodedChunk: IEncodedChunk): Promise<void> {
    const decoder: VideoDecoder | null = await getDecoder();
    if (decoder) {
      decodeFrame(decoder, encodedChunk);
    }
  }
}

export default WebCodecs;
