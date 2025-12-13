import Decoder from '@decoder/decoder';
import Encoder from '@encoder/encoder';
// import generate from '@generator/canvas';
// import generate from '@generator/camera';
// import generate from '@generator/pixel';
import generate from '@generator/video';
import IEncodedChunk from '@interfaces/IEncodedChunk';

class WebCodecs {
  #abortController: AbortController | null = null;

  start = async (): Promise<void> => {
    const encoder: Encoder = new Encoder();
    const decoder: Decoder = new Decoder();

    await encoder.init();
    await decoder.init();

    this.#abortController = new AbortController();

    // Whenever a chunk is ready, decode it
    encoder.onChunk((chunk: IEncodedChunk) => {
      decoder.decode(chunk);
    });

    // Encode all frames from generator
    for await (const videoFrame of generate(this.#abortController.signal)) {
      encoder.encode(videoFrame);
    }

    // Ensure all pending operations are completed
    await encoder.flush();
    await decoder.flush();
  };

  stop = (): void => {
    this.#abortController?.abort();
  };
}

export default WebCodecs;
