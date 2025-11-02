import encodeFrame from './encoder/encode';
import getEncoder from './encoder/encoder';
import generateFromCanvas from './generator/canvas';

class WebCodecs {
  public async do(): Promise<void> {
    await this.encode();
  }

  private async encode(): Promise<void> {
    const encoder: VideoEncoder | null = await getEncoder();
    const videoFrame: VideoFrame | null = await generateFromCanvas();
    if (encoder && videoFrame) {
      encodeFrame(encoder, videoFrame);
    }
  }
}

export default WebCodecs;
