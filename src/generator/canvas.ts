const generate = (): VideoFrame | null => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);

  const videoFrame = new VideoFrame(canvas, {timestamp: 0});

  return videoFrame;
};

export default generate;
