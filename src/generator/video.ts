const VIDEO_URL: string = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

async function* generate(signal?: AbortSignal): AsyncGenerator<VideoFrame> {
  // eslint-disable-next-line no-console
  console.log('Generating frames from remote video:', VIDEO_URL);

  const video: HTMLVideoElement = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.src = VIDEO_URL;

  // Wait for video to be ready
  await new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
    video.onloadedmetadata = (): void => resolve();
    video.onerror = (): void => reject(new Error('Failed to load video'));
  });

  // Start playback
  await video.play();

  // Capture stream from video element
  const stream: MediaStream = video.captureStream();
  const track: MediaStreamTrack = stream.getVideoTracks()[0];
  const trackProcessor: MediaStreamTrackProcessor = new MediaStreamTrackProcessor(track);
  const reader: ReadableStreamDefaultReader<VideoFrame> = trackProcessor.readable.getReader();

  try {
    while (true) {
      if (signal?.aborted) break;
      if (video.ended) break;

      // eslint-disable-next-line no-await-in-loop
      const result: ReadableStreamReadResult<VideoFrame> = await reader.read();
      if (result.done) break;
      yield result.value;
    }
  } finally {
    video.pause();
    video.src = '';
    track.stop();
  }
}

export default generate;
