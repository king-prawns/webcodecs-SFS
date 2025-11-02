const generate = async (): Promise<VideoFrame | null> => {
  let videoFrame: VideoFrame | null = null;

  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true});
  const track: MediaStreamTrack = stream.getTracks()[0];

  const trackProcessor: MediaStreamTrackProcessor = new MediaStreamTrackProcessor(track);

  const reader: ReadableStreamDefaultReader<VideoFrame> = trackProcessor.readable.getReader();
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const result: ReadableStreamReadResult<VideoFrame> = await reader.read();
    if (result.done) break;
    videoFrame = result.value;
  }

  return videoFrame;
};

export default generate;
