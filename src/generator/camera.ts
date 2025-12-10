async function* generate(signal?: AbortSignal): AsyncGenerator<VideoFrame> {
  // eslint-disable-next-line no-console
  console.log('Generating frames from camera');

  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true});
  const track: MediaStreamTrack = stream.getVideoTracks()[0];
  const trackProcessor: MediaStreamTrackProcessor = new MediaStreamTrackProcessor(track);
  const reader: ReadableStreamDefaultReader<VideoFrame> = trackProcessor.readable.getReader();

  try {
    while (true) {
      if (signal?.aborted) break;
      // eslint-disable-next-line no-await-in-loop
      const result: ReadableStreamReadResult<VideoFrame> = await reader.read();
      if (result.done) break;
      yield result.value;
    }
  } finally {
    track.stop();
  }
}

export default generate;
