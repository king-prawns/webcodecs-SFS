const generate = async (): Promise<VideoFrame | null> => {
  // eslint-disable-next-line no-console
  console.log('Generating frame from camera');

  let videoFrame: VideoFrame | null = null;

  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true});
  const track: MediaStreamTrack = stream.getTracks()[0];

  const trackProcessor: MediaStreamTrackProcessor = new MediaStreamTrackProcessor(track);

  const reader: ReadableStreamDefaultReader<VideoFrame> = trackProcessor.readable.getReader();

  // while (true) {
  const result: ReadableStreamReadResult<VideoFrame> = await reader.read();
  if (result.value) {
    videoFrame = result.value;
  }
  // }

  track.stop();

  return videoFrame;
};

export default generate;
