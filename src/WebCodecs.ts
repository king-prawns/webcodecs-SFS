import Decoder from '@decoder/decoder';
import Encoder from '@encoder/encoder';
import generate from '@generator/canvas';
// import generate from '@generator/camera';
// import generate from '@generator/pixel';
import IEncodedChunk from '@interfaces/IEncodedChunk';

class WebCodecs {
  do = async (): Promise<void> => {
    const encodedChunk: IEncodedChunk | null = await this.#encode();
    if (!encodedChunk) return;
    await this.#decode(encodedChunk);
  };

  #encode = async (): Promise<IEncodedChunk | null> => {
    const encoder: Encoder = new Encoder();
    await encoder.init();

    const videoFrame: VideoFrame | null = await generate();
    if (videoFrame) {
      encoder.encode(videoFrame);
    }

    await encoder.flush();

    if (encoder.encodedChunk) {
      // eslint-disable-next-line no-console
      console.log('Encoded chunk available');

      return encoder.encodedChunk;
    } else {
      // eslint-disable-next-line no-console
      console.log('No encoded chunk');

      return null;
    }
  };

  #decode = async (encodedChunk: IEncodedChunk): Promise<void> => {
    const decoder: Decoder = new Decoder();
    await decoder.init();
    if (decoder) {
      decoder.decode(encodedChunk);
    }
  };
}

export default WebCodecs;
