async function* generate(): AsyncGenerator<VideoFrame> {
  // eslint-disable-next-line no-console
  console.log('Generating frame from pixel');

  const pixelSize: number = 4;
  const init: VideoFrameBufferInit = {
    timestamp: 0,
    codedWidth: 320,
    codedHeight: 200,
    format: 'RGBA'
  };

  const data: Uint8Array = new Uint8Array(init.codedWidth * init.codedHeight * pixelSize);
  for (let x: number = 0; x < init.codedWidth; x++) {
    for (let y: number = 0; y < init.codedHeight; y++) {
      const offset: number = (y * init.codedWidth + x) * pixelSize;
      data[offset] = 0x7f; // Red
      data[offset + 1] = 0xff; // Green
      data[offset + 2] = 0xd4; // Blue
      data[offset + 3] = 0x0ff; // Alpha
    }
  }

  const videoFrame: VideoFrame = new VideoFrame(data, init);

  yield videoFrame;
}

export default generate;
