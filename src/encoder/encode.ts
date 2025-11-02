const encode = (encoder: VideoEncoder, videoFrame: VideoFrame): void => {
  let frameCounter: number = 0;

  if (encoder.encodeQueueSize > 2) {
    // Too many frames in flight, encoder is overwhelmed, let's drop this frame.
    // eslint-disable-next-line no-console
    console.log('Dropping frame t: ', videoFrame.timestamp);
    videoFrame.close();
  } else {
    frameCounter++;
    const keyFrame: boolean = frameCounter % 150 === 0;
    encoder.encode(videoFrame, {keyFrame});
    videoFrame.close();
  }
};

export default encode;
