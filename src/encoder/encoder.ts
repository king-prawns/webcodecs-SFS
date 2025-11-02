// Usually this function would be sending data chunks over the network or muxing them into a media container for storage.
const handleChunk: EncodedVideoChunkOutputCallback = (
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

  // eslint-disable-next-line no-console
  console.log('Upload chunk', chunkData);
};

const encoder = async (/* handleChunk: EncodedVideoChunkOutputCallback */): Promise<VideoEncoder | null> => {
  let encoder: VideoEncoder | null = null;

  const init: VideoEncoderInit = {
    output: handleChunk,
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
    encoder = new VideoEncoder(init);
    encoder.configure(config);
  } else {
    // eslint-disable-next-line no-console
    console.log('Configuration not supported', config);
  }

  return encoder;
};

// If at some point you'd need to make sure that all pending encoding requests have been completed, you can call flush() and wait for its promise.
// await encoder.flush();

export default encoder;
