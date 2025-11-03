import IEncodedChunk from '@interfaces/IEncodedChunk';

const decode = async (decoder: VideoDecoder, encodedChunk: IEncodedChunk): Promise<void> => {
  const chunk: EncodedVideoChunk = new EncodedVideoChunk({
    timestamp: encodedChunk.timestamp,
    type: encodedChunk.key ? 'key' : 'delta',
    data: new Uint8Array(encodedChunk.data)
  });
  decoder.decode(chunk);

  await decoder.flush();
};

export default decode;
