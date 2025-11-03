import IEncodedChunk from '@interfaces/IEncodedChunk';

class Encoder {
  private _encoder: VideoEncoder | null = null;
  private _encodedChunk: IEncodedChunk | null = null;

  public get encodedChunk(): IEncodedChunk | null {
    return this._encodedChunk;
  }

  public async init(): Promise<void> {
    const init: VideoEncoderInit = {
      output: this.handleChunk,
      error: (e: DOMException) => {
        // eslint-disable-next-line no-console
        console.log('Encoder error: ', e.message);
      }
    };

    const config: VideoEncoderConfig = {
      codec: 'vp8',
      width: 640,
      height: 480,
      bitrate: 2_000_000, // 2 Mbps
      framerate: 30
    };

    const {supported} = await VideoEncoder.isConfigSupported(config);
    if (supported) {
      this._encoder = new VideoEncoder(init);
      this._encoder.configure(config);
    } else {
      // eslint-disable-next-line no-console
      console.log('Configuration not supported', config);
    }
  }

  public encode = (videoFrame: VideoFrame): void => {
    if (!this._encoder) return;

    let frameCounter: number = 0;

    if (this._encoder.encodeQueueSize > 2) {
      // Too many frames in flight, encoder is overwhelmed, let's drop this frame.
      // eslint-disable-next-line no-console
      console.log('Dropping frame t: ', videoFrame.timestamp);
      videoFrame.close();
    } else {
      frameCounter++;
      const keyFrame: boolean = frameCounter % 150 === 0;
      this._encoder.encode(videoFrame, {keyFrame});
      videoFrame.close();
    }
  };

  // Usually this function would be sending data chunks over the network or muxing them into a media container for storage.
  private handleChunk: EncodedVideoChunkOutputCallback = (
    chunk: EncodedVideoChunk,
    metadata?: EncodedVideoChunkMetadata
  ) => {
    if (metadata && metadata.decoderConfig) {
      // Decoder needs to be configured (or reconfigured) with new parameters
      // when metadata has a new decoderConfig.
      // Usually it happens in the beginning or when the encoder has a new
      // codec specific binary configuration. (VideoDecoderConfig.description).
      // eslint-disable-next-line no-console
      console.log('Decoder config description: ', metadata.decoderConfig.description);
    }

    // actual bytes of encoded data
    const chunkData: Uint8Array = new Uint8Array(chunk.byteLength);
    chunk.copyTo(chunkData);

    this._encodedChunk = {
      timestamp: chunk.timestamp,
      key: chunk.type === 'key',
      data: chunkData
    };

    // eslint-disable-next-line no-console
    console.log('Encoded chunk', this._encodedChunk);
  };
}

export default Encoder;

// If at some point you'd need to make sure that all pending encoding requests have been completed, you can call flush() and wait for its promise.
// await encoder.flush();
