const pendingFrames: Array<VideoFrame> = [];
let underflow: boolean = true;
let baseTime: number = 0;

const handleFrame: VideoFrameOutputCallback = (frame: VideoFrame) => {
  pendingFrames.push(frame);
  if (underflow) setTimeout(renderFrame, 0);
};

const calculateTimeUntilNextFrame = (timestamp: number): number => {
  if (baseTime === 0) baseTime = performance.now();
  const mediaTime: number = performance.now() - baseTime;

  return Math.max(0, timestamp / 1000 - mediaTime);
};

const renderFrame = async (): Promise<void> => {
  const canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!ctx) return;

  underflow = pendingFrames.length === 0;
  if (underflow) return;

  const frame: VideoFrame | undefined = pendingFrames.shift();
  if (!frame) return;

  // Based on the frame's timestamp calculate how much of real time waiting
  // is needed before showing the next frame.
  const timeUntilNextFrame: number = calculateTimeUntilNextFrame(frame.timestamp);
  await new Promise((r: (value: unknown) => void) => {
    setTimeout(r, timeUntilNextFrame);
  });
  ctx.drawImage(frame, 0, 0);
  frame.close();

  // Immediately schedule rendering of the next frame
  setTimeout(renderFrame, 0);
};

const decoder = async (/* handleFrame: VideoFrameOutputCallback */): Promise<VideoDecoder | null> => {
  let decoder: VideoDecoder | null = null;

  const init: VideoDecoderInit = {
    output: handleFrame,
    error: (e: DOMException) => {
      // eslint-disable-next-line no-console
      console.log('Decoder error: ', e.message);
    }
  };

  const config: VideoDecoderConfig = {
    codec: 'vp8',
    codedWidth: 640,
    codedHeight: 480
  };

  const {supported} = await VideoDecoder.isConfigSupported(config);
  if (supported) {
    decoder = new VideoDecoder(init);
    decoder.configure(config);
  } else {
    // eslint-disable-next-line no-console
    console.log('Configuration not supported', config);
  }

  return decoder;
};

export default decoder;
