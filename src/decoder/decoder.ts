import IEncodedChunk from '@interfaces/IEncodedChunk';

class Decoder {
  private _decoder: VideoDecoder | null = null;

  private _pendingFrames: Array<VideoFrame> = [];
  private _underflow: boolean = true;
  private _baseTime: number = 0;

  public init = async (): Promise<void> => {
    const init: VideoDecoderInit = {
      output: this.handleFrame,
      error: (e: DOMException) => {
        // eslint-disable-next-line no-console
        console.log('Decoder error: ', e.message);
      }
    };

    const config: VideoDecoderConfig = {
      codec: 'vp8',
      codedWidth: 640,
      codedHeight: 480
    };

    const {supported} = await VideoDecoder.isConfigSupported(config);
    if (supported) {
      this._decoder = new VideoDecoder(init);
      this._decoder.configure(config);
    } else {
      // eslint-disable-next-line no-console
      console.log('Configuration not supported', config);
    }
  };

  public decode = async (encodedChunk: IEncodedChunk): Promise<void> => {
    if (!this._decoder) return;

    const chunk: EncodedVideoChunk = new EncodedVideoChunk({
      timestamp: encodedChunk.timestamp,
      type: encodedChunk.key ? 'key' : 'delta',
      data: new Uint8Array(encodedChunk.data)
    });
    this._decoder.decode(chunk);

    await this._decoder.flush();
  };

  private calculateTimeUntilNextFrame = (timestamp: number): number => {
    if (this._baseTime === 0) this._baseTime = performance.now();
    const mediaTime: number = performance.now() - this._baseTime;

    return Math.max(0, timestamp / 1000 - mediaTime);
  };

  private handleFrame: VideoFrameOutputCallback = (frame: VideoFrame) => {
    this._pendingFrames.push(frame);
    if (this._underflow) setTimeout(this.renderFrame, 0);
  };

  private renderFrame = async (): Promise<void> => {
    const canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    this._underflow = this._pendingFrames.length === 0;
    if (this._underflow) return;

    const frame: VideoFrame | undefined = this._pendingFrames.shift();
    if (!frame) return;

    // Based on the frame's timestamp calculate how much of real time waiting
    // is needed before showing the next frame.
    const timeUntilNextFrame: number = this.calculateTimeUntilNextFrame(frame.timestamp);
    await new Promise((r: (value: unknown) => void) => {
      setTimeout(r, timeUntilNextFrame);
    });
    ctx.drawImage(frame, 0, 0);
    frame.close();

    // Immediately schedule rendering of the next frame
    setTimeout(this.renderFrame, 0);
  };
}

export default Decoder;
