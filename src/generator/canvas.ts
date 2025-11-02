const generate = (): Promise<VideoFrame | null> => {
  // eslint-disable-next-line no-console
  console.log('Generating frame from canvas');

  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

  if (!ctx) {
    return Promise.resolve(null);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);

  const videoFrame: VideoFrame = new VideoFrame(canvas, {timestamp: 0});

  return Promise.resolve(videoFrame);
};

export default generate;
