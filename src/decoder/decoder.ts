import IEncodedChunk from '@interfaces/IEncodedChunk';

class Decoder {
  #decoder: VideoDecoder | null = null;

  #pendingFrames: Array<VideoFrame> = [];
  #underflow: boolean = true;
  #baseTime: number = 0;
  #baseTimestamp: number = 0;

  init = async (): Promise<void> => {
    const init: VideoDecoderInit = {
      output: this.#handleFrame,
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
      this.#decoder = new VideoDecoder(init);
      this.#decoder.configure(config);
    } else {
      // eslint-disable-next-line no-console
      console.log('Configuration not supported', config);
    }
  };

  decode = (encodedChunk: IEncodedChunk): void => {
    if (!this.#decoder) return;

    const chunk: EncodedVideoChunk = new EncodedVideoChunk({
      timestamp: encodedChunk.timestamp,
      type: encodedChunk.key ? 'key' : 'delta',
      data: new Uint8Array(encodedChunk.data)
    });
    this.#decoder.decode(chunk);
  };

  flush = async (): Promise<void> => {
    if (!this.#decoder) return;

    await this.#decoder.flush();
  };

  #calculateTimeUntilNextFrame = (timestamp: number): number => {
    if (this.#baseTime === 0) {
      this.#baseTime = performance.now();
      this.#baseTimestamp = timestamp;
    }
    const mediaTime: number = performance.now() - this.#baseTime; // real time
    const frameTime: number = (timestamp - this.#baseTimestamp) / 1000; // media time

    return Math.max(0, frameTime - mediaTime); // time to wait in real time before showing the next frame
  };

  #handleFrame: VideoFrameOutputCallback = (frame: VideoFrame) => {
    this.#pendingFrames.push(frame);
    if (this.#underflow) setTimeout(this.#renderFrame, 0);
  };

  #renderFrame = async (): Promise<void> => {
    const canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    this.#underflow = this.#pendingFrames.length === 0;
    if (this.#underflow) return;

    const frame: VideoFrame | undefined = this.#pendingFrames.shift();
    if (!frame) return;

    // Based on the frame's timestamp calculate how much of real time waiting
    // is needed before showing the next frame.
    const timeUntilNextFrame: number = this.#calculateTimeUntilNextFrame(frame.timestamp);
    await new Promise((r: (value: unknown) => void) => {
      setTimeout(r, timeUntilNextFrame);
    });
    ctx.drawImage(frame, 0, 0);
    frame.close();

    // Immediately schedule rendering of the next frame
    setTimeout(this.#renderFrame, 0);
  };
}

export default Decoder;
